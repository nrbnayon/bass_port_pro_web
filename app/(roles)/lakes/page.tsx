import LakesSection from "@/components/Landing/LakesSection";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Lakes - BASSPORT Pro",
  description:
    "Discover top bass fishing lakes, real-time fishing reports, seasonal patterns, and community catches with BASSPORT Pro.",
};

export default function AllLakesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <LakesSection />
      </div>
      <Footer />
    </>
  );
}
