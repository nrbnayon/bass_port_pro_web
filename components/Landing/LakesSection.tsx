"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import LakeCard from "../AuthProtected/User/Lakes/LakeCard";
import { LakeGridSkeleton } from "@/components/Skeleton/LakeGridSkeleton";
import AuthModal, { AuthView } from "@/components/Auth/AuthModal";
import { usePathname } from "next/navigation";
import { useGetFeaturedLakesQuery } from "@/redux/services/lakesApi";
import { getFallbackLakes, mapApiLakeToView } from "@/lib/lakeMappers";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export default function LakesSection() {
  const pathname = usePathname();
  const { isAuthenticated } = useUser();

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; view: AuthView }>({
    isOpen: false,
    view: "login",
  });

  const {
    data: apiLakesData,
    isLoading: isLakesLoading,
    isError: isLakesError,
  } = useGetFeaturedLakesQuery({ limit: 8 });

  const lakes = useMemo(() => {
    if (apiLakesData?.lakes?.length) {
      return apiLakesData.lakes.map(mapApiLakeToView);
    }
    return getFallbackLakes().slice(0, 8);
  }, [apiLakesData]);

  const handleAllLakesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthModal({ isOpen: true, view: "login" });
    }
  };

  return (
    <section id="lakes" className="bg-white py-20 pb-32">
      <div className="container-1620">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B3515] px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
              <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
              Lake intelligence Database
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Top Bass Fishing Lakes
            </h2>
            <p className="max-w-2xl text-sm text-[#4B5563] md:text-base">
              Explore our curated database of premier bass fishing destinations
              with real-time conditions and expert insights.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/lakes"
              onClick={handleAllLakesClick}
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#FF6B35] transition-colors hover:opacity-80 bg-[#FF6B35]/10 px-6 py-3 rounded-full"
            >
              View All Lakes
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {isLakesError && (
          <p className="mb-4 text-xs font-semibold text-amber-600">
            API unavailable. Showing fallback lake data.
          </p>
        )}

        {isLakesLoading && !apiLakesData ? (
          <LakeGridSkeleton count={8} />
        ) : (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px", once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {lakes.map((lake) => (
                <LakeCard key={lake.id} lake={lake} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <AuthModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        redirectTo={pathname}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
