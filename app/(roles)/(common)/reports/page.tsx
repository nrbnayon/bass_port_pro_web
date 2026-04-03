import { Metadata } from "next";
import ReportsContentClient from "@/components/Common/Reports/ReportsContentClient";
import CTASection from "@/components/Landing/CTASection";

export const metadata: Metadata = {
  title: "Reports | BassInsight",
  description:
    "Real-time conditions and catch reports from anglers - BassInsight",
};

export default function ReportsPage() {
  return (
    <main>
      <ReportsContentClient />
      <CTASection />
    </main>
  );
}
