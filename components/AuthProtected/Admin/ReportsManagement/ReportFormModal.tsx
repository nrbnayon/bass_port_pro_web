/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, Save, AlertCircle } from "lucide-react";
import {
  FishingReport,
  useUpdateReportMutation,
} from "@/redux/services/fishingReportApi";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormValues>({
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
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-foreground">Update Report</h2>
            <p className="text-sm text-secondary mt-1">
              Manage status and visibility
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="report-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="bg-gray-50 p-4 rounded-xl border border-border mb-6">
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {report?.title || "Untitled Report"}
              </h3>
              <p className="text-xs text-secondary mb-2">
                By {report?.user?.name} at {report?.lakeName}
              </p>
              <div className="text-sm text-foreground line-clamp-3">
                {report?.text}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground cursor-pointer"
              >
                <option value="active">Active (Visible)</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected (Hidden)</option>
                <option value="flagged">Flagged (Needs Attention)</option>
              </select>
              {errors.status && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-border hover:border-primary/20 transition-colors">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="w-5 h-5 rounded-md border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="featured"
                  className="block text-sm font-semibold text-foreground cursor-pointer"
                >
                  Feature this report
                </label>
                <p className="text-xs text-secondary mt-1">
                  Featured reports appear prominently on the fishing reports
                  timeline and dashboards.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="report-form"
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
          >
            {isUpdating ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
