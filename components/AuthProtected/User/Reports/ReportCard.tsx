"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Location01Icon,
  TemperatureIcon,
  ViewIcon,
  CloudIcon,
} from "@hugeicons/core-free-icons";
import { Trophy, Fish, Gauge } from "lucide-react";
import { ReportCard as ReportCardType } from "@/types/landingData.types";
import { resolveMediaUrl } from "@/lib/utils";

interface ReportCardProps {
  report: ReportCardType;
  index: number;
}

export default function ReportCard({ report, index }: ReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 mb-6 border border-[#F3F4F6] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {report.avatarImage &&
            !report.avatarImage.includes("avatar.png") ? (
              <Image
                src={resolveMediaUrl(report.avatarImage)}
                alt={report.angler}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              report.angler.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground leading-tight">
                {report.angler}
              </h3>
              {report.status === "pending" && (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700">
                  Under Review
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-primary text-xs font-medium mt-0.5 opacity-90 transition-opacity hover:opacity-100 cursor-pointer">
              <HugeiconsIcon icon={Location01Icon} className="w-3 h-3" />
              <span>{report.lake}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs font-medium">
          <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4" />
          <span>{report.date}</span>
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {/* Water Temp */}
        <div className="bg-[#FF6B3533] rounded-2xl p-3 flex items-center gap-3">
          <div className="flex items-center justify-center text-primary shrink-0">
            <HugeiconsIcon icon={TemperatureIcon} className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold tracking-[0.05em]">
              Water Temp
            </p>
            <p className="text-sm font-semibold text-foreground">
              {report.temp}
            </p>
          </div>
        </div>

        {/* Clarity */}
        <div className="bg-[#3060D933] rounded-2xl p-3 flex items-center gap-3">
          <div className="flex items-center justify-center text-[#3060D9] shrink-0">
            <HugeiconsIcon icon={ViewIcon} className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold tracking-[0.05em]">
              Clarity
            </p>
            <p className="text-sm font-black text-foreground">
              {report.clarity}
            </p>
          </div>
        </div>

        {/* Weather */}
        <div className="bg-[#9A9CA21A] rounded-2xl p-3 flex items-center gap-3">
          <div className="flex items-center justify-center text-[#9A9CA2] shrink-0">
            <HugeiconsIcon icon={CloudIcon} className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold tracking-[0.05em]">
              Weather
            </p>
            <p className="text-sm font-black text-foreground">
              {report.weather}
            </p>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-[#FF00C81A] rounded-2xl p-3 flex items-center gap-3">
          <div className="flex items-center justify-center text-[#FF00C8] shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-bold tracking-[0.05em]">
              Pressure
            </p>
            <p className="text-sm font-black text-foreground">
              {report.pressure}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-[#4B5563] leading-relaxed font-medium">
          {report.text}
        </p>
      </div>

      {/* Footer / Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#F9FAFB]">
        <div className="flex items-center gap-1.5 bg-[#DCFCE7] text-[#166534] px-3 py-1.5 rounded-lg text-[11px] font-black">
          <Fish className="w-3.5 h-3.5" />
          {report.catches?.toUpperCase()}
        </div>
        <div className="flex items-center gap-1.5 bg-[#FEF9C3] text-[#854D0E] px-3 py-1.5 rounded-lg text-[11px] font-black">
          <Trophy className="w-3.5 h-3.5" />
          BIGGEST: {report.biggestCatch}
        </div>

        <div className="flex flex-wrap gap-2 md:ml-auto mt-2 md:mt-0">
          {report.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#DBEAFE] text-[#1E40AF] px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-tight"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
