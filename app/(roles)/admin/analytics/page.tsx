import AnalyticsClient from "@/components/AuthProtected/Admin/Analytics/AnalyticsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Bass Insight Admin",
  description: "View system analytics and activity history.",
};
export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
