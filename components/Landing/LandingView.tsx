"use client";

import CTASection from "./CTASection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import LakesSection from "./LakesSection";
import LandingFooter from "./LandingFooter";
import LandingNavbar from "./LandingNavbar";
import ReportsSection from "./ReportsSection";
import TrophySection from "./TrophySection";


export function LandingView() {
  return (
    <div className="w-full flex flex-col bg-white">
      <LandingNavbar />
      <HeroSection />
      <LakesSection />
      <TrophySection />
      <FeaturesSection />
      <ReportsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
