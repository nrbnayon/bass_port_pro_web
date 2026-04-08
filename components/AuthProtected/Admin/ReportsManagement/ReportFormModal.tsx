/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FishingReport,
  useDeleteReportMutation,
  useUpdateReportMutation,
} from "@/redux/services/fishingReportApi";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";

const resolveMediaUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const origin = apiBase.replace(/\/api\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const reportSchema = z.object({
  status: z.enum(["active", "pending", "rejected", "flagged"]),
  featured: z.boolean(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FishingReport | null;
  onSuccess?: () => void;
}

export default function ReportFormModal({
  isOpen,
  onClose,
  report,
  onSuccess,
}: ReportFormModalProps) {
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update report");
    }
  };

  const handleApprove = async () => {
    if (!report) return;
    try {
      await updateReport({ id: report._id, data: { status: "active" } }).unwrap();
      toast.success("Report approved successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve report");
    }
  };

  const handleReject = async () => {
    if (!report) return;
    try {
      await updateReport({ id: report._id, data: { status: "rejected" } }).unwrap();
      toast.success("Report rejected successfully");
      onSuccess?.();
      setIsRejectOpen(false);
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject report");
    }
  };

  const handleDelete = async () => {
    if (!report) return;
    try {
      await deleteReport(report._id).unwrap();
      toast.success("Report deleted successfully");
      onSuccess?.();
      setIsDeleteOpen(false);
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-4 h-screen ">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Reports Details
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-y-2">
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
                {report?.species || report?.lake?.species?.[0] || "N/A"}
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

          {report?.image && (
            <div>
              <label className="text-secondary text-sm mb-2 block">
                Submitted Image
              </label>
              <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                <Image
                  src={resolveMediaUrl(report.image)}
                  alt={report.title || "Submitted report image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {report?.image && <div className="h-px bg-gray-100" />}

          {/* Overview */}
          <div>
            <label className="text-foreground font-bold text-sm mb-2 block">
              Reports Overview
            </label>
            <p className="text-secondary text-sm leading-relaxed italic">
              &quot;{report?.text}&quot;
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

                <span className="text-xs font-medium text-secondary">
                  Use actions below to moderate this report.
                </span>
              </div>
            </div>

            <div className="text-right flex items-center gap-2 justify-center">
              <label className="text-secondary text-sm block">Featured</label>
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
              onClick={() => setIsDeleteOpen(true)}
              disabled={isUpdating || isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setIsRejectOpen(true)}
              disabled={isUpdating || isDeleting}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              Reject
            </button>
            
            <button
              type="button"
              onClick={handleApprove}
              disabled={isUpdating || isDeleting}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              Approve
            </button>
          </div>

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

      <ConfirmationModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject Report"
        message={`Are you sure you want to reject \"${report?.title || "this report"}\"?`}
        confirmText="Reject"
        cancelText="Cancel"
        isDestructive
        isLoading={isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Report"
        description={`Warning: You are about to permanently delete \"${report?.title || "this report"}\". This action cannot be undone.`}
      />
    </div>
  );
}
