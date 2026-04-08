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
import { useState } from "react";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { useUser } from "@/hooks/useUser";
import { useGetReportsQuery } from "@/redux/services/fishingReportApi";

const resolveMediaUrl = (url?: string) => {
  if (!url) return "";
  if (
    url.startsWith("data:") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const origin = apiBase.replace(/\/api\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function ReportsSection() {
  const { isAuthenticated } = useUser();
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    view: AuthView;
  }>({
    isOpen: false,
    view: "login",
  });

  const { data, isLoading, isError } = useGetReportsQuery({
    limit: 3,
    sortBy: "createdAt",
    order: "desc",
  });

  const apiReportsRaw = data?.reports || [];

  const apiReports = apiReportsRaw.map((r) => ({
    id: r._id,
    angler: r.user?.name || "Unknown",
    avatarImage: resolveMediaUrl(r.user?.avatar) || "",
    lake: r.lake?.name || r.lakeName || "Unknown Lake",
    date: new Date(r.fishedAt).toISOString().split("T")[0],
    temp: r.conditions?.temp || "N/A",
    catches: `${r.catchCount || 0} catches`,
    text: r.text,
    tags: r.tags || [],
  }));

  const displayReports =
    isError || (!isLoading && apiReports.length === 0)
      ? reports.slice(0, 10)
      : apiReports;

  const handleAllReportsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthModal({ isOpen: true, view: "login" });
    }
  };
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
            onClick={handleAllReportsClick}
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
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[320px] bg-gray-50 rounded-2xl animate-pulse ring-1 ring-gray-100"
                />
              ))}
            </>
          ) : (
            displayReports.map((report, index) => (
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
                    {report.text || ""}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {report.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#3060D91A] px-3 py-1 text-xs font-semibold text-blue"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
