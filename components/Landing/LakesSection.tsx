"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PreferenceHorizontalIcon,
  ArrowDown01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { lakes } from "@/data/landingData";
import { FilterX } from "lucide-react";
import LakeCard from "./LakeCard";
import { TablePagination } from "@/components/Shared/TablePagination";
import { LakeGridSkeleton } from "@/components/Skeleton/LakeGridSkeleton";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter states
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  const totalPages = Math.ceil(filteredLakes.length / itemsPerPage);
  const paginatedLakes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLakes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLakes, currentPage]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedRegion("All");
    setSelectedState("All");
    setSelectedCondition("All");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to section start on page change
    document.getElementById("lakes")?.scrollIntoView({ behavior: "smooth" });
  };

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
              className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-medium transition-all cursor-pointer ${
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

        {isLoading ? (
          <LakeGridSkeleton count={8} />
        ) : paginatedLakes.length > 0 ? (
          <>
            <motion.div
              layout
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {paginatedLakes.map((lake) => (
                  <LakeCard key={lake.id} lake={lake} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredLakes.length > itemsPerPage && (
              <div className="mt-12">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredLakes.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  className="border-none bg-gray-50/50 rounded-2xl"
                />
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 flex flex-col items-center justify-center text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <FilterX className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-[#1A2B42]">
              No lakes found
            </h3>
            <p className="mt-2 text-[#64748B]">
              We couldn&apos;t find any lakes matching your current search or
              filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
