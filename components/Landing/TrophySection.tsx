"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Camera01Icon,
  ArrowRight02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { catches } from "@/data/landingData";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "sonner";

export default function TrophySection() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  const handleToggleFavourite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    // Future: Add backend API call here
    // const response = await toggleFavouriteApi({ id, type: 'catch' });
    toast.success("Catch added to favourites!");
  };

  return (
    <>
    <section id="catches" className="bg-white">
      <div className="container-1620">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE6] px-4 py-2 text-sm font-semibold text-primary">
              <HugeiconsIcon
                icon={Camera01Icon}
                className="h-5 w-5"
                strokeWidth={2}
              />
              BassPort Highlights
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Trophy Catches
            </h2>
          </div>
          <Link
            href="/catches"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#FF6B35] transition-colors hover:opacity-80"
          >
            View All
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!isLoading
            ? catches.slice(0, 4).map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative h-[400px] overflow-hidden rounded-2xl border-none bg-blue-50 shadow-none transition-all hover:shadow-xl"
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

                  <button
                    onClick={(e) => handleToggleFavourite(item.id, e)}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#FF6B35] cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      className="h-5 w-5"
                      strokeWidth={2}
                    />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold">{item.angler}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-white/80">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        className="h-4 w-4"
                      />
                      <p className="text-sm font-medium">{item.lake}</p>
                    </div>
                  </div>
                </motion.article>
              ))
            : // Skeleton Loader or Placeholder during SSR/Loading
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
        </div>
      </div>
    </section>

    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
    />
  </>
  );
}
