"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File02Icon,
  Location01Icon,
  Calendar03Icon,
  TemperatureIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { Fish } from "lucide-react";
import { reports } from "@/data/landingData";
import Link from "next/link";
import Image from "next/image";

export default function ReportsSection() {
  return (
    <section id="reports" className="bg-white pt-10 pb-20">
      <div className="container-1620">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE6] px-4 py-2 text-sm font-semibold text-primary">
              <HugeiconsIcon
                icon={File02Icon}
                className="h-5 w-5"
                strokeWidth={2}
              />
              Latest Intel
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Recent Fishing Reports
            </h2>
          </div>
          <Link
            href="/reports"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#FF6B35] transition-colors hover:opacity-80"
          >
            All Reports
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8">
          {reports.map((report, index) => (
            <motion.article
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col rounded-xl border border-[#F3F4F6] bg-white p-6 transition-all hover:shadow-xl hover:shadow-gray-200/40"
            >
              <div className="flex items-start justify-between gap-4">
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
                    <h3 className="text-base font-bold text-foreground">
                      {report.angler}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        className="h-3.5 w-3.5"
                      />
                      <span className="text-sm">{report.lake}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <HugeiconsIcon icon={Calendar03Icon} className="h-5 w-5" />
                  <span className="text-sm font-medium">{report.date}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon
                    icon={TemperatureIcon}
                    className="h-5 w-5 text-primary"
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {report.temp}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Fish className="h-5 w-5 text-[#22C55E]" />
                  <span className="text-sm font-semibold text-foreground">
                    {report.catches}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex-1">
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {report.text}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {report.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#3060D91A] px-3 py-1 text-xs font-semibold text-blue"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
