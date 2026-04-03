"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Message01Icon } from "@hugeicons/core-free-icons";
import { LakeCard, ReportCard } from "@/types/landingData.types";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: ReportCard) => void;
  lake?: LakeCard;
}

// Generate a unique ID for a new report record
const generateReportId = () => `r${Date.now()}`;

// Get current date string in YYYY-MM-DD format
const getCurrentDateString = () => new Date().toISOString().split("T")[0];

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  lake,
}: ReportModalProps) {
  const [reportText, setReportText] = useState("");
  const [catches, setCatches] = useState("");
  const [biggestCatch, setBiggestCatch] = useState("");
  const [selectedLake, setSelectedLake] = useState(lake?.name || "");
  const [waterTemp, setWaterTemp] = useState(
    lake?.temp.replace("F", "") || "70",
  );
  const [waterClarity, setWaterClarity] = useState("Clear");
  const [weatherStatus, setWeatherStatus] = useState(lake?.weather || "Sunny");
  const [pressure, setPressure] = useState("Stable");
  const [techniques, setTechniques] = useState("");

  const handleSubmit = () => {
    if (!reportText.trim() || !catches || !biggestCatch || !selectedLake) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newReport: ReportCard = {
      id: generateReportId(),
      angler: "You (Guest)",
      date: getCurrentDateString(),
      lake: selectedLake,
      score: "80%",
      temp: `${waterTemp}°F`,
      catches: `${catches} catches`,
      text: reportText,
      tags: Array.from(
        new Set(
          techniques
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== ""),
        ),
      ),
      avatarImage: "/images/avatar.png",
      biggestCatch: `${biggestCatch} lbs`,
      weather: weatherStatus,
      waterLevel: pressure, // Mapping pressure to waterLevel for now as per type
    };

    onSubmit(newReport);
    setReportText("");
    setCatches("");
    setBiggestCatch("");
    setTechniques("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white sm:rounded-2xl shadow-2xl p-0 my-auto h-full sm:h-auto max-h-none sm:max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header - Fixed */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-5">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Submit Fishing Report
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 bg-gray-50 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2 custom-scrollbar">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Lake <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={selectedLake}
                    onChange={(e) => setSelectedLake(e.target.value)}
                    placeholder="Select a lake"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-4 font-semibold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border-solid placeholder:text-gray-300"
                    disabled={!!lake}
                  />
                  {!lake && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Water Temp (°F)
                  </label>
                  <input
                    type="number"
                    value={waterTemp}
                    onChange={(e) => setWaterTemp(e.target.value)}
                    className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Water Clarity
                  </label>
                  <div className="relative">
                    <select
                      value={waterClarity}
                      onChange={(e) => setWaterClarity(e.target.value)}
                      className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid appearance-none"
                    >
                      <option value="Clear">Clear</option>
                      <option value="Stained">Stained</option>
                      <option value="Muddy">Muddy</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Weather
                  </label>
                  <div className="relative">
                    <select
                      value={weatherStatus}
                      onChange={(e) => setWeatherStatus(e.target.value)}
                      className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid appearance-none"
                    >
                      <option value="Sunny">Sunny</option>
                      <option value="Partly Cloudy">Partly Cloudy</option>
                      <option value="Overcast">Overcast</option>
                      <option value="Rainy">Rainy</option>
                      <option value="Windy">Windy</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Pressure
                  </label>
                  <div className="relative">
                    <select
                      value={pressure}
                      onChange={(e) => setPressure(e.target.value)}
                      className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid appearance-none"
                    >
                      <option value="Stable">Stable</option>
                      <option value="Rising">Rising</option>
                      <option value="Falling">Falling</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Total Catches
                  </label>
                  <input
                    type="number"
                    value={catches}
                    onChange={(e) => setCatches(e.target.value)}
                    placeholder="Total fish caught"
                    className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Biggest (lbs)
                  </label>
                  <input
                    type="number"
                    value={biggestCatch}
                    onChange={(e) => setBiggestCatch(e.target.value)}
                    placeholder="Weight of kicker"
                    className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Techniques (comma separated)
                </label>
                <input
                  type="text"
                  value={techniques}
                  onChange={(e) => setTechniques(e.target.value)}
                  placeholder="e.g., Texas Rig, Crankbait, Topwater"
                  className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Report <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe your fishing experience, patterns, and conditions..."
                  className="w-full h-32 rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid resize-none placeholder:text-gray-300"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Message01Icon}
                  className="h-5 w-5 rotate-[-10deg]"
                />
                Send Message
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
