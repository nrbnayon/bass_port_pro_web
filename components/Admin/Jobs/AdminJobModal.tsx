"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  DollarSign,
  Building2,
  UploadCloud,
  Loader2,
} from "lucide-react";
import {
  Job,
  JobCategory,
  JobType,
  categories,
  jobTypes,
} from "@/data/jobsData";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "add";
  job?: Job | null;
  onSave: (job: Job) => void;
  onDelete?: (id: string) => void;
}

const EMPTY_JOB: Omit<Job, "id" | "featured" | "postedAt"> = {
  title: "",
  company: "",
  location: "",
  type: "Full-Time",
  category: "Design",
  salary: "",
  description: "",
  responsibilities: [""],
  requirements: [""],
  tags: [],
  logo: "",
  logoUrl: "",
  logoColor: "#4640DE",
  logoBg: "#F8F8FD",
  companySize: "",
  industry: "",
};

export default function AdminJobModal({
  isOpen,
  onClose,
  mode: initialMode,
  job,
  onSave,
  onDelete,
}: JobModalProps) {
  const [mode, setMode] = useState<"view" | "edit" | "add">(initialMode);
  const [form, setForm] = useState<Job>(
    job || ({ ...EMPTY_JOB, id: "", featured: false, postedAt: "" } as Job),
  );
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setForm(
        job ||
          ({
            ...EMPTY_JOB,
            id: "",
            featured: false,
            postedAt: new Date().toISOString().split("T")[0],
          } as Job),
      );
      setErrors({});
      setIsUploading(false);
    }
  }, [isOpen, initialMode, job]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm((prev) => ({ ...prev, logoUrl: data.url }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      id: form.id || Date.now().toString(),
      postedAt: form.postedAt || new Date().toISOString().split("T")[0],
      responsibilities: form.responsibilities.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
    });
    onClose();
  };

  const updateListItem = (
    field: "responsibilities" | "requirements",
    index: number,
    value: string,
  ) => {
    const arr = [...form[field]];
    arr[index] = value;
    setForm({ ...form, [field]: arr });
  };

  const addListItem = (field: "responsibilities" | "requirements") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeListItem = (
    field: "responsibilities" | "requirements",
    index: number,
  ) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const headerTitle =
    mode === "add"
      ? "Create New Listing"
      : mode === "edit"
        ? "Edit Job Listing"
        : "Job Details";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-[800px] h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#D6DDEB]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#D6DDEB] flex items-center justify-between shrink-0 bg-[#F8F8FD]">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl font-semibold text-[18px] text-white relative overflow-hidden"
                style={
                  !form.logoUrl
                    ? { backgroundColor: form.logoColor || "#4640DE" }
                    : {}
                }
              >
                {form.logoUrl ? (
                  <Image
                    src={form.logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  form.logo || "J"
                )}
              </div>
              <div>
                <h2 className="font-clash font-semibold text-[22px] text-[#25324B]">
                  {headerTitle}
                </h2>
                <p className="text-xs text-[#7C8493]">
                  {mode === "view"
                    ? "Published for your network"
                    : "Configure all parameters below"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mode === "view" && (
                <button
                  onClick={() => setMode("edit")}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-[#7C8493] hover:text-[#25324B] hover:bg-[#F5F5FA] rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form / Details Body */}
          <form
            id="job-modal-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto custom-scrollbar bg-white"
          >
            <div className="px-8 py-8 space-y-8">
              {/* Basic Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-primary">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-semibold text-[14px] uppercase tracking-wider">
                    Basic Information
                  </span>
                </div>

                {mode !== "view" && (
                  <div className="col-span-full">
                    <label className="block text-[14px] font-semibold text-[#25324B] mb-2">
                      Company Logo (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0 rounded-lg border border-[#D6DDEB] bg-[#F8F8FD] flex items-center justify-center relative overflow-hidden">
                        {form.logoUrl ? (
                          <Image
                            src={form.logoUrl}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-[#7C8493]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D6DDEB] text-[#515B6F] text-xs font-semibold hover:border-primary hover:text-primary rounded-lg transition-all">
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UploadCloud className="w-4 h-4" />
                          )}
                          {isUploading ? "Uploading..." : "Upload Logo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                        <p className="text-[12px] text-[#7C8493] mt-2">
                          Recommended size: 256x256px. Formats: JPG, PNG, WEBP.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.title}
                      </p>
                    ) : (
                      <input
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-3 bg-[#F8F8FD] border rounded-lg focus:border-primary outline-none text-[14px] transition-all",
                          errors.title ? "border-red-500" : "border-[#D6DDEB]",
                        )}
                        placeholder="e.g. Senior Product Designer"
                      />
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.company}
                      </p>
                    ) : (
                      <input
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        className={cn(
                          "w-full px-4 py-3 bg-[#F8F8FD] border rounded-lg focus:border-primary outline-none text-[14px] transition-all",
                          errors.company
                            ? "border-red-500"
                            : "border-[#D6DDEB]",
                        )}
                        placeholder="e.g. Stripe"
                      />
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Location <span className="text-red-500">*</span>
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.location}
                      </p>
                    ) : (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8493]" />
                        <input
                          value={form.location}
                          onChange={(e) =>
                            setForm({ ...form, location: e.target.value })
                          }
                          className={cn(
                            "w-full pl-10 pr-4 py-3 bg-[#F8F8FD] border rounded-lg focus:border-primary outline-none text-[14px] transition-all",
                            errors.location
                              ? "border-red-500"
                              : "border-[#D6DDEB]",
                          )}
                          placeholder="e.g. Paris, France or Remote"
                        />
                      </div>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Salary Range
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.salary || "Not disclosed"}
                      </p>
                    ) : (
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8493]" />
                        <input
                          value={form.salary}
                          onChange={(e) =>
                            setForm({ ...form, salary: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-[#F8F8FD] border border-[#D6DDEB] rounded-lg focus:border-primary outline-none text-[14px] transition-all"
                          placeholder="e.g. $100k - $120k"
                        />
                      </div>
                    )}
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.type}
                      </p>
                    ) : (
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value as JobType })
                        }
                        className="w-full px-4 py-3 bg-[#F8F8FD] border border-[#D6DDEB] rounded-lg focus:border-primary outline-none text-[14px] transition-all appearance-none cursor-pointer"
                      >
                        {jobTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Category <span className="text-red-500">*</span>
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.category}
                      </p>
                    ) : (
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            category: e.target.value as JobCategory,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#F8F8FD] border border-[#D6DDEB] rounded-lg focus:border-primary outline-none text-[14px] transition-all appearance-none cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Featured */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[14px] font-semibold text-[#25324B]">
                      Featured Listing
                    </label>
                    {mode === "view" ? (
                      <p className="text-[15px] text-[#515B6F] p-3 border-b border-[#D6DDEB]/50">
                        {form.featured ? "Yes" : "No"}
                      </p>
                    ) : (
                      <label className="flex items-center justify-between px-4 py-3 bg-[#F8F8FD] border border-[#D6DDEB] rounded-lg cursor-pointer">
                        <span className="text-[14px] text-[#25324B] font-medium">
                          Show this job in featured sections
                        </span>
                        <input
                          type="checkbox"
                          checked={Boolean(form.featured)}
                          onChange={(e) =>
                            setForm({ ...form, featured: e.target.checked })
                          }
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Description & Requirements */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary pt-4">
                  <Building2 className="w-4 h-4" />
                  <span className="font-semibold text-[14px] uppercase tracking-wider">
                    Role Details
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-[#25324B]">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  {mode === "view" ? (
                    <p className="text-[15px] text-[#515B6F] bg-[#F8F8FD] p-5 rounded-xl border border-[#D6DDEB]/40 leading-relaxed whitespace-pre-wrap">
                      {form.description}
                    </p>
                  ) : (
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className={cn(
                        "w-full px-4 py-3 bg-[#F8F8FD] border rounded-lg focus:border-primary outline-none text-[14px] transition-all min-h-[120px] resize-none",
                        errors.description
                          ? "border-red-500"
                          : "border-[#D6DDEB]",
                      )}
                      placeholder="Explain the role and mission..."
                    />
                  )}
                </div>

                {/* Responsibilities List */}
                <div className="space-y-3">
                  <label className="text-[14px] font-semibold text-[#25324B]">
                    Key Responsibilities
                  </label>
                  {form.responsibilities.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      {mode === "view" ? (
                        <div className="flex gap-3 text-[14px] text-[#515B6F] bg-[#F8F8FD] p-3 rounded-lg flex-1">
                          <span className="text-primary font-semibold">•</span>
                          <span>{r}</span>
                        </div>
                      ) : (
                        <>
                          <input
                            value={r}
                            onChange={(e) =>
                              updateListItem(
                                "responsibilities",
                                i,
                                e.target.value,
                              )
                            }
                            className="flex-1 px-4 py-2 border border-[#D6DDEB] bg-[#F8F8FD] rounded-lg text-xs outline-none focus:border-primary"
                            placeholder={`Point ${i + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeListItem("responsibilities", i)
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => addListItem("responsibilities")}
                      className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline px-2"
                    >
                      <Plus className="w-4 h-4" /> Add Responsibility
                    </button>
                  )}
                </div>

                {/* Requirements List */}
                <div className="space-y-3">
                  <label className="text-[14px] font-semibold text-[#25324B]">
                    Preferred Qualifications
                  </label>
                  {form.requirements.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      {mode === "view" ? (
                        <div className="flex gap-3 text-[14px] text-[#515B6F] bg-[#F8F8FD] p-3 rounded-lg flex-1">
                          <span className="text-primary font-semibold">•</span>
                          <span>{r}</span>
                        </div>
                      ) : (
                        <>
                          <input
                            value={r}
                            onChange={(e) =>
                              updateListItem("requirements", i, e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-[#D6DDEB] bg-[#F8F8FD] rounded-lg text-xs outline-none focus:border-primary"
                            placeholder={`Requirement ${i + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem("requirements", i)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => addListItem("requirements")}
                      className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline px-2"
                    >
                      <Plus className="w-4 h-4" /> Add Requirement
                    </button>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4 pt-4">
                <label className="text-[14px] font-semibold text-[#25324B]">
                  Search Tags
                </label>
                {mode !== "view" && (
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-[#D6DDEB] bg-[#F8F8FD] rounded-lg text-xs outline-none focus:border-primary"
                      placeholder="Add tag (e.g. Remote, Senior)..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-5 bg-white border-2 border-[#D6DDEB] text-[#515B6F] text-xs font-semibold hover:border-primary hover:text-primary rounded-lg transition-all"
                    >
                      Add
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/5 text-primary text-[12px] font-semibold rounded-full border border-primary/10 group"
                    >
                      {tag}
                      {mode !== "view" && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              tags: form.tags.filter((t) => t !== tag),
                            })
                          }
                          className="hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                  {form.tags.length === 0 && (
                    <p className="text-xs text-[#7C8493] italic">
                      No tags added.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="shrink-0 p-6 border-t border-[#D6DDEB] bg-[#F8F8FD] flex items-center justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-semibold text-[14px] text-[#515B6F] hover:text-[#25324B] transition-colors"
            >
              Cancel
            </button>
            {mode === "view" ? (
              <div className="flex items-center gap-3">
                {onDelete && job && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(job.id);
                      onClose();
                    }}
                    className="px-6 py-3 bg-red-50 text-red-500 font-semibold text-[14px] rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Post
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="px-8 py-3 bg-primary text-white font-semibold text-[14px] rounded-xl hover:bg-primary/80 shadow-[0_10px_30px_rgba(70,64,222,0.2)] transition-all flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit Details
                </button>
              </div>
            ) : (
              <button
                type="submit"
                form="job-modal-form"
                className="px-10 py-3 bg-primary text-white font-semibold text-[14px] rounded-xl hover:bg-primary/80 shadow-[0_10px_30px_rgba(70,64,222,0.2)] transition-all flex items-center gap-2"
              >
                {mode === "add" ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
                {mode === "add" ? "Create Listing" : "Save Changes"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
