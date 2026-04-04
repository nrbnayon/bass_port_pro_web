import { Metadata } from "next";
import CTASection from "@/components/Landing/CTASection";
import ReportsContentClient from "@/components/AuthProtected/User/Reports/ReportsContentClient";

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
