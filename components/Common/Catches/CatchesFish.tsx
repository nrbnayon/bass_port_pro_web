"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Camera01Icon,
  Location01Icon,
  CloudUploadIcon,
  ArrowDown01Icon,
  DashboardSquare01Icon,
  RulerIcon,
} from "@hugeicons/core-free-icons";
import { catches as initialCatches } from "@/data/landingData";
import { CatchCard } from "@/types/landingData.types";
import UploadCatchModal from "./UploadCatchModal";
import CatchDetailsModal from "./CatchDetailsModal";
import { toast } from "sonner";
import { Fish } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Biggest Catch", value: "biggest" },
  { label: "Most Popular", value: "popular" },
];

export default function CatchesFish() {
  const [catches, setCatches] = useState<CatchCard[]>(initialCatches);
  const [sortBy, setSortBy] = useState("recent");
  const [showFavouriteOnly, setShowFavouriteOnly] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCatch, setSelectedCatch] = useState<CatchCard | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleUploadSubmit = (newCatch: CatchCard) => {
    setCatches([newCatch, ...catches]);
    toast.success("Catch uploaded successfully!");
  };

  const openDetails = (item: CatchCard) => {
    setSelectedCatch(item);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <section className="bg-white pt-28 md:pt-40 pb-8">
        <div className="w-full px-4 md:max-w-[1320px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE6] px-5 py-2.5 text-xs font-semibold text-primary ring-1 ring-primary/10">
                <HugeiconsIcon icon={Camera01Icon} className="h-4 w-4" />
                BassPorn Gallery
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground max-w-xl">
                Trophy Catches
              </h1>
              <p className="font-medium text-gray-400 max-w-xl leading-relaxed">
                Share your biggest bass with the community and explore the
                legendary catches that define the sport.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFavouriteOnly(!showFavouriteOnly)}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  showFavouriteOnly
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                <HugeiconsIcon icon={FavouriteIcon} className="h-4 w-4" />
                Favourite
              </button>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-100 text-foreground rounded-lg px-8 py-3 text-sm font-semibold pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-none cursor-pointer hover:bg-gray-200"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform">
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <HugeiconsIcon icon={CloudUploadIcon} className="h-5 w-5" />
                Upload Catch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <main className="w-full px-4 md:max-w-[1320px] mx-auto">
        {catches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
              <HugeiconsIcon
                icon={DashboardSquare01Icon}
                className="h-10 w-10"
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              No catches found
            </h3>
            <p className="text-gray-400 font-medium mt-2">
              Try adjusting your filters or be the first to share a trophy
              catch!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {catches.map((item, index) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative cursor-pointer border border-[#F3F4F6] rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={() => openDetails(item)}
                >
                  {/* Card Main */}
                  <div className="relative h-[300px] overflow-hidden rounded-t-2xl bg-gray-900 transition-all group-hover:shadow-xs">
                    <Image
                      src={item.image}
                      alt={item.angler}
                      fill
                      className="object-cover transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    {/* Weight Badge */}
                    <div className="absolute left-3 top-3 z-10">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-xl shadow-primary/20">
                        {item.weight}
                      </span>
                    </div>

                    <button className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D94D] text-white backdrop-blur-md transition-all hover:bg-white hover:text-red-500 cursor-pointer">
                      <HugeiconsIcon icon={FavouriteIcon} className="h-5 w-5" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <h3 className="font-semibold tracking-tight">
                        {item.angler}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/80">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          className="h-3.5 w-3.5"
                        />
                        <p className="text-xs font-bold">{item.lake}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Meta Footer */}
                  <div className="my-3 px-2">
                    <div className="flex items-center justify-between">
                      <div className="w-full flex flex-col">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-sm font-black text-foreground">
                            {item.species}
                          </h3>
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon
                              icon={FavouriteIcon}
                              className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500"
                            />
                            <span className="text-xs font-black text-foreground group-hover:text-red-500">
                              {item.likes}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            <HugeiconsIcon
                              icon={RulerIcon}
                              className="h-4 w-4"
                            />
                            {item.length}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            <Fish className="h-4 w-4" />
                            {item.technique}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadCatchModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />
      <CatchDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        catchItem={selectedCatch}
      />
    </div>
  );
}
