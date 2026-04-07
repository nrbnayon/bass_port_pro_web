"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  ViewIcon,
  TemperatureIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { reports as fallbackReports } from "@/data/landingData";
import { TablePagination } from "@/components/Shared/TablePagination";
import { toast } from "sonner";
import ReportModal from "./ReportModal";
import { LakeViewModel } from "@/lib/lakeMappers";
import { ReportCard } from "@/types/landingData.types";
import { useGetLakeReportsQuery } from "@/redux/services/lakesApi";
import { useSubmitReportMutation } from "@/redux/services/fishingReportApi";
import { useUser } from "@/hooks/useUser";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";

interface LakeReportsListProps {
  lake: LakeViewModel;
  lakeId: string;
}

const parseNumberFromString = (value?: string) => {
  const parsed = Number((value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeConditionValue = (value: string | undefined, allowed: string[]) =>
  value && allowed.includes(value) ? value : "";

export default function LakeReportsList({ lake, lakeId }: LakeReportsListProps) {
  const { isAuthenticated } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localReports, setLocalReports] = useState<ReportCard[]>(fallbackReports);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; view: AuthView }>({
    isOpen: false,
    view: "login",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { data, isError, refetch, isFetching } = useGetLakeReportsQuery(
    { id: lakeId, page: currentPage, limit: itemsPerPage },
    { skip: !lakeId },
  );
  const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation();

  const fallbackFiltered = useMemo(
    () =>
      localReports.filter(
        (report) =>
          report.lake.toLowerCase().includes(lake.name.toLowerCase()) ||
          lake.name.toLowerCase().includes(report.lake.toLowerCase()),
      ),
    [localReports, lake.name],
  );

  const pagedFallback = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return fallbackFiltered.slice(start, start + itemsPerPage);
  }, [fallbackFiltered, currentPage]);

  const apiReports: ReportCard[] = (data?.reports || []).map((report) => ({
    id: report._id,
    angler: report.user?.name || "Unknown",
    date: new Date(report.fishedAt).toISOString().split("T")[0],
    lake: report.lakeName || lake.name,
    score: `${report.score || 0}%`,
    temp: report.conditions?.temp || "N/A",
    catches: `${report.catchCount || 0} catches`,
    text: report.text,
    tags: report.tags || [],
    avatarImage: report.user?.avatar || "/images/avatar.png",
    biggestCatch: `${report.biggestCatch || 0} lbs`,
    weather: report.conditions?.weather || "N/A",
    waterLevel: report.conditions?.waterLevel || "Normal",
    clarity: report.conditions?.clarity || "Clear",
    pressure: report.conditions?.pressure || "Stable",
  }));

  const displayReports = isError ? pagedFallback : apiReports;
  const totalItems = isError ? fallbackFiltered.length : data?.pagination.total || 0;
  const totalPages = isError ? Math.ceil(fallbackFiltered.length / itemsPerPage) : data?.pagination.pages || 1;

  const handleAddReport = async (newReport: ReportCard) => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, view: "login" });
      return;
    }

    if (!lakeId) {
      setLocalReports((prev) => [newReport, ...prev]);
      toast.success("Fishing report shared locally!");
      setCurrentPage(1);
      return;
    }

    try {
      await submitReport({
        lakeId,
        lakeName: lake.name,
        title: `${lake.name} trip report`,
        text: newReport.text || "",
        tags: newReport.tags || [],
        conditions: {
          temp: newReport.temp,
          weather: sanitizeConditionValue(newReport.weather, [
            "Sunny",
            "Clear",
            "Partly Cloudy",
            "Overcast",
            "Rainy",
            "Windy",
            "Stormy",
          ]),
          clarity: sanitizeConditionValue(newReport.clarity, ["Clear", "Stained", "Muddy"]),
          waterLevel: sanitizeConditionValue(newReport.waterLevel, [
            "Normal",
            "High",
            "Low",
            "Rising",
            "Falling",
          ]),
          pressure: sanitizeConditionValue(newReport.pressure, ["Stable", "Rising", "Falling"]),
        },
        catchCount: parseNumberFromString(newReport.catches),
        biggestCatch: parseNumberFromString(newReport.biggestCatch),
        fishedAt: newReport.date,
      }).unwrap();

      toast.success("Fishing report shared successfully!");
      setCurrentPage(1);
      refetch();
    } catch {
      setLocalReports((prev) => [newReport, ...prev]);
      toast.error("API failed. Saved to local fallback list.");
      setCurrentPage(1);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Angler Activity ({totalItems})
        </h2>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              setAuthModal({ isOpen: true, view: "login" });
            } else {
              setIsModalOpen(true);
            }
          }}
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

      <section>
        {isError && (
          <p className="mb-4 text-xs font-semibold text-amber-600">
            API unavailable. Showing fallback reports.
          </p>
        )}

        {displayReports.length === 0 && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 rounded-2xl border border-[#F3F4F6] bg-white">
            <HugeiconsIcon icon={Calendar01Icon} className="mb-4 h-12 w-12" />
            <p className="text-lg font-semibold">No reports available for this lake yet.</p>
            <p className="text-sm">Be the first to share your fishing experience!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {displayReports.map((report, index) => (
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
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden ring-2 ring-primary/5">
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
                        <span className="text-lg font-bold text-primary">{report.catches}</span>
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
                      {report.tags?.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
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
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  className="border-none bg-transparent px-0"
                />
              </div>
            )}
          </div>
        )}
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
