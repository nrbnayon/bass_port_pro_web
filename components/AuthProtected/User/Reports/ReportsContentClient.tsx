"use client";

import { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  ArrowDown01Icon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";
import { Fish } from "lucide-react";
import { reports as initialReports } from "@/data/landingData";
import { ReportCard as ReportCardType } from "@/types/landingData.types";

import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { TablePagination } from "@/components/Shared/TablePagination";
import { ReportListSkeleton } from "@/components/Skeleton/ReportListSkeleton";
import ReportCard from "./ReportCard";
import ReportModal from "./ReportModal";
import { useUser } from "@/hooks/useUser";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { usePathname } from "next/navigation";

export default function ReportsContentClient() {
  const [reports, setReports] = useState<ReportCardType[]>(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLake, setSelectedLake] = useState("All Lakes");
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; view: AuthView }>({
    isOpen: false,
    view: "login",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddReport = (newReport: ReportCardType) => {
    setReports([newReport, ...reports]);
    toast.success("Fishing report shared successfully!");
  };

  const filteredReports = useMemo(() => {
    let result = [...reports];

    // Filter by lake
    if (selectedLake !== "All Lakes") {
      result = result.filter((r) => r.lake === selectedLake);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.angler?.toLowerCase().includes(searchQuery) ||
          r.lake?.toLowerCase().includes(searchQuery) ||
          r.text?.toLowerCase().includes(searchQuery) ||
          (r.tags && r.tags.some((tag) => tag.toLowerCase().includes(searchQuery))),
      );
    }

    return result;
  }, [reports, selectedLake, searchQuery]);

  // Paginated Results
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset to first page when filtering or searching changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedLake, searchQuery]);

  // Get unique lakes for filter
  const uniqueLakes = [
    "All Lakes",
    ...Array.from(new Set(reports.map((r) => r.lake))),
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <section className="bg-white pt-28 md:pt-40 pb-8">
        <div className="w-full px-4 md:max-w-[1320px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE6] px-5 py-2.5 text-xs font-semibold text-primary ring-1 ring-primary/10">
                <Fish className="w-4 h-4" />
                Fishing Reports
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground max-w-xl">
                Latest Reports
              </h1>
              <p className="font-medium text-gray-400 max-w-xl leading-relaxed">
                Real-time conditions and catch reports from anglers
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Lake Filter */}
              <div className="relative group">
                <select
                  value={selectedLake}
                  onChange={(e) => setSelectedLake(e.target.value)}
                  className="appearance-none bg-gray-100 text-foreground rounded-lg px-8 py-3 text-sm font-semibold pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-none cursor-pointer hover:bg-gray-200"
                >
                  {uniqueLakes.map((lake) => (
                    <option key={lake} value={lake}>
                      {lake}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform">
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthModal({ isOpen: true, view: "login" });
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-primary/10"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <main className="w-full px-4 md:max-w-[1320px] mx-auto min-h-[600px]">
        {isLoading ? (
          <div className="w-full">
            <ReportListSkeleton count={3} />
          </div>
        ) : paginatedReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
              <HugeiconsIcon
                icon={DashboardSquare01Icon}
                className="h-10 w-10"
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              No reports found
            </h3>
            <p className="text-gray-400 font-medium mt-2">
              Try adjusting your search or filters to see more results.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Reports List */}
            <div className="flex flex-col gap-6">
              {paginatedReports.map((report, index) => (
                <ReportCard key={report.id} report={report} index={index} />
              ))}
            </div>

            {/* Pagination Component */}
            {totalItems > itemsPerPage && (
              <div className="mt-12">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => setItemsPerPage(size)}
                  className="border-none bg-transparent px-0"
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReport}
      />
      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        redirectTo={pathname}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
