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
      cardColor: "bg-[#FF6B3533]",
      textColor: "text-[#EF4444]",
    },
    {
      label: "Clarity",
      value: lake.clarity,
      icon: ViewIcon,
      cardColor: "bg-[#3060D933]",
      textColor: "text-[#3B82F6]",
    },
    {
      label: "Avg Catch Rate",
      value: `${lake.catchRate}/hr`,
      icon: Fish,
      cardColor: "bg-[#22C55E1A]",
      textColor: "text-[#22C55E]",
    },
    {
      label: "Record Bass",
      value: `${lake.recordBass} lbs`,
      icon: Note03Icon,
      cardColor: "bg-[#FF00C81A]",
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
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[#F3F4F6] bg-white p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          About This Lake
        </h2>
        <p className="mt-4 leading-relaxed text-secondary">
          {lake.description}
        </p>
      </section>

      <section className="rounded-2xl border border-[#F3F4F6] bg-white p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Current Conditions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex flex-col items-center rounded-2xl ${stat.cardColor} p-3 transition-transform hover:-translate-y-1`}
            >
              <div className={`p-3 rounded-xl ${stat.textColor}`}>
                {stat.label === "Avg Catch Rate" ? (
                  <Fish className="h-6 w-6" />
                ) : (
                  <HugeiconsIcon
                    icon={
                      stat.icon as React.ComponentProps<
                        typeof HugeiconsIcon
                      >["icon"]
                    }
                    className="h-6 w-6"
                  />
                )}
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-foreground block">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-secondary">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#F3F4F6] bg-white p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Top Techniques
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {techniques.map((t) => (
            <span
              key={t}
              className="rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary/80 transition-colors hover:bg-gray-100 hover:text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
