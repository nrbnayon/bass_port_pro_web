"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, ImageIcon, MapPin, Camera, FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

const heroStats = [
  { id: "1", value: "12+", label: "Premium Lakes", icon: MapPin },
  { id: "2", value: "500+", label: "Catch Photos", icon: Camera },
  { id: "3", value: "1,200+", label: "Fishing Reports", icon: FileText },
  { id: "4", value: "5,000+", label: "Active Anglers", icon: Users },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function HeroSection() {
  return (
    <section id="home" className="hero-bg relative isolate flex min-h-screen flex-col items-center justify-center pt-20 text-white overflow-hidden">
      <div className="container-1620 relative z-10 flex flex-col items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Image
              src="/icons/logo.png"
              alt="BassPort Logo"
              width={280}
              height={80}
              className="h-auto w-48 md:w-64 lg:w-72 drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="max-w-5xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Your Bass Fishing <br />
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-primary inline-block"
            >
              Intelligence Hub
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl px-4 text-base text-white/90 sm:text-lg"
          >
            Discover the best bass fishing lakes across America. Get real-time conditions,
            expert reports, and share your trophy catches with the community.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 px-4"
          >
            <Link
              href="#lakes"
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-bold text-white transition hover:bg-primary/90 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95"
            >
              <Compass className="h-5 w-5" /> Explore Lakes
            </Link>
            <Link
              href="#catches"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-[#0E2A52]/40 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-[#0E2A52]/60 hover:scale-105 active:scale-95"
            >
              <ImageIcon className="h-5 w-5" /> BassPorn Gallery
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-20 lg:mt-24 w-full px-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {heroStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group flex flex-col items-center rounded-2xl border border-white/10 bg-[#FFFFFF0A] p-6 text-center backdrop-blur-md transition-colors duration-300 hover:bg-[#FFFFFF15] hover:border-white/20"
                >
                  <div className="mb-4 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-white/60">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
