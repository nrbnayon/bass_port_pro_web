"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail02Icon,
  Clock01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function ContactUsClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success("Subscribed to the newsletter!");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-40 pb-24">
      <div className="w-full px-4 md:max-w-[1200px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE6] px-5 py-2.5 text-xs font-medium text-primary ring-1 ring-primary/10 mb-6">
            <HugeiconsIcon icon={Mail02Icon} className="h-4 w-4" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Contact Us
          </h1>
          <p className="font-medium text-secondary max-w-2xl leading-relaxed text-base">
            Have questions, suggestions, or want to partner with BASSPORT?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Info and Stay Updated */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="md:text-2xl text-xl font-bold text-foreground mb-6">
                Contact Information
              </h2>

              <div className="flex flex-col gap-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAECE6] flex items-center justify-center text-primary shrink-0">
                    <HugeiconsIcon icon={Mail02Icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-secondary mb-0.5">
                      Email
                    </h3>
                    <p className="text-primary font-bold text-base">
                      william@bassportpro.com
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0EA5E9] shrink-0">
                    <HugeiconsIcon icon={Clock01Icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-secondary mb-0.5">
                      Response Time
                    </h3>
                    <p className="text-foreground font-bold text-base">
                      Within 24 hours
                    </p>
                  </div>
                </div>

                {/* Community */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#22C55E] shrink-0">
                    <HugeiconsIcon icon={Message01Icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-secondary mb-0.5">
                      Community
                    </h3>
                    <p className="text-foreground font-bold text-base">
                      5,000+ active anglers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Updated Card */}
            <div className="bg-foreground rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
                <p className="text-white/70 text-sm font-medium leading-relaxed mb-8">
                  Get weekly fishing reports and lake conditions delivered to
                  your inbox.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
              {/* Subtle Decor (Abstract Circle) */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>

          {/* Right Column: Send us a Message Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#4B5563] ml-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-[#F3F4F6] bg-white px-5 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#4B5563] ml-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-[#F3F4F6] bg-white px-5 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#4B5563] ml-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#F3F4F6] bg-white px-5 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#4B5563] ml-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#F3F4F6] bg-white px-5 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid resize-none placeholder:text-gray-300"
                  />
                </div>

                <div className="mt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
