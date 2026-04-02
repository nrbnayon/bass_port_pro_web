import LakesSection from "@/components/Landing/LakesSection";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";

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
