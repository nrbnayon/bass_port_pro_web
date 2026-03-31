"use client";

import HeroSection from "./HeroSection";
import CompaniesSection from "./CompaniesSection";
import CategoriesSection from "./CategoriesSection";
import CTASection from "./CTASection";
import FeaturedJobsSection from "./FeaturedJobsSection";
import LatestJobsSection from "./LatestJobsSection";

export function LandingView() {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <CompaniesSection />
      <CategoriesSection />
      <CTASection />
      <FeaturedJobsSection />
      <LatestJobsSection />
    </div>
  );
}
