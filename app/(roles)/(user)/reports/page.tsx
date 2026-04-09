import { Metadata } from "next";
import CTASection from "@/components/Landing/CTASection";
import ReportsContentClient from "@/components/AuthProtected/User/Reports/ReportsContentClient";

export const metadata: Metadata = {
  title: "Reports | BassInsight",
  description:
    "Real-time conditions and catch reports from anglers - BassInsight",
};

import { Suspense } from "react";
import { ReportListSkeleton } from "@/components/Skeleton/ReportListSkeleton";

export default function ReportsPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="container-1620">
            <ReportListSkeleton count={6} />
          </div>
        }
      >
        <ReportsContentClient />
      </Suspense>
      <CTASection />
    </main>
  );
}
