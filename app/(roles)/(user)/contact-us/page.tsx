import { Metadata } from "next";
import CTASection from "@/components/Landing/CTASection";
import ContactUsClient from "@/components/AuthProtected/User/ContactUs/ContactUsClient";

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
