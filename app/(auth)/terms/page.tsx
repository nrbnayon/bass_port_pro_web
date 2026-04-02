"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { termsOfService } from "@/data/legalData";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-6 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
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
            Terms of Service
          </h1>
          <p className="text-lg text-secondary">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border p-8 rounded-3xl shadow-sm space-y-10"
        >
          {termsOfService.map((section, idx) => (
            <section key={section.id} className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">
                {idx + 1}. {section.title}
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="flex justify-center pt-8">
          <Button
            asChild
            variant="ghost"
            className="rounded-full gap-2 text-primary hover:text-primary/80 hover:bg-transparent hover:border"
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
