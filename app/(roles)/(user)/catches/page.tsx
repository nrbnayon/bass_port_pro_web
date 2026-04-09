import { Metadata } from "next";
import CTASection from "@/components/Landing/CTASection";
import CatchesFishClient from "@/components/AuthProtected/User/Catches/CatchesFishClient";

export const metadata: Metadata = {
  title: "Catches Fish Gallery - BASSPORT Pro",
  description:
    "Catches Fish Gallery Explore the best catches of the day with BASSPORT Pro",
};

import { Suspense } from "react";
import { CatchGridSkeleton } from "@/components/Skeleton/CatchGridSkeleton";

export default function CatchesPage() {
  return (
    <main>
      <Suspense
          fallback={
            <div className="max-w-[1320px] mx-auto">
              <CatchGridSkeleton count={8} />
            </div>
          }
        >
          <CatchesFishClient />
        </Suspense>
      <CTASection />
    </main>
  );
}
