/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import {
  FishingReport,
  useDeleteReportMutation,
  useUpdateReportMutation,
} from "@/redux/services/fishingReportApi";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";

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
  const [featuredLocal, setFeaturedLocal] = useState(false);

  useEffect(() => {
    if (report) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeaturedLocal(Boolean(report.featured));
    }
  }, [report]);

  const handleToggleFeatured = async () => {
    if (!report) return;
    const newFeatured = !featuredLocal;
    setFeaturedLocal(newFeatured);

    try {
      await updateReport({
        id: report._id,
        data: { featured: newFeatured },
      }).unwrap();
      toast.success(
        newFeatured ? "Report is now featured!" : "Report removed from featured."
      );
      onSuccess?.();
    } catch (error: any) {
      setFeaturedLocal(!newFeatured);
      toast.error(error?.data?.message || "Failed to update featured status");
    }
  };

  const handleApprove = async () => {
    if (!report) return;
    try {
      await updateReport({
        id: report._id,
        data: { status: "active" },
      }).unwrap();
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
      await updateReport({
        id: report._id,
        data: { status: "rejected" },
      }).unwrap();
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-4 h-screen "
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Reports Details
            </h2>
            <button
              aria-label="Close report details"
              title="Close"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 pt-2">
            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              <div>
                <label className="text-secondary text-xs uppercase tracking-wider font-semibold block">
                  User
                </label>
                <p className="text-foreground font-bold text-lg">
                  {report?.user?.name || "Unknown"}
                </p>
              </div>
              <div>
                <label className="text-secondary text-xs uppercase tracking-wider font-semibold block">
                  Lake
                </label>
                <p className="text-foreground font-bold text-lg">
                  {report?.lakeName}
                </p>
              </div>
              <div>
                <label className="text-secondary text-xs uppercase tracking-wider font-semibold mb-1 block">
                  Species
                </label>
                <p className="text-foreground font-bold text-lg">
                  {report?.species || report?.lake?.species?.[0] || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-secondary text-xs uppercase tracking-wider font-semibold mb-1 block">
                  Success Rate
                </label>
                <p className="text-[#10B981] font-bold text-lg">
                  {report?.score || 0}%
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Status Section */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-secondary text-xs uppercase tracking-wider font-semibold mb-2 block">
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
                    Moderation actions below
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <label
                  className="text-secondary text-sm font-semibold cursor-pointer"
                  htmlFor="featuredToggle"
                >
                  Featured
                </label>
                <input
                  id="featuredToggle"
                  type="checkbox"
                  checked={featuredLocal}
                  onChange={handleToggleFeatured}
                  disabled={isUpdating}
                  className="w-5 h-5 rounded-md border-2 border-gray-300 transition-all checked:bg-primary checked:border-primary focus:ring-primary cursor-pointer disabled:opacity-50 accent-primary"
                  style={{ accentColor: "hsl(var(--primary))" }}
                />
              </div>
            </div>

            {/* Overview */}
            <div>
              <label className="text-foreground font-bold text-sm mb-2 block">
                Reports Overview
              </label>
              <p className="text-secondary text-sm leading-relaxed italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                &quot;{report?.text}&quot;
              </p>
            </div>

            {report?.image && (
              <>
                <div>
                  <label className="text-secondary text-xs uppercase tracking-wider font-semibold mb-2 block">
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
              </>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isUpdating || isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer text-sm shadow-lg shadow-red-500/10"
              >
                Delete Report
              </button>
              <button
                type="button"
                onClick={() => setIsRejectOpen(true)}
                disabled={
                  isUpdating || isDeleting || report?.status === "rejected"
                }
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer text-sm shadow-lg shadow-amber-500/10"
              >
                Reject Report
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={
                  isUpdating || isDeleting || report?.status === "active"
                }
                className="flex-[1.5] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer text-sm shadow-lg shadow-emerald-500/10"
              >
                {report?.status === "active"
                  ? "Report Approved"
                  : "Approve Report"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject Report"
        message={`Are you sure you want to reject '${report?.title || "this report"}'?`}
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
        description={`Warning: You are about to permanently delete '${report?.title || "this report"}'. This action cannot be undone.`}
      />
    </>
  );
}
