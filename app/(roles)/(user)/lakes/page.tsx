import CTASection from "@/components/Landing/CTASection";
import LakesSection from "@/components/Landing/LakesSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Lakes - BASSPORT Pro",
  description:
    "Discover top bass fishing lakes, real-time fishing reports, seasonal patterns, and community catches with BASSPORT Pro.",
};

import { Suspense } from "react";

export default function AllLakesPage() {
  return (
    <>
      <div className="pt-20">
        <Suspense fallback={<div className="h-40 w-full" />}>
          <LakesSection />
        </Suspense>
        <CTASection />
      </div>
    </>
  );
}
