import CTASection from "@/components/Landing/CTASection";
import LakesSection from "@/components/Landing/LakesSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Lakes - BASSPORT Pro",
  description:
    "Discover top bass fishing lakes, real-time fishing reports, seasonal patterns, and community catches with BASSPORT Pro.",
};

import { Suspense } from "react";
import { LakeGridSkeleton } from "@/components/Skeleton/LakeGridSkeleton";

export default function AllLakesPage() {
  return (
    <>
      <div className="pt-20">
        <Suspense
          fallback={
            <div className="container-1620 py-20">
              <LakeGridSkeleton count={8} />
            </div>
          }
        >
          <LakesSection />
        </Suspense>
        <CTASection />
      </div>
    </>
  );
}
