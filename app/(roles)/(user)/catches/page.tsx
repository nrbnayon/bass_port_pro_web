import { Metadata } from "next";
import CTASection from "@/components/Landing/CTASection";
import CatchesFishClient from "@/components/AuthProtected/User/Catches/CatchesFishClient";

export const metadata: Metadata = {
  title: "Catches Fish Gallery - BASSPORT Pro",
  description:
    "Catches Fish Gallery Explore the best catches of the day with BASSPORT Pro",
};

import { Suspense } from "react";

export default function CatchesPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading catches...</div>}>
        <CatchesFishClient />
      </Suspense>
      <CTASection />
    </main>
  );
}
