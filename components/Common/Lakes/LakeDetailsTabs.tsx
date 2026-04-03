"use client";

import { motion } from "framer-motion";

interface LakeDetailsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function LakeDetailsTabs({ activeTab, setActiveTab }: LakeDetailsTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reports", label: "Reports" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="flex px-4 md:px-0 mt-6 md:mt-10 border-b border-gray-100 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative pb-4 text-sm font-semibold tracking-wide transition-colors whitespace-nowrap"
          >
            <span
              className={`${
                activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
