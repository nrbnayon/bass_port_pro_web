/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreateLakeMutation,
  useUpdateLakeMutation,
  Lake,
} from "@/redux/services/lakesApi";
import { toast } from "sonner";

interface LakeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lake?: Lake | null;
}

const STATES = [
  "Alabama",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Florida",
  "Georgia",
  "Louisiana",
  "Maryland",
  "Missouri",
  "Mississippi",
  "Nevada",
  "New York",
  "North Carolina",
  "South Carolina",
  "Tennessee",
  "Texas",
  "Virginia",
];

export default function LakeFormModal({
  isOpen,
  onClose,
  lake,
}: LakeFormModalProps) {
  const [createLake, { isLoading: isCreating }] = useCreateLakeMutation();
  const [updateLake, { isLoading: isUpdating }] = useUpdateLakeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    state: string;
    description: string;
    size: number;
    elevation: number;
    maxDepth: number;
    avgDepth: number;
    status: "pending" | "active" | "rejected" | "closed";
    featured: boolean;
  }>({
    name: "",
    state: "",
    description: "",
    size: 0,
    elevation: 0,
    maxDepth: 0,
    avgDepth: 0,
    status: "pending",
    featured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (lake) {
        // eslint-disable-next-line
        setFormData({
          name: lake.name || "",
          state: lake.state || "",
          description: lake.description || "",
          size: lake.size || 0,
          elevation: lake.elevation || 0,
          maxDepth: lake.maxDepth || 0,
          avgDepth: lake.avgDepth || 0,
          status: lake.status || "active",
          featured: lake.featured || false,
        });
        setPreviewUrl(lake.image || null);
      } else {
        setFormData({
          name: "",
          state: "",
          description: "",
          size: 0,
          elevation: 0,
          maxDepth: 0,
          avgDepth: 0,
          status: "active",
          featured: false,
        });
        setPreviewUrl(null);
        setImageFile(null);
      }
    }
  }, [lake, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.state) {
      toast.error("Please fill in the required fields (Name and State)");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("state", formData.state);
    data.append("description", formData.description);
    data.append("size", formData.size.toString());
    data.append("elevation", formData.elevation.toString());
    data.append("status", formData.status);
    data.append("featured", formData.featured.toString());

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (lake) {
        await updateLake({ id: lake._id, data }).unwrap();
        toast.success("Lake updated successfully!");
      } else {
        await createLake(data).unwrap();
        toast.success("New lake created!");
      }
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {lake ? "Edit Lake Details" : "Create New Lake Entry"}
            </h2>
            <p className="text-secondary text-sm font-medium mt-1">
              Provide high-quality information about the fishing spot.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-50 text-secondary hover:text-red-500 transition-all hover:rotate-90 active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar"
        >
          {/* Basic Info Group */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                Identity & Location
              </h3>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-secondary ml-1">
                Primary Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group relative h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${previewUrl ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary hover:bg-gray-50"}`}
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      className="w-full h-full object-cover rounded-[1.4rem]"
                      alt="Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-[1.4rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <p className="text-white font-bold flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change Image
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-secondary mt-1">
                      JPEG, PNG or WEBP up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary ml-1">
                  Lake Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Lake Guntersville"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary ml-1">
                  State / Region <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    list="states-list"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter or select state..."
                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    autoComplete="off"
                  />
                  <datalist id="states-list">
                    {STATES.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-secondary ml-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Briefly describe the lake's history, fishing features, and access..."
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
            />
          </div>

          {/* Specs Group */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                Physical & Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">
                  Size (Acres)
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">
                  Max Depth (ft)
                </label>
                <input
                  type="number"
                  name="maxDepth"
                  value={formData.maxDepth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">
                  Elevation (ft)
                </label>
                <input
                  type="number"
                  name="elevation"
                  value={formData.elevation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Status & Featured */}
          <div className="flex flex-wrap items-center justify-between gap-6 p-4 rounded-3xl bg-gray-50">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                Visibility Status
              </label>
              <div className="flex gap-2">
                {["pending", "active", "rejected", "closed"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: s as any }))
                    }
                    className={`p-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${formData.status === s ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-secondary hover:bg-white/80"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 px-4 rounded-2xl bg-white  border border-primary/30 mt-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="featured"
                className="text-sm font-bold text-foreground cursor-pointer select-none"
              >
                Feature this Lake
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex gap-4 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest border-border hover:bg-foreground"
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-[2] rounded-2xl h-12 font-black uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : lake ? (
              "Update Location Data"
            ) : (
              "Initialize Lake Location"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
