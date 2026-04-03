"use client";

import React from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TemperatureIcon,
  ViewIcon,
  Note03Icon,
} from "@hugeicons/core-free-icons";
import { Fish } from "lucide-react";
import { LakeCard } from "@/types/landingData.types";

interface LakeOverviewProps {
  lake: LakeCard;
}

export default function LakeOverview({ lake }: LakeOverviewProps) {
  const stats = [
    {
      label: "Water Temp",
      value: lake.temp,
      icon: TemperatureIcon,
      color: "bg-[#FEE2E2]",
      textColor: "text-[#EF4444]",
    },
    {
      label: "Clarity",
      value: lake.clarity,
      icon: ViewIcon,
      color: "bg-[#DBEAFE]",
      textColor: "text-[#3B82F6]",
    },
    {
      label: "Avg Catch Rate",
      value: `${lake.catchRate}/hr`,
      icon: Fish,
      color: "bg-[#DCFCE7]",
      textColor: "text-[#22C55E]",
    },
    {
      label: "Record Bass",
      value: `${lake.recordBass} lbs`,
      icon: Note03Icon,
      color: "bg-[#F3E8FF]",
      textColor: "text-[#A855F7]",
    },
  ];

  const techniques = [
    "Flipping",
    "Swim Jigs",
    "Topwater",
    "Crankbaits",
    "Spinnerbaits",
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          About This Lake
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
          {lake.description}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl mb-6">
          Current Conditions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-50 bg-[#FCFDFE] p-5 shadow-xs transition-transform hover:-translate-y-1"
            >
              <div className={`p-3 rounded-xl ${stat.color} ${stat.textColor}`}>
                {stat.label === "Avg Catch Rate" ? (
                  <Fish className="h-6 w-6" />
                ) : (
                  <HugeiconsIcon icon={stat.icon as React.ComponentProps<typeof HugeiconsIcon>["icon"]} className="h-6 w-6" />
                )}
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-gray-900 block">
                  {stat.value}
                </span>
                <span className="text-[13px] font-medium text-gray-400">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          Top Techniques
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {techniques.map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-50 border border-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
