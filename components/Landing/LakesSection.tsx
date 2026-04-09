/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PreferenceHorizontalIcon,
  ArrowDown01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { FilterX } from "lucide-react";
import LakeCard from "../AuthProtected/User/Lakes/LakeCard";
import { TablePagination } from "@/components/Shared/TablePagination";
import { LakeGridSkeleton } from "@/components/Skeleton/LakeGridSkeleton";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { usePathname } from "next/navigation";
import { useGetLakesQuery } from "@/redux/services/lakesApi";
import { getFallbackLakes, mapApiLakeToView } from "@/lib/lakeMappers";
import { useUser } from "@/hooks/useUser";

const sortOptions = [
  { label: "Sort by Rating", value: "rating" },
  { label: "Sort by Name", value: "name" },
  { label: "Sort by Size", value: "size" },
  { label: "Sort by Catch Rate", value: "catchRate" },
  { label: "Sort by Record Bass", value: "recordBass" },
];

const regionMap: Record<string, string[]> = {
  South: ["Texas", "Alabama", "Florida", "Tennessee", "South Carolina"],
  West: ["California"],
  Midwest: ["Michigan", "Ohio"],
  Northeast: [],
};

const statesList = [
  "All",
  "Texas",
  "Alabama",
  "Florida",
  "Tennessee",
  "California",
  "Michigan",
  "Ohio",
  "South Carolina",
];

export default function LakesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isUserLoading } = useUser();

  const search = searchParams.get("search") || "";
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    view: AuthView;
  }>({
    isOpen: false,
    view: "login",
  });
  const [sortBy, setSortBy] = useState<
    "rating" | "name" | "size" | "catchRate"
  >("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");

  // API Call
  const {
    data: apiLakesData,
    isLoading: isLakesLoading,
    isError: isLakesError,
  } = useGetLakesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: search || undefined,
    state: selectedState !== "All" ? selectedState : undefined,
    condition: selectedCondition !== "All" ? selectedCondition : undefined,
    sortBy: sortBy,
    order: "desc",
    _auth: isUserLoading
      ? "checking"
      : isAuthenticated
        ? "authenticated"
        : "guest",
  });

  const lakes = useMemo(() => {
    if (apiLakesData?.lakes?.length) {
      let result = apiLakesData.lakes.map(mapApiLakeToView);

      // Apply Local Region filtering if needed (since API might not support region parameter directly)
      if (selectedRegion !== "All") {
        const allowedStates = regionMap[selectedRegion] || [];
        result = result.filter((lake) => allowedStates.includes(lake.state));
      }

      return result;
    }

    // Fallback data logic
    if (isLakesError || (!isLakesLoading && !apiLakesData?.lakes?.length)) {
      // Only filter fallback data if we are actually at the beginning or explicitly in error
      const fallback = getFallbackLakes().filter((lake) => {
        const matchesSearch =
          !search ||
          lake.name.toLowerCase().includes(search.toLowerCase()) ||
          lake.state.toLowerCase().includes(search.toLowerCase());
        const matchesState =
          selectedState === "All" || lake.state === selectedState;
        const matchesCondition =
          selectedCondition === "All" || lake.condition === selectedCondition;
        const matchesRegion =
          selectedRegion === "All" ||
          regionMap[selectedRegion]?.includes(lake.state);

        return (
          matchesSearch && matchesState && matchesCondition && matchesRegion
        );
      });

      fallback.sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return b.size - a.size;
        if (sortBy === "catchRate") return b.catchRate - a.catchRate;
        return 0;
      });

      return fallback.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );
    }

    return [];
  }, [
    apiLakesData,
    isLakesError,
    isLakesLoading,
    search,
    selectedState,
    selectedRegion,
    selectedCondition,
    sortBy,
    currentPage,
  ]);

  const totalItems = apiLakesData?.pagination?.total || 48; // Default fallback total
  const totalPages =
    apiLakesData?.pagination?.pages || Math.ceil(48 / itemsPerPage);

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    handleSearchChange("");
    setSelectedRegion("All");
    setSelectedState("All");
    setSelectedCondition("All");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("lakes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="lakes" className="bg-white py-20 pb-32">
      <div className="container-1620">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3515] px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
            <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
            Lake intelligence Database
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
            Top Bass Fishing Lakes
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[#4B5563] md:text-base">
            Explore our curated database of premier bass fishing destinations
            with real-time conditions and expert insights.
          </p>
        </motion.div>

        {isLakesError && (
          <p className="mt-4 text-center text-xs font-semibold text-amber-600">
            API unavailable. Showing fallback lake data.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by lake name, state, species, or technique..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border-none bg-[#F8FAFC] py-4 pl-12 pr-4 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="appearance-none rounded-xl border-none bg-[#F8FAFC] py-4 pl-5 pr-12 text-sm font-medium text-foreground outline-none cursor-pointer hover:bg-gray-100/50 transition-colors focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-gray-400"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition-all cursor-pointer ${
                  showFilters
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                <HugeiconsIcon
                  icon={PreferenceHorizontalIcon}
                  className="h-5 w-5"
                />
                Filters
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex flex-col gap-6 py-3 px-4  border-t border-gray-100 md:flex-row overflow-hidden"
              >
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                    Region
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setCurrentPage(1);
                      }}
                      aria-label="Region"
                      className="w-full appearance-none rounded-xl border-none bg-[#F8FAFC] py-3.5 px-5 text-sm font-medium text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary"
                    >
                      {["All", "South", "West", "Midwest", "Northeast"].map(
                        (r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ),
                      )}
                    </select>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                    State
                  </label>
                  <div className="relative">
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none rounded-xl border-none bg-[#F8FAFC] py-3.5 px-5 text-sm font-medium text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary"
                    >
                      {statesList.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                    Condition
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCondition}
                      onChange={(e) => {
                        setSelectedCondition(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none rounded-xl border-none bg-[#F8FAFC] py-3.5 px-5 text-sm font-medium text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary"
                    >
                      {["All", "Excellent", "Good", "Fair", "Poor"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            Showing{" "}
            <span className="font-semibold">
              {apiLakesData?.pagination?.total || lakes.length}
            </span>{" "}
            lakes
          </p>
        </div>

        {isLakesLoading && !apiLakesData ? (
          <LakeGridSkeleton count={8} />
        ) : lakes.length > 0 ? (
          <>
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {lakes.map((lake) => (
                  <LakeCard key={lake.id} lake={lake} />
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-12">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
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
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              No lakes found
            </h3>
            <p className="mt-2 text-[#64748B]">
              We couldn&apos;t find any lakes matching your current search or
              filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer border-none"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        redirectTo={pathname}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
