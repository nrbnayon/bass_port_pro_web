import { Suspense } from "react";
import JobsPageView from "@/components/Landing/JobsPageView";

export const metadata = {
  title: "Find Jobs | Obliq",
  description: "Search and filter thousands of job listings. Find your perfect career opportunity on Obliq.",
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading jobs...</div>}>
      <JobsPageView />
    </Suspense>
  );
}
