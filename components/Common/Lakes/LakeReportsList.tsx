"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  ViewIcon,
  TemperatureIcon,
} from "@hugeicons/core-free-icons";
import { reports as allReports } from "@/data/landingData";
import { LakeCard } from "@/types/landingData.types";

interface LakeReportsListProps {
  lake: LakeCard;
}

export default function LakeReportsList({ lake }: LakeReportsListProps) {
  // Filter reports for this lake
  const reports = allReports.filter(
    (r) =>
      r.lake.toLowerCase().includes(lake.name.toLowerCase()) ||
      lake.name.toLowerCase().includes(r.lake.toLowerCase()),
  );

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <HugeiconsIcon icon={Calendar01Icon} className="mb-4 h-12 w-12" />
        <p className="text-lg font-semibold">
          No reports available for this lake yet.
        </p>
        <p className="text-sm">
          Be the first to share your fishing experience!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {reports.map((report, index) => (
        <motion.article
          key={report.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white p-6 transition-all hover:shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${report.avatarColor || "bg-primary"} text-white`}
              >
                <span className="text-lg font-bold">
                  {report.angler.charAt(0)}
                </span>
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
                  Biggest: 7.8 lbs
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
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-bold">
                <HugeiconsIcon icon={TemperatureIcon} className="h-4 w-4" />
                {report.temp}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 text-blue-600 px-3 py-1.5 text-xs font-bold">
                <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                Partly Cloudy
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Rising
              </div>
            </div>

            <div className="flex gap-2">
              {report.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 uppercase tracking-tight"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
