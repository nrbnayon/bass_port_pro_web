"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  File02Icon,
  Camera01Icon,
  StarIcon,
  TradeUpIcon,
  TimeQuarterPassIcon,
} from "@hugeicons/core-free-icons";
import { features } from "@/data/landingData";
import SectionHeading from "./SectionHeading";

const iconMap = {
  map: { icon: Location01Icon, color: "text-[#3B82F6]", bg: "bg-[#3B82F633]" },
  chart: { icon: File02Icon, color: "text-[#22C55E]", bg: "bg-[#22C55E33]" },
  camera: { icon: Camera01Icon, color: "text-[#EAB308]", bg: "bg-[#EAB30833]" },
  message: { icon: StarIcon, color: "text-[#FACC15]", bg: "bg-[#FACC151A]" },
  calendar: {
    icon: TradeUpIcon,
    color: "text-[#9333EA]",
    bg: "bg-[#9333EA33]",
  },
  target: {
    icon: TimeQuarterPassIcon,
    color: "text-[#FF6B35]",
    bg: "bg-[#FF6B3533]",
  },
};

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-1620">
        <SectionHeading
          badge="Platform Benefits"
          title="Why Choose BASSPORT?"
          subtitle="Everything you need to fish smarter, catch bigger, and connect with the bass fishing community."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const config = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative rounded-[24px] border border-[#F3F4F6] bg-white p-8 transition-all hover:shadow-xl hover:shadow-gray-200/40"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${config.bg} ${config.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <HugeiconsIcon icon={config.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-[1.6] text-secondary">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
