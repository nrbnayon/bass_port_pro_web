"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Message01Icon,
  Camera01Icon,
  CloudUploadIcon,
} from "@hugeicons/core-free-icons";
import { LakeCard, ReportCard } from "@/types/landingData.types";
import { toast } from "sonner";
import Image from "next/image";
import { calculateReportSuccessRate } from "@/lib/reportScore";
import { useGetLakeNamesQuery } from "@/redux/services/lakesApi";

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

const validWeatherOptions = new Set([
  "Sunny",
  "Clear",
  "Partly Cloudy",
  "Overcast",
  "Rainy",
  "Windy",
  "Stormy",
]);

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
  const [selectedSpecies, setSelectedSpecies] = useState(
    lake?.species?.[0] || "",
  );
  const [waterTemp, setWaterTemp] = useState(
    lake?.temp.replace("F", "") || "70",
  );
  const [waterClarity, setWaterClarity] = useState("Clear");
  const [weatherStatus, setWeatherStatus] = useState(
    lake && validWeatherOptions.has(lake.weather) ? lake.weather : "Sunny",
  );
  const [pressure, setPressure] = useState("Stable");
  const [techniques, setTechniques] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const { data: lakeNamesData } = useGetLakeNamesQuery();
  const lakeNames = lakeNamesData?.lakes || [];


  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedLake(lake?.name || "");
    setSelectedSpecies(lake?.species?.[0] || "");
    setWaterTemp(lake?.temp.replace("F", "") || "70");
    setWeatherStatus(
      lake && validWeatherOptions.has(lake.weather) ? lake.weather : "Sunny",
    );
    setImagePreview(null);
    setImageFile(null);
    setErrors(new Set());
  }, [isOpen, lake]);

  const parsedTags = Array.from(
    new Set(
      techniques
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    ),
  );

  const calculatedSuccessRate = calculateReportSuccessRate({
    text: reportText,
    tags: parsedTags,
    catchCount: Number(catches) || 0,
    biggestCatch: Number(biggestCatch) || 0,
    conditions: {
      weather: weatherStatus,
      clarity: waterClarity,
      waterLevel: "Normal",
      pressure,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const newErrors = new Set<string>();
    if (!reportText.trim()) newErrors.add("reportText");
    if (!catches) newErrors.add("catches");
    if (!biggestCatch) newErrors.add("biggestCatch");
    if (!selectedLake.trim()) newErrors.add("selectedLake");
    if (!selectedSpecies.trim()) newErrors.add("selectedSpecies");

    // Enforce selection from lake list if not pre-set
    if (
      !lake &&
      selectedLake.trim() &&
      !lakeNames.includes(selectedLake.trim())
    ) {
      newErrors.add("selectedLake");
      toast.error("Please select a valid lake from the dropdown.");
      return;
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setErrors(new Set());

    const newReport: ReportCard = {
      id: generateReportId(),
      angler: "You (Guest)",
      date: getCurrentDateString(),
      lake: selectedLake,
      species: selectedSpecies,
      score: `${calculatedSuccessRate}%`,
      temp: `${waterTemp}°F`,
      catches: `${catches} catches`,
      text: reportText,
      tags: parsedTags,
      avatarImage: "/images/avatar.png",
      biggestCatch: `${biggestCatch} lbs`,
      weather: weatherStatus,
      waterLevel: "Normal", // Using default or derived
      clarity: waterClarity,
      pressure: pressure,
      image: imagePreview || undefined,
      imageFile: imageFile || undefined,
    };

    onSubmit(newReport);
    setReportText("");
    setCatches("");
    setBiggestCatch("");
    setSelectedSpecies(lake?.species?.[0] || "");
    setTechniques("");
    setImageFile(null);
    setImagePreview(null);
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
          className="relative w-full max-w-4xl bg-white sm:rounded-2xl shadow-2xl p-0 my-auto h-full sm:h-auto max-h-none sm:max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header - Fixed */}
          <div className="sticky top-0 z-10 grid grid-cols-3 bg-white px-5 py-3 items-center border-b border-gray-50">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Fishing Report
            </h2>
            <div className="flex justify-center">
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 flex items-center gap-2 text-[10px] font-bold text-center">
                <p className="uppercase tracking-widest text-emerald-700">
                  Success Rate - {calculatedSuccessRate}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                aria-label="Close report modal"
                title="Close"
                className="rounded-full p-2 text-gray-400 bg-gray-50 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2 custom-scrollbar">
            <div className="flex flex-col gap-2">
              {/* Image Upload Area */}
              <div className="relative group">
                <input
                  type="file"
                  id="report-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="report-image"
                  className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all hover:border-primary/50 hover:bg-primary/5 ${
                    imagePreview
                      ? "border-transparent p-0"
                      : "border-gray-200 p-6"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-2xl"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <HugeiconsIcon
                          icon={Camera01Icon}
                          className="h-8 w-8 text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <HugeiconsIcon
                          icon={CloudUploadIcon}
                          className="h-6 w-6"
                        />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Click to add a photo to your report
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        JPG, PNG up to 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Lake <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {lake ? (
                    <input
                      type="text"
                      aria-label="select"
                      value={selectedLake}
                      readOnly
                      disabled
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-3 font-semibold text-gray-400 cursor-not-allowed"
                    />
                  ) : (
                    <>
                      <select
                        value={selectedLake}
                        onChange={(e) => {
                          setSelectedLake(e.target.value);
                          if (errors.has("selectedLake")) {
                            const next = new Set(errors);
                            next.delete("selectedLake");
                            setErrors(next);
                          }
                        }}
                        className={`w-full rounded-2xl border bg-gray-50/50 p-3 font-semibold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer ${
                          errors.has("selectedLake")
                            ? "border-red-400 focus:ring-red-500/10"
                            : "border-gray-100"
                        }`}
                      >
                        <option value="" disabled>Select a lake</option>
                        {lakeNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
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
                    </>
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
                    title="Water temperature"
                    aria-label="Water temperature"
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
                      title="Water clarity"
                      aria-label="Water clarity"
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
                      title="Weather"
                      aria-label="Weather"
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
                      title="Pressure"
                      aria-label="Pressure"
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
                    onChange={(e) => {
                      setCatches(e.target.value);
                      if (errors.has("catches")) {
                        const next = new Set(errors);
                        next.delete("catches");
                        setErrors(next);
                      }
                    }}
                    placeholder="Total fish caught"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                      errors.has("catches")
                        ? "border-red-400"
                        : "border-gray-100"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
                    Biggest (lbs)
                  </label>
                  <input
                    type="number"
                    value={biggestCatch}
                    onChange={(e) => {
                      setBiggestCatch(e.target.value);
                      if (errors.has("biggestCatch")) {
                        const next = new Set(errors);
                        next.delete("biggestCatch");
                        setErrors(next);
                      }
                    }}
                    placeholder="Weight of kicker"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                      errors.has("biggestCatch")
                        ? "border-red-400"
                        : "border-gray-100"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Techniques (comma separated)
                </label>
                <div className="flex flex-wrap gap-2 mb-1">
                  {[
                    "Flipping",
                    "Swim Jigs",
                    "Topwater",
                    "Crankbaits",
                    "Spinnerbaits",
                    "Texas Rig",
                    "Drop Shot",
                  ].map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        const current = techniques
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        if (
                          !current.some(
                            (t) => t.toLowerCase() === tech.toLowerCase(),
                          )
                        ) {
                          setTechniques(
                            [...current, tech].join(", ") +
                              (current.length === 0 ? ", " : ""),
                          );
                        }
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-primary hover:text-white text-xs font-bold rounded-xl text-gray-500 transition-colors cursor-pointer"
                    >
                      + {tech}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={techniques}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Automatically add space after comma if user types it
                    if (val.endsWith(",") && !val.endsWith(", ")) {
                      setTechniques(val + " ");
                    } else {
                      setTechniques(val);
                    }
                  }}
                  placeholder="e.g., Texas Rig, Crankbait, Topwater"
                  className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Target Species <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="report-species-options"
                  value={selectedSpecies}
                  onChange={(e) => {
                    setSelectedSpecies(e.target.value);
                    if (errors.has("selectedSpecies")) {
                      const next = new Set(errors);
                      next.delete("selectedSpecies");
                      setErrors(next);
                    }
                  }}
                  placeholder="e.g., Largemouth Bass"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                    errors.has("selectedSpecies")
                      ? "border-red-400"
                      : "border-gray-100"
                  }`}
                />
                <datalist id="report-species-options">
                  {(lake?.species || []).map((species) => (
                    <option key={species} value={species} />
                  ))}
                </datalist>
              </div>

              {/* <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 flex justify-between items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Success Rate (Auto Calculated)
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {calculatedSuccessRate}%
                </p>
              </div> */}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Report <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => {
                    setReportText(e.target.value);
                    if (errors.has("reportText")) {
                      const next = new Set(errors);
                      next.delete("reportText");
                      setErrors(next);
                    }
                  }}
                  placeholder="Describe your fishing experience, patterns, and conditions..."
                  className={`w-full h-32 rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid resize-none placeholder:text-gray-300 ${
                    errors.has("reportText")
                      ? "border-red-400"
                      : "border-gray-100"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="sticky bottom-0 z-10 bg-white px-5 py-3 border-t border-gray-50">
            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <HugeiconsIcon
                icon={Message01Icon}
                className="h-5 w-5 rotate-[-10deg]"
              />
              Send Message
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
