"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  ViewIcon,
  TemperatureIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { reports as allReports } from "@/data/landingData";
import { LakeCard, ReportCard } from "@/types/landingData.types";
import { TablePagination } from "@/components/Shared/TablePagination";
import { toast } from "sonner";
import ReportModal from "./ReportModal";

interface LakeReportsListProps {
  lake: LakeCard;
}

export default function LakeReportsList({ lake }: LakeReportsListProps) {
  const [reports, setReports] = useState<ReportCard[]>(allReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter reports for this lake
  const filteredReports = reports.filter(
    (r) =>
      r.lake.toLowerCase().includes(lake.name.toLowerCase()) ||
      lake.name.toLowerCase().includes(r.lake.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddReport = (newReport: ReportCard) => {
    setReports([newReport, ...reports]);
    toast.success("Fishing report shared successfully!");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Share Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
           Angler Activity ({filteredReports.length})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <HugeiconsIcon icon={Message01Icon} className="h-4 w-4" />
          Share Your Experience
        </button>
      </div>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReport}
        lake={lake}
      />

      {/* Reports List Section */}
      <section>
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 rounded-2xl border border-[#F3F4F6] bg-white">
            <HugeiconsIcon icon={Calendar01Icon} className="mb-4 h-12 w-12" />
            <p className="text-lg font-semibold">No reports available for this lake yet.</p>
            <p className="text-sm">Be the first to share your fishing experience!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {currentReports.map((report, index) => (
                <motion.article
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white p-6 transition-all hover:shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden ring-2 ring-primary/5"
                      >
                        {report.avatarImage ? (
                          <Image
                            src={report.avatarImage}
                            alt={report.angler}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {report.angler.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground leading-none mb-1.5">
                          {report.angler}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                          <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4" />
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-primary">
                          {report.catches}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 leading-none">
                          Biggest: {report.biggestCatch}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-50 pt-2">
                    <p className="text-sm font-medium leading-relaxed text-secondary line-clamp-3">
                      {report.text}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-bold">
                        <HugeiconsIcon icon={TemperatureIcon} className="h-4 w-4" />
                        {report.temp}
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 px-3 py-1.5 text-xs font-bold">
                        <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                        {report.weather}
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                        {report.waterLevel}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {report.tags?.map((tag, i) => (
                        <span
                          key={`${tag}-${i}`}
                          className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-tight"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredReports.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  className="border-none bg-transparent px-0"
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
