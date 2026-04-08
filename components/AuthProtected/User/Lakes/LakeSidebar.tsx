"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Droplets,
  BarChart3,
  MapPin,
  MessageSquare,
  Heart,
  Fish,
} from "lucide-react";
import { LakeViewModel } from "@/lib/lakeMappers";

interface LakeSidebarProps {
  lake: LakeViewModel;
}

export default function LakeSidebar({ lake }: LakeSidebarProps) {
  const lakeFacts = [
    {
      label: "Surface Area",
      value: `${lake.size.toLocaleString()} acres`,
      icon: Droplets,
    },
    {
      label: "Max Depth",
      value: `${lake.maxDepth || "N/A"} ft`,
      icon: BarChart3,
    },
    {
      label: "Best Season",
      value: lake.bestSeason || "Seasonal",
      icon: CalendarDays,
    },
    { label: "City", value: lake.nearestCity || "Unknown", icon: MapPin },
    { label: "Reviews", value: (lake.reviewCount || 0).toString(), icon: MessageSquare },
    { label: "Reports", value: (lake.reportCount || 0).toString(), icon: Fish },
    { label: "Favourites", value: (lake.favouriteCount || 0).toString(), icon: Heart },
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
                <fact.icon className="h-5 w-5" />
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
        <div className="space-y-3">
          {lake.species.map((s, index) => (
            <motion.div
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
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
