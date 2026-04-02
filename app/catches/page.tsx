"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Camera01Icon,
  ArrowLeft02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { catches } from "@/data/landingData";
import Link from "next/link";
import LandingNavbar from "@/components/Landing/LandingNavbar";
import LandingFooter from "@/components/Landing/LandingFooter";

export default function CatchesPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <main className="py-32">
        <div className="container-1620">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex flex-col items-start gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-4"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3510] px-4 py-2 text-sm font-semibold text-[#FF6B35]">
                <HugeiconsIcon icon={Camera01Icon} className="h-4 w-4" />
                Catches Gallery
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1A2B42] md:text-6xl">
                Trophy Hall of Fame
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore the most impressive catches from our community. Every fish tells a story of passion, skill, and the right intelligence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catches.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-[450px] overflow-hidden rounded-2xl border border-gray-100 bg-gray-900 shadow-sm transition-all hover:shadow-xl"
              >
                <Image
                  src={item.image}
                  alt={item.angler}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 z-10">
                  <span className="rounded-full bg-[#FF6B35] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    {item.weight}
                  </span>
                </div>

                <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#FF6B35]">
                  <HugeiconsIcon icon={FavouriteIcon} className="h-5 w-5" />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold">{item.angler}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-white/80">
                    <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
                    <p className="text-sm font-medium">{item.lake}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
