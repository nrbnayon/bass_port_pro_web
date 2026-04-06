/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Trash2,
  Search,
  LayoutGrid,
  List,
  SquarePen,
  CalendarDays,
  User,
  Fish,
} from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import {
  useGetReportsQuery,
  useDeleteReportMutation,
  FishingReport,
} from "@/redux/services/fishingReportApi";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableConfig } from "@/types/table.types";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { Badge } from "@/components/ui/badge";
import ReportFormModal from "./ReportFormModal";

export default function ReportsManagementClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FishingReport | null>(null);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<FishingReport | null>(null);

  const { data, isLoading, isError } = useGetReportsQuery({
    page,
    limit: 10,
    search: searchTerm,
  });

  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const handleEdit = (report: FishingReport) => {
    setSelectedReport(report);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (report: FishingReport) => {
    setReportToDelete(report);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      await deleteReport(reportToDelete._id).unwrap();
      toast.success("Report deleted successfully");
      setIsDeleteOpen(false);
      setReportToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete report");
    }
  };

  const tableConfig: TableConfig<FishingReport> = {
    columns: [
      {
        key: "title",
        header: "Report Info",
        render: (title, report) => (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {title || "Untitled Report"}
            </span>
            <div className="flex items-center gap-2 text-xs text-secondary mt-1">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {report.user?.name || "Unknown"}
              </span>
              <span className="flex items-center gap-1">
                | {report.lakeName}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "fishedAt",
        header: "Date Fished",
        render: (date) => (
          <div className="flex items-center gap-1.5 text-secondary">
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
        ),
        sortable: true,
      },
      {
        key: "catchCount",
        header: "Catches",
        render: (count, report) => (
          <div className="flex items-center gap-1.5">
            <Fish className="w-3.5 h-3.5 text-secondary" />
            <span className="text-sm font-medium text-foreground">
              {count || 0} catches
              {report.biggestCatch ? ` (Max: ${report.biggestCatch}lbs)` : ""}
            </span>
          </div>
        ),
        sortable: true,
      },
      {
        key: "status",
        header: "Status",
        render: (status, report) => (
          <div className="flex flex-col gap-1">
            <Badge
              variant={
                status === "active"
                  ? "success"
                  : status === "pending"
                    ? "warning"
                    : status === "rejected"
                      ? "destructive"
                      : "secondary"
              }
              className="w-fit"
            >
              {status}
            </Badge>
            {report.featured && (
              <Badge variant="outline" className="w-fit border-amber-400 text-amber-500 bg-amber-50">
                Featured
              </Badge>
            )}
          </div>
        ),
      },
    ],
    showActions: true,
    actions: [
      {
        icon: <SquarePen className="w-4 h-4 hover:text-blue cursor-pointer" />,
        label: "Edit",
        onClick: (report) => handleEdit(report),
        variant: "primary",
        tooltip: "Edit Report Status",
      },
      {
        icon: <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer" />,
        label: "Delete",
        onClick: (report) => handleDeleteClick(report),
        variant: "danger",
        tooltip: "Delete Report",
      },
    ],
    actionsAlign: "center",
    actionsWidth: "120px",
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <DashboardHeader
        title="Reports Management"
        description="Monitor, approve, and manage user-submitted fishing reports."
      />

      <div className="px-6 md:px-8 space-y-6">
        <div className="w-full bg-white p-4 rounded-2xl border border-primary/10">
          {/* Search and Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-primary/10 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, lake, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-border">
                <button
                  type="button"
                  aria-label="Table view"
                  title="Table view"
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Grid view"
                  title="Grid view"
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "table" ? (
            <DynamicTable<FishingReport>
              data={data?.reports || []}
              config={tableConfig}
              loading={isLoading}
              pagination={{
                enabled: true,
                pageSize: 10,
              }}
              onPageChange={setPage}
              emptyMessage={
                isError
                  ? "Error loading reports data"
                  : "No fishing reports found"
              }
              className="border-none shadow-none bg-white rounded-none p-0 mt-4"
              headerClassName="!bg-white !text-foreground font-semibold border-b border-gray-100"
              rowClassName="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
              striped={false}
              hoverable={true}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 rounded-2xl h-[200px]"
                    />
                  ))
              ) : isError || !data?.reports?.length ? (
                <div className="col-span-full py-12 text-center text-secondary">
                  {isError
                    ? "Error loading reports data"
                    : "No fishing reports found"}
                </div>
              ) : (
                data.reports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-white border text-left border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col p-5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground line-clamp-1">
                          {report.title || "Untitled Report"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-secondary mt-1">
                          <User className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">
                            {report.user?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge
                          variant={
                            report.status === "active"
                              ? "success"
                              : report.status === "pending"
                                ? "warning"
                                : report.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                          }
                          className="shadow-sm"
                        >
                          {report.status}
                        </Badge>
                        {report.featured && (
                          <Badge variant="outline" className="w-fit border-amber-400 text-amber-500 bg-amber-50 shadow-sm text-[10px] px-1.5">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      <div className="text-sm text-secondary line-clamp-2 mb-2">
                        {report.text || "No description provided."}
                      </div>

                      <div className="flex flex-wrap gap-3 mb-2">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg text-secondary">
                          <Fish className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{report.catchCount || 0} catches</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg text-secondary">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">
                            {new Date(report.fishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col mt-auto pt-4 border-t border-gray-50">
                      <div className="text-xs text-gray-400 mb-2">
                        Lake: <span className="font-semibold text-foreground">{report.lakeName}</span>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(report)}
                          className="p-2 bg-gray-50 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(report)}
                          className="p-2 bg-gray-50 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {isFormOpen && selectedReport && (
        <ReportFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setReportToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Report"
        description={`Warning: You are about to permanently delete the report "${reportToDelete?.title || 'Untitled'}". This action cannot be undone.`}
      />
    </div>
  );
}
