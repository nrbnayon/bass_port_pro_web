/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FishingReport,
  useUpdateReportMutation,
} from "@/redux/services/fishingReportApi";
import { Badge } from "@/components/ui/badge";

const reportSchema = z.object({
  status: z.enum(["active", "pending", "rejected", "flagged"]),
  featured: z.boolean(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FishingReport | null;
}

export default function ReportFormModal({
  isOpen,
  onClose,
  report,
}: ReportFormModalProps) {
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  const { register, handleSubmit, reset } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      status: "pending",
      featured: false,
    },
  });

  useEffect(() => {
    if (report && isOpen) {
      reset({
        status: report.status,
        featured: report.featured,
      });
    } else if (!isOpen) {
      reset();
    }
  }, [report, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ReportFormValues) => {
    if (!report) return;

    try {
      await updateReport({
        id: report._id,
        data,
      }).unwrap();

      toast.success("Report updated successfully");
      // Don't close automatically so they can see the change, or close if you want
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-4">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Reports Details
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-10 pb-5 space-y-5">
          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-y-5">
            <div>
              <label className="text-secondary text-sm mb-1 block">User</label>
              <p className="text-foreground font-bold text-lg">
                {report?.user?.name || "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-secondary text-sm mb-1 block">Lake</label>
              <p className="text-foreground font-bold text-lg">
                {report?.lakeName}
              </p>
            </div>
            <div>
              <label className="text-secondary text-sm mb-1 block">
                Species
              </label>
              <p className="text-foreground font-bold text-lg">
                {report?.species || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-secondary text-sm mb-1 block">
                Success Rate
              </label>
              <p className="text-[#10B981] font-bold text-lg">
                {report?.score || 0}%
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Overview */}
          <div>
            <label className="text-secondary text-sm mb-2 block">
              Reports Overview
            </label>
            <p className="text-[#4B5563] text-sm leading-relaxed">
              {report?.text}
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-secondary text-sm mb-2 block">
                Status
              </label>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    report?.status === "active"
                      ? "success"
                      : report?.status === "pending"
                        ? "warning"
                        : report?.status === "rejected"
                          ? "destructive"
                          : "secondary"
                  }
                  className="px-4 py-1.5 text-xs font-semibold rounded-full capitalize"
                >
                  {report?.status === "active" ? "Approved" : report?.status}
                </Badge>

                {/* Status Switcher (For Admin to actually change it) */}
                <select
                  {...register("status")}
                  onChange={handleSubmit(onSubmit)}
                  className="bg-gray-50 border-none rounded-lg px-2 py-1 text-xs font-medium text-gray-500 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="active">Approve</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Reject</option>
                  <option value="flagged">Flag</option>
                </select>
              </div>
            </div>

            <div className="text-right">
              <label className="text-secondary text-sm mb-2 block">
                Featured
              </label>
              <input
                type="checkbox"
                {...register("featured")}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#F3F4F6] hover:bg-gray-200 text-foreground font-bold py-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              onClick={handleSubmit(onSubmit)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              {isUpdating ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
