"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PreferenceHorizontalIcon,
  ArrowDown01Icon,
  Location01Icon,
  StarIcon,
  FavouriteIcon,
  TemperatureIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { lakes } from "@/data/landingData";
import { LakeCard } from "@/types/landingData.types";
import { Fish } from "lucide-react";

const sortOptions = [
  { label: "Sort by Rating", value: "rating" },
  { label: "Sort by Name", value: "name" },
  { label: "Sort by Size", value: "size" },
  { label: "Sort by Catch Rate", value: "catchRate" },
  { label: "Sort by Record Bass", value: "recordBass" },
];

export default function LakesSection() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");

  const filteredLakes = useMemo(() => {
    const result = lakes.filter((lake) => {
      const matchesSearch =
        lake.name.toLowerCase().includes(search.toLowerCase()) ||
        lake.state.toLowerCase().includes(search.toLowerCase()) ||
        lake.species.some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesState =
        selectedState === "All" || lake.state === selectedState;
      const matchesCondition =
        selectedCondition === "All" || lake.condition === selectedCondition;

      // Region mapping (custom logic for this demo)
      const regionMap: Record<string, string[]> = {
        South: ["Texas", "Alabama", "Florida", "Tennessee", "South Carolina"],
        West: ["California"],
        Midwest: ["Michigan", "Ohio"],
        Northeast: [],
      };
      const matchesRegion =
        selectedRegion === "All" ||
        regionMap[selectedRegion]?.includes(lake.state);

      return matchesSearch && matchesState && matchesCondition && matchesRegion;
    });

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "size") return b.size - a.size;
      if (sortBy === "catchRate") return b.catchRate - a.catchRate;
      if (sortBy === "recordBass") return b.recordBass - a.recordBass;
      return 0;
    });

    return result;
  }, [search, sortBy, selectedRegion, selectedState, selectedCondition]);

  return (
    <section id="lakes" className="bg-white py-20 pb-32">
      <div className="container-1620">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3515] px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
            <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
            Lake intelligence Database
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-[#1A2B42] md:text-4xl lg:text-5xl">
            Top Bass Fishing Lakes
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[#4B5563] md:text-base">
            Explore our curated database of premier bass fishing destinations
            with real-time conditions and expert insights.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground"
            />
            <input
              type="text"
              placeholder="Search by lake name, state, species, or technique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-sm text-[#1A2B42] shadow-sm ring-1 ring-[#E2E8F0] focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border-none bg-white py-4 pl-5 pr-12 text-sm font-medium text-[#1A2B42] shadow-sm ring-1 ring-[#E2E8F0] outline-none cursor-pointer focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 pointer-events-none text-foreground"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-medium transition-all ${
                showFilters
                  ? "bg-primary text-white shadow-lg shadow-primary/20 ring-primary"
                  : "bg-white text-[#1A2B42] shadow-sm ring-1 ring-[#E2E8F0] hover:bg-gray-50"
              }`}
            >
              <HugeiconsIcon
                icon={PreferenceHorizontalIcon}
                className={`h-5 w-5 ${showFilters ? "text-white" : "text-foreground"}`}
              />
              Filters
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-[#E2E8F0]"
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-[#1A2B42]">
                    Region
                  </h4>
                  <div className="space-y-2">
                    {["All", "South", "West", "Midwest", "Northeast"].map(
                      (region) => (
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${region === selectedRegion ? "bg-[#3B82F6] text-white" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1A2B42]"}`}
                        >
                          {region}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-[#1A2B42]">
                    State
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "All",
                      "Texas",
                      "Alabama",
                      "Florida",
                      "Tennessee",
                      "California",
                      "Michigan",
                      "Ohio",
                      "South Carolina",
                    ].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedState(st)}
                        className={`rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${st === selectedState ? "bg-[#3B82F6] text-white" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1A2B42]"}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-[#1A2B42]">
                    Condition
                  </h4>
                  <div className="space-y-2">
                    {["All", "Excellent", "Good", "Fair", "Poor"].map(
                      (cond) => (
                        <button
                          key={cond}
                          onClick={() => setSelectedCondition(cond)}
                          className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${cond === selectedCondition ? "bg-[#3B82F6] text-white" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1A2B42]"}`}
                        >
                          {cond}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[#1A2B42]">
            Showing{" "}
            <span className="font-semibold">{filteredLakes.length}</span> lakes
          </p>
        </div>

        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredLakes.map((lake) => (
              <LakeCardComponent key={lake.id} lake={lake} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function LakeCardComponent({ lake }: { lake: LakeCard }) {
  const conditionColor = {
    Excellent: "bg-[#22C55E]",
    Good: "bg-[#3B82F6]",
    Fair: "bg-[#F59E0B]",
    Poor: "bg-[#EF4444]",
  }[lake.condition];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border-x border-b border-t-0 border-solid border-[#F3F4F6] transition-all hover:shadow-xs hover:ring-1 hover:ring-primary/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={lake.image}
          alt={lake.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00000088] via-transparent to-transparent opacity-60" />

        <div className="absolute left-3 top-3">
          <span
            className={`${conditionColor} rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white`}
          >
            {lake.condition}
          </span>
        </div>

        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D94D] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-primary cursor-pointer">
          <HugeiconsIcon
            icon={FavouriteIcon}
            className="h-5 w-5"
            strokeWidth={2}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
            <span className="text-xs font-semibold">{lake.state}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-[#00000066] px-2 py-1 backdrop-blur-sm">
            <HugeiconsIcon icon={StarIcon} className="h-3 w-3 text-[#F59E0B]" />
            <span className="text-xs font-semibold">{lake.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-[#1A2B42] group-hover:text-primary transition-colors leading-tight">
          {lake.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#64748B]">
          {lake.description}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#1111110D] py-3 transition-colors group-hover:bg-black/5">
            <HugeiconsIcon
              icon={TemperatureIcon}
              className="h-5 w-5 text-[#EF4444]"
            />
            <span className="mt-1 text-xs font-semibold text-[#1A2B42]">
              {lake.temp}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#1111110D] py-3 transition-colors group-hover:bg-black/5">
            <HugeiconsIcon icon={ViewIcon} className="h-5 w-5 text-[#3B82F6]" />
            <span className="mt-1 text-xs font-semibold text-[#1A2B42]">
              {lake.clarity}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#1111110D] py-3 transition-colors group-hover:bg-black/5">
            <Fish className="h-5 w-5 text-[#22C55E]" />
            <span className="mt-1 text-xs font-semibold text-[#1A2B42]">
              {lake.catchRate}/hr
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {lake.species.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-full bg-[#3060D91A] px-2.5 py-1 text-xs font-semibold text-blue"
            >
              {s}
            </span>
          ))}
          {lake.species.length > 2 && (
            <span className="rounded-full bg-[#1111111A] px-2.5 py-1 text-xs font-semibold text-foreground">
              +{lake.species.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
