"use client";

import { useState } from "react";
import LakeDetailsTabs from "./LakeDetailsTabs";
import LakeOverview from "./LakeOverview";
import LakeReportsList from "./LakeReportsList";
import LakeReviewsList from "./LakeReviewsList";
import LakeSidebar from "./LakeSidebar";
import { LakeCard } from "@/types/landingData.types";
import { motion, AnimatePresence } from "framer-motion";

interface LakeDetailsWrapperProps {
  lake: LakeCard;
}

export default function LakeDetailsWrapper({ lake }: LakeDetailsWrapperProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
      {/* Main Content (Left) */}
      <div className="flex flex-col gap-8 flex-1 lg:max-w-4xl">
        <LakeDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-8 md:mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === "overview" && <LakeOverview lake={lake} />}
              {activeTab === "reports" && <LakeReportsList lake={lake} />}
              {activeTab === "reviews" && <LakeReviewsList />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar (Right) */}
      <div className="flex-none lg:w-80 xl:w-96">
        <LakeSidebar lake={lake} />
      </div>
    </div>
  );
}
