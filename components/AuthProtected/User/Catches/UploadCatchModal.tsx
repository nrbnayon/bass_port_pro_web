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
import Image from "next/image";

import { useUploadCatchMutation } from "@/redux/services/bassPornApi";
import { useGetLakeNamesQuery } from "@/redux/services/lakesApi";

interface UploadCatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

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
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const [uploadCatch, { isLoading }] = useUploadCatchMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: lakeNamesData } = useGetLakeNamesQuery();
  const lakeNames = lakeNamesData?.lakes || [];

  const parsedTechniques = Array.from(
    new Set(
      technique
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    ),
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (errors.has("image")) {
        const next = new Set(errors);
        next.delete("image");
        setErrors(next);
      }
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
    setSelectedFile(null);
    setErrors(new Set());
  }, []);

  const handleSubmit = async () => {
    const newErrors = new Set<string>();
    if (!lakeName) newErrors.add("lakeName");
    if (!weight) newErrors.add("weight");
    if (!length) newErrors.add("length");
    if (!species) newErrors.add("species");
    if (!selectedFile) newErrors.add("image");
    if (parsedTechniques.length === 0) newErrors.add("technique");

    if (newErrors.size > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields and upload a photo.");
      return;
    }

    setErrors(new Set());

    try {
      const formData = new FormData();
      formData.append("lakeName", lakeName);
      formData.append("weight", weight);
      formData.append("length", length);
      formData.append("species", species);
      formData.append("technique", parsedTechniques.join(", "));
      formData.append("description", description);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await uploadCatch(formData).unwrap();
      toast.success(
        "Catch uploaded successfully. It is now pending admin review.",
      );
      onSubmit();
      resetForm();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message || "Failed to upload catch.");
    }
  };

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
          className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white px-5 py-4 shadow-2xl overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Upload Your Catch
            </h2>
            <button
              onClick={onClose}
              aria-label="Close upload form"
              title="Close"
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
                    : errors.has("image")
                    ? "border-red-400 bg-red-50/10 p-8"
                    : "border-gray-200 p-8"
                }`}
              >
                {imagePreview ? (
                  <div className="relative h-44 w-full">
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
                    <p className="text-[15px] font-semibold text-foreground">
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
              <label className="text-sm font-semibold text-gray-500 ml-1">
                Lake Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={lakeName}
                  onChange={(e) => {
                    setLakeName(e.target.value);
                    if (errors.has("lakeName")) {
                      const next = new Set(errors);
                      next.delete("lakeName");
                      setErrors(next);
                    }
                  }}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid appearance-none cursor-pointer ${
                    errors.has("lakeName") ? "border-red-400" : "border-gray-100"
                  }`}
                >
                  <option value="" disabled>
                    Select a lake
                  </option>
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
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Weight (lbs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    if (errors.has("weight")) {
                      const next = new Set(errors);
                      next.delete("weight");
                      setErrors(next);
                    }
                  }}
                  placeholder="e.g., 8.5"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                    errors.has("weight") ? "border-red-400" : "border-gray-100"
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-500 ml-1">
                  Length (inches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={length}
                  onChange={(e) => {
                    setLength(e.target.value);
                    if (errors.has("length")) {
                      const next = new Set(errors);
                      next.delete("length");
                      setErrors(next);
                    }
                  }}
                  placeholder="e.g., 22"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                    errors.has("length") ? "border-red-400" : "border-gray-100"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-1">
              <label className="text-sm font-semibold text-gray-500 ml-1">
                Species <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="species-options"
                value={species}
                onChange={(e) => {
                  setSpecies(e.target.value);
                  if (errors.has("species")) {
                    const next = new Set(errors);
                    next.delete("species");
                    setErrors(next);
                  }
                }}
                placeholder="e.g., Largemouth Bass"
                className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                  errors.has("species") ? "border-red-400" : "border-gray-100"
                }`}
              />
              <datalist id="species-options">
                <option value="Largemouth Bass" />
                <option value="Smallmouth Bass" />
                <option value="Spotted Bass" />
                <option value="Striped Bass" />
              </datalist>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">
                Techniques (comma separated){" "}
                <span className="text-red-500">*</span>
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
                      const current = technique
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      if (
                        !current.some(
                          (t) => t.toLowerCase() === tech.toLowerCase(),
                        )
                      ) {
                        setTechnique(
                          [...current, tech].join(", ") +
                            (current.length === 0 ? ", " : ""),
                        );
                        if (errors.has("technique")) {
                          const next = new Set(errors);
                          next.delete("technique");
                          setErrors(next);
                        }
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
                value={technique}
                onChange={(e) => {
                  const val = e.target.value;
                  // Automatically add space after comma if user types it
                  if (val.endsWith(",") && !val.endsWith(", ")) {
                    setTechnique(val + " ");
                  } else {
                    setTechnique(val);
                  }

                  if (errors.has("technique")) {
                    const next = new Set(errors);
                    next.delete("technique");
                    setErrors(next);
                  }
                }}
                placeholder="e.g., Texas Rig, Crankbait, Topwater"
                className={`w-full rounded-2xl border bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid placeholder:text-gray-300 ${
                  errors.has("technique") ? "border-red-400" : "border-gray-100"
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-500 ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about this catch"
                className="w-full h-24 rounded-2xl border border-gray-100 bg-white px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-solid resize-none placeholder:text-gray-300"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <HugeiconsIcon icon={CloudUploadIcon} className="h-5 w-5" />
              {isLoading ? "Uploading..." : "Upload Catch Photo"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
