"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PreferenceHorizontalIcon,
  ArrowDown01Icon,
  Location01Icon,
  ReloadIcon,
} from "@hugeicons/core-free-icons";
import { lakes } from "@/data/landingData";
import LakeCard from "./LakeCard";
import { LakeGridSkeleton } from "../Skeleton/LakeGridSkeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  // Mock loading state
  useEffect(() => {
    // Only handle turning loading OFF. 
    // Turning it ON is now handled by the event handlers for better performance.
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [search, sortBy, selectedRegion, selectedState, selectedCondition]);

  const resetFilters = () => {
    setIsLoading(true);
    setSearch("");
    setSortBy("rating");
    setSelectedRegion("All");
    setSelectedState("All");
    setSelectedCondition("All");
  };

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
              onChange={(e) => {
                setIsLoading(true);
                setSearch(e.target.value);
              }}
              className="w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-sm text-[#1A2B42] shadow-sm ring-1 ring-[#E2E8F0] focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setIsLoading(true);
                  setSortBy(e.target.value);
                }}
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
                          onClick={() => {
                            if (region !== selectedRegion) {
                              setIsLoading(true);
                              setSelectedRegion(region);
                            }
                          }}
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
                        onClick={() => {
                          if (st !== selectedState) {
                            setIsLoading(true);
                            setSelectedState(st);
                          }
                        }}
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
                          onClick={() => {
                          if (cond !== selectedCondition) {
                            setIsLoading(true);
                            setSelectedCondition(cond);
                          }
                        }}
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

        {isLoading ? (
          <LakeGridSkeleton count={8} />
        ) : filteredLakes.length > 0 ? (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredLakes.map((lake) => (
                <LakeCard key={lake.id} lake={lake} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 flex flex-col items-center justify-center text-center py-20 px-4 bg-[#F8FAFC] rounded-[32px] border-2 border-dashed border-gray-200"
          >
            <div className="relative mb-6">
              <div className="absolute -inset-4 rounded-full bg-primary/5 animate-pulse" />
              <div className="relative h-20 w-20 flex items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
                <HugeiconsIcon 
                  icon={Search01Icon} 
                  className="h-10 w-10 text-gray-400" 
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1A2B42]">No Lakes Found</h3>
            <p className="mt-2 max-w-[400px] text-gray-500 text-sm leading-relaxed">
              We couldn&apos;t find any lakes matching your current search or filters. 
              Try adjusting your criteria or clear all filters to start over.
            </p>
            <button
              onClick={resetFilters}
              className="mt-8 flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 hover:shadow-primary/40"
            >
              <HugeiconsIcon icon={ReloadIcon} className="h-4 w-4" strokeWidth={2.5} />
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
