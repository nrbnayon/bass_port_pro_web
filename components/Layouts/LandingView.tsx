import CTASection from "../Landing/CTASection";
import FeaturesSection from "../Landing/FeaturesSection";
import HeroSection from "../Landing/HeroSection";
import LakesSection from "../Landing/LakesSection";
import LandingFooter from "../Landing/LandingFooter";
import LandingNavbar from "../Landing/LandingNavbar";
import ReportsSection from "../Landing/ReportsSection";
import TrophySection from "../Landing/TrophySection";


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
