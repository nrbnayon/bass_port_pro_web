/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Shield, Fingerprint, Activity, Share2, 
  Lock, ExternalLink, Mail, FileText, LucideIcon, RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { privacyPolicy as defaultPrivacy } from "@/data/legalData";
import { useGetLegalDocsQuery } from "@/redux/services/settingsApi";

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

const iconMap: Record<string, LucideIcon> = {
  intro: Shield,
  "data-collection": Fingerprint,
  tracking: Activity,
  sharing: Share2,
  security: Lock,
  "third-party": ExternalLink,
  contact: Mail,
};

export default function PrivacyPolicyPage() {
  const { data, isLoading } = useGetLegalDocsQuery();

  // Try parsing server content or fallback to static data
  let policy: LegalSection[] = defaultPrivacy;
  try {
    if (data?.data?.privacyPolicy) {
      policy = JSON.parse(data.data.privacyPolicy);
    }
  } catch (err) {
    console.error("Failed to parse privacy policy from server:", err);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 gap-4 animate-pulse">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        <span className="text-secondary font-medium tracking-tight">Syncing Legal Intelligence...</span>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/icons/logo1.png"
                alt="Logo"
                width={200}
                height={200}
                className="h-auto"
                priority
              />
            </Link>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-secondary">
            Last updated: {data?.data?.updatedAt ? new Date(data.data.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block space-y-2 sticky top-24 self-start">
            <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4 px-4">
              Sections
            </h3>
            {policy.map((section: any, idx: number) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block px-4 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                {idx + 1}. {section.title}
              </a>
            ))}
          </aside>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-16"
          >
            <div className="bg-white border p-8 md:p-12 rounded-[2rem] shadow-sm space-y-12">
              {policy.map((section: LegalSection, idx: number) => {
                const Icon = iconMap[section.id] || FileText;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {idx + 1}. {section.title}
                      </h2>
                    </div>
                    <p className="text-lg text-secondary leading-relaxed pl-14">
                      {section.content}
                    </p>
                  </section>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-8 border-t border-dashed">
          <Button
            asChild
            variant="outline"
            className="rounded-full gap-2 px-8 py-6 text-lg font-medium hover:bg-primary/80 transition-all"
          >
            <Link href="/signup">
              <ArrowLeft className="h-5 w-5" /> Back to Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
