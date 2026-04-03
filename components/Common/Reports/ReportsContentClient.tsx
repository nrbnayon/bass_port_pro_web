"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  ArrowDown01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { Fish } from "lucide-react";
import { reports as initialReports } from "@/data/landingData";
import { ReportCard as ReportCardType } from "@/types/landingData.types";
import ReportCard from "@/components/Common/Reports/ReportCard";
import ReportModal from "@/components/Common/Reports/ReportModal";
import { toast } from "sonner";

export default function ReportsContentClient() {
  const [reports, setReports] = useState<ReportCardType[]>(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLake, setSelectedLake] = useState("All Lakes");

  const handleAddReport = (newReport: ReportCardType) => {
    setReports([newReport, ...reports]);
    toast.success("Fishing report shared successfully!");
  };

  const filteredReports =
    selectedLake === "All Lakes"
      ? reports
      : reports.filter((r) => r.lake === selectedLake);

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
                  className="appearance-none bg-gray-100 text-foreground rounded-lg px-8 py-3 text-sm font-semibold pr-12 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 transition-all border-none cursor-pointer hover:bg-gray-200"
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
                onClick={() => setIsModalOpen(true)}
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
        <div className="w-full">
          {/* Reports List */}
          <div className="flex flex-col">
            {filteredReports.map((report, index) => (
              <ReportCard key={report.id} report={report} index={index} />
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[24px] border border-dashed border-gray-200 shadow-sm">
                <HugeiconsIcon
                  icon={FilterIcon}
                  className="w-12 h-12 text-gray-300 mx-auto mb-4"
                />
                <p className="text-gray-400 font-bold">
                  No reports found for this lake.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReport}
      />
    </div>
  );
}
