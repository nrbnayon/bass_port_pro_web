"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Location01Icon,
  DashboardSquare01Icon,
  Settings02Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { CatchCard } from "@/types/landingData.types";
import { toast } from "sonner";

interface CatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  catchItem: CatchCard | null;
}

export default function CatchDetailsModal({
  isOpen,
  onClose,
  catchItem,
}: CatchDetailsModalProps) {

  if (!isOpen || !catchItem) return null;

  const handleToggleFavourite = () => {

    // Future: Add backend API call here
    // const response = await toggleFavouriteApi({ id: catchItem.id, type: 'catch' });
    toast.success("Catch liked successfully");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh]"
        >
          {/* Left Side: Image */}
          <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
            <Image
              src={catchItem.image}
              alt={catchItem.angler}
              fill
              className="object-cover"
            />
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 overflow-hidden ring-4 ring-primary/5">
                  <Image
                    src={catchItem.avatarImage || "/images/avatar.png"}
                    alt={catchItem.angler}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {catchItem.angler}
                  </h3>
                  <p className="text-sm font-medium text-gray-400">
                    {catchItem.date}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" />
              </button>
            </div>

            {/* Stats Boxes */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#FF6B3533] rounded-2xl p-5 text-center border border-primary/5">
                <p className="text-[#FF6B35] text-2xl font-black">
                  {catchItem.weight.replace(" lbs", "")}
                </p>
                <p className="text-xs font-bold text-[#FF6B35]/60 tracking-widest mt-1">
                  Pounds
                </p>
              </div>
              <div className="bg-[#3060D933] rounded-2xl p-5 text-center border border-blue-100/30">
                <p className="text-blue-600 text-2xl font-black">
                  {catchItem.length}
                </p>
                <p className="text-xs font-bold text-blue-600/60 tracking-widest mt-1">
                  Length
                </p>
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary">
                  <HugeiconsIcon icon={Location01Icon} className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    {catchItem.lake}
                  </span>
                </div>
                <div className="ml-auto">
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-[#FF6B35]">
                      {catchItem.length}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Length
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-500">
                  <HugeiconsIcon
                    icon={DashboardSquare01Icon}
                    className="h-5 w-5"
                  />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {catchItem.species}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-emerald-500">
                  <HugeiconsIcon icon={Settings02Icon} className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {catchItem.technique}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-[15px] leading-relaxed text-gray-500 font-medium italic">
                &quot;{catchItem.description}&quot;
              </p>
            </div>

            {/* Like Button */}
            <div className="mt-8">
              <button
                onClick={handleToggleFavourite}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 px-6 py-3 transition-colors hover:bg-red-50 hover:text-red-500 group cursor-pointer"
              >
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  className="h-5 w-5 text-gray-300 group-hover:text-red-500 transition-colors"
                />
                <span className="text-sm font-bold text-foreground group-hover:text-red-500">
                  {catchItem.likes}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
