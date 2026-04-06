/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/redux/services/settingsApi";
import {
  FileText,
  ShieldCheck,
  Save,
  RefreshCw,
  Settings as SettingsIcon,
  ChevronRight,
  ClipboardList,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  privacyPolicy as defaultPrivacy,
  termsOfService as defaultTerms,
} from "@/data/legalData";

export default function AdminPrivacyPolicyPage() {
  const { data, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();

  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");

  // Sync with server data or use defaults
  useEffect(() => {
    if (data?.data) {
      const serverPrivacy = data.data.privacyPolicy || JSON.stringify(defaultPrivacy, null, 2);
      const serverTerms = data.data.termsOfService || JSON.stringify(defaultTerms, null, 2);
      
      if (serverPrivacy !== privacyPolicy) setPrivacyPolicy(serverPrivacy);
      if (serverTerms !== termsOfService) setTermsOfService(serverTerms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSettings({
        privacyPolicy,
        termsOfService,
      }).unwrap();
      toast.success("Legal documents updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update legal documents.");
    }
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        "Are you sure you want to reset to the built-in defaults? This will overwrite your current changes.",
      )
    ) {
      if (activeTab === "privacy") {
        setPrivacyPolicy(JSON.stringify(defaultPrivacy, null, 2));
      } else {
        setTermsOfService(JSON.stringify(defaultTerms, null, 2));
      }
      toast.success("Reset to defaults (Click Save to apply)");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen animate-pulse bg-gray-50/50">
        <div className="h-64 bg-gray-100" />
        <div className="p-8 space-y-6">
          <div className="h-10 bg-gray-200 w-1/4 rounded-lg" />
          <div className="h-[500px] bg-gray-200 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col pb-20">
      <DashboardHeader
        title="Legal & Policy Administration"
        description="Manage the core legal documents for BassInsight. Updates are live across the platform."
      />

      <div className="p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm w-fit self-center lg:self-start">
          <TabButton
            active={activeTab === "privacy"}
            onClick={() => setActiveTab("privacy")}
            icon={ShieldCheck}
            label="Privacy Policy"
          />
          <TabButton
            active={activeTab === "terms"}
            onClick={() => setActiveTab("terms")}
            icon={FileText}
            label="Terms of Service"
          />
        </div>

        {/* Editor Container */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.99, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col gap-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${activeTab === "privacy" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"}`}
              >
                {activeTab === "privacy" ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ClipboardList className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {activeTab === "privacy"
                    ? "Privacy & Data Protection"
                    : "User Service Terms"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === "privacy"
                    ? "Last synchronized with public view."
                    : "Governing rules for across all platform modules."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleResetToDefault}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 shadow-lg shadow-indigo-200 flex items-center h-12"
              >
                {isUpdating ? (
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Publish Changes
              </Button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute top-4 right-4 text-[10px] uppercase font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Rich Text / JSON Mode
            </div>
            <textarea
              value={activeTab === "privacy" ? privacyPolicy : termsOfService}
              onChange={(e) =>
                activeTab === "privacy"
                  ? setPrivacyPolicy(e.target.value)
                  : setTermsOfService(e.target.value)
              }
              placeholder="Enter document content here..."
              className="w-full h-[600px] bg-gray-50/50 border border-gray-200 rounded-[1.5rem] p-8 text-gray-800 font-mono text-sm leading-relaxed focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
            <SettingsIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] text-indigo-600/80 font-medium">
              Note: Ensure the content is formatted as JSON if using sectioned
              components, or plain text if using the direct rich view.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
        ${
          active
            ? "bg-gray-900 text-white shadow-md scale-[1.02]"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        }
      `}
    >
      <Icon className={`w-4 h-4 ${active ? "text-indigo-400" : ""}`} />
      {label}
      {active && <ChevronRight className="w-4 h-4 opacity-50 ml-1" />}
    </button>
  );
}
