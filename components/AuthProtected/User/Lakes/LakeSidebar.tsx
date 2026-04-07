"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  DropletIcon,
  ChartBarLineIcon,
  LocationIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import { Fish } from "lucide-react";
import { LakeCard } from "@/types/landingData.types";

interface LakeSidebarProps {
  lake: LakeCard;
}

export default function LakeSidebar({ lake }: LakeSidebarProps) {
  const lakeFacts = [
    {
      label: "Surface Area",
      value: `${lake.size.toLocaleString()} acres`,
      icon: DropletIcon,
    },
    {
      label: "Max Depth",
      value: `${lake.maxDepth || "N/A"} ft`,
      icon: ChartBarLineIcon,
    },
    {
      label: "Best Season",
      value: lake.bestSeason || "Seasonal",
      icon: Calendar03Icon,
    },
    { label: "City", value: lake.nearestCity || "Unknown", icon: LocationIcon },
    { label: "Reviews", value: (lake.reviewCount || 0).toString(), icon: Message01Icon },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[#F3F4F6] bg-white p-5">
        <h3 className="text-lg font-bold tracking-tight text-foreground border-b border-gray-100 pb-2 mb-3">
          Lake Facts
        </h3>
        <ul className="space-y-5">
          {lakeFacts.map((fact) => (
            <li
              key={fact.label}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2 text-gray-500">
                <HugeiconsIcon icon={fact.icon} className="h-5 w-5" />
                <span className="text-sm font-semibold">{fact.label}</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {fact.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#F3F4F6] bg-white p-5">
        <h3 className="text-lg font-bold tracking-tight text-foreground border-b border-gray-100 pb-4 mb-6">
          Target Species
        </h3>
        <ul className="space-y-3">
          {lake.species.map((s, index) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-2 rounded-xl bg-[#3060D91A] p-4 text-blue transition-colors hover:bg-blue-50"
            >
              <div className="flex items-center justify-center rounded-lg">
                <Fish className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="text-sm font-bold tracking-tight">{s}</span>
            </motion.li>
          ))}
        </ul>
      </section>
    </div>
  );
}
