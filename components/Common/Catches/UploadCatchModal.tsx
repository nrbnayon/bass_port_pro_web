"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Camera01Icon,
  CloudUploadIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { CatchCard } from "@/types/landingData.types";
import Image from "next/image";

interface UploadCatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCatch: CatchCard) => void;
}

// Generate a unique ID for a new catch record
const generateCatchId = () => `c-${Date.now()}`;

// Get current date string in YYYY-MM-DD format
const getCurrentDateString = () => new Date().toISOString().split("T")[0];

export default function UploadCatchModal({
  isOpen,
  onClose,
  onSubmit,
}: UploadCatchModalProps) {
  const [lakeName, setLakeName] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [species, setSpecies] = useState("Largemouth Bass");
  const [technique, setTechnique] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = React.useCallback(() => {
    setLakeName("");
    setWeight("");
    setLength("");
    setSpecies("Largemouth Bass");
    setTechnique("");
    setDescription("");
    setImagePreview(null);
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (!lakeName || !weight || !length || !imagePreview) {
      toast.error("Please fill in all required fields and upload a photo.");
      return;
    }

    const newCatch: CatchCard = {
      id: generateCatchId(),
      angler: "You (Guest)",
      lake: lakeName,
      weight: `${weight} lbs`,
      image: imagePreview,
      species,
      length: `${length}"`,
      technique,
      date: getCurrentDateString(),
      likes: 0,
      avatarImage: "/images/avatar.png",
      description: description || "Fresh catch shared from the community!",
    };

    onSubmit(newCatch);
    resetForm();
    onClose();
  }, [
    lakeName,
    weight,
    length,
    imagePreview,
    species,
    technique,
    description,
    onSubmit,
    resetForm,
    onClose,
  ]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white p-5 shadow-2xl overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Upload Your Catch
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* Image Upload Area */}
            <div className="relative group">
              <input
                type="file"
                id="catch-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="catch-image"
                className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all hover:border-primary/50 hover:bg-primary/5 ${
                  imagePreview
                    ? "border-transparent p-0"
                    : "border-gray-200 p-8"
                }`}
              >
                {imagePreview ? (
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={600}
                      height={176}
                      className="h-44 w-full object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <HugeiconsIcon
                        icon={Camera01Icon}
                        className="h-10 w-10 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <HugeiconsIcon
                        icon={CloudUploadIcon}
                        className="h-7 w-7"
                      />
                    </div>
                    <p className="text-[15px] font-bold text-foreground">
                      Click to select a photo
                    </p>
                    <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      JPG, PNG up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-500 ml-1">
                Lake Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lakeName}
                onChange={(e) => setLakeName(e.target.value)}
                placeholder="e.g., Lake Fork"
                className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Weight (lbs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 8.5"
                  className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Length (inches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g., 22"
                  className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Species
                </label>
                <div className="relative">
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid appearance-none"
                  >
                    <option value="Largemouth Bass">Largemouth Bass</option>
                    <option value="Smallmouth Bass">Smallmouth Bass</option>
                    <option value="Spotted Bass">Spotted Bass</option>
                    <option value="Striped Bass">Striped Bass</option>
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Technique
                </label>
                <input
                  type="text"
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  placeholder="e.g., Texas Rig"
                  className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-500 ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about this catch"
                className="w-full h-24 rounded-2xl border border-gray-100 bg-white p-5 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid resize-none placeholder:text-gray-300"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <HugeiconsIcon icon={CloudUploadIcon} className="h-5 w-5" />
              Upload Catch Photo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
