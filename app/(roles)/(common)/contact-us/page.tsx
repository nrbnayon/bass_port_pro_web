import { Metadata } from "next";
import ContactUsClient from "@/components/Common/ContactUs/ContactUsClient";
import CTASection from "@/components/Landing/CTASection";

export const metadata: Metadata = {
  title: "Contact Us - BassInsight",
  description: "Get in touch with BassInsight. We'd love to hear from you.",
};

export default function ContactUsPage() {
  return (
    <main className="bg-white">
      <ContactUsClient />
      <CTASection />
    </main>
  );
}
