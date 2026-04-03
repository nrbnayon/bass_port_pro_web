import { Metadata } from "next";
import CatchesFishClient from "@/components/Common/Catches/CatchesFishClient";
import CTASection from "@/components/Landing/CTASection";

export const metadata: Metadata = {
  title: "Catches Fish Gallery - BASSPORT Pro",
  description:
    "Catches Fish Gallery Explore the best catches of the day with BASSPORT Pro",
};

export default function CatchesPage() {
  return (
    <main>
      <CatchesFishClient />
      <CTASection />
    </main>
  );
}
