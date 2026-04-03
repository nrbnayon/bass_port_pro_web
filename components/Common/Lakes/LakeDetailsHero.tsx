"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Location01Icon,
  StarIcon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { LakeCard } from "@/types/landingData.types";

interface LakeDetailsHeroProps {
  lake: LakeCard;
}

export default function LakeDetailsHero({ lake }: LakeDetailsHeroProps) {
  const reviewCount = useMemo(() => (lake.id.length * 15 + 412), [lake.id]);

  return (
    <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={lake.image}
        alt={lake.name}
        fill
        priority
        className="object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="container-1620 relative h-full flex flex-col justify-between py-8 md:py-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Link
            href="/lakes"
            className="inline-flex items-center gap-2 rounded-lg bg-black/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/40"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="h-4 w-4" />
            Back to Lakes
          </Link>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 text-white"
          >
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl tracking-tight leading-tight uppercase font-heading">
              {lake.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Location01Icon} className="h-5 w-5 text-gray-300" />
                <span className="text-lg font-medium">{lake.state}</span>
              </div>
              
              <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-1.5 backdrop-blur-md">
                <HugeiconsIcon icon={StarIcon} className="h-4 w-4 text-[#F59E0B]" />
                <span className="text-lg font-bold">{lake.rating}</span>
                <span className="text-sm text-gray-300">({reviewCount} reviews)</span>
              </div>

              <span className={`rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wider text-white ${
                lake.condition === 'Excellent' ? 'bg-[#22C55E]' : 
                lake.condition === 'Good' ? 'bg-[#3B82F6]' : 
                'bg-[#F59E0B]'
              }`}>
                {lake.condition}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
             <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-primary shadow-lg group">
              <HugeiconsIcon icon={FavouriteIcon} className="h-6 w-6 transition-transform group-active:scale-90" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
