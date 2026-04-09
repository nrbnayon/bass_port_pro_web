import { LandingView } from "@/components/Layouts/LandingView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bass Fishing Intelligence Hub",
  description:
    "Plan smarter fishing trips with lake intelligence, recent fishing reports, and trophy catch highlights from BASSPORT Pro.",
  keywords: [
    "bass fishing intelligence",
    "best bass lakes",
    "fishing reports",
    "trophy bass",
    "angler insights",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "BASSPORT Pro | Bass Fishing Intelligence Hub",
    description:
      "Find top lakes, track conditions, and learn from real angler reports with BASSPORT Pro.",
    images: [
      {
        url: "/icons/logo.png",
        width: 1200,
        height: 630,
        alt: "BASSPORT Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BASSPORT Pro | Bass Fishing Intelligence Hub",
    description: "Lake intelligence and reports to help you catch bigger bass.",
    images: ["/icons/logo.png"],
  },
};

import { Suspense } from "react";
import { LandingSkeleton } from "@/components/Skeleton/LandingSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <LandingView />
    </Suspense>
  );
}
