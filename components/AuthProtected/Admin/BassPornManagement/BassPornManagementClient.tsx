/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Trash2,
  Search,
  LayoutGrid,
  List,
  CalendarDays,
  User as UserIcon,
  MapPin,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import {
  useGetAdminCatchesQuery,
  useUpdateCatchMutation,
  useDeleteCatchMutation,
  CatchItem,
} from "@/redux/services/bassPornApi";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableConfig } from "@/types/table.types";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";

export default function BassPornManagementClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CatchItem | null>(null);

  const { data, isLoading } = useGetAdminCatchesQuery({
    page,
    limit: 12,
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [updateCatch] = useUpdateCatchMutation();
  const [deleteCatch, { isLoading: isDeleting }] = useDeleteCatchMutation();

  const handleApprove = async (item: CatchItem) => {
    try {
      await updateCatch({
        id: item._id,
        data: { status: "active" } as any,
      }).unwrap();
      toast.success("Catch approved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve catch");
    }
  };

  const handleDeleteClick = (item: CatchItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCatch(itemToDelete._id).unwrap();
      toast.success("Catch deleted successfully");
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete catch");
    }
  };

  const tableConfig: TableConfig<CatchItem> = {
    columns: [
      {
        key: "image",
        header: "Photo",
        render: (image) => (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
            <Image
              src={resolveMediaUrl(image) || "/images/catch-placeholder.png"}
              alt="Catch"
              fill
              className="object-cover"
            />
          </div>
        ),
      },
      {
        key: "lakeName",
        header: "Lake",
        render: (lakeName) => (
          <span className="font-semibold text-[#1F2937]">{lakeName}</span>
        ),
      },
      {
        key: "user",
        header: "User",
        render: (_, item) => (
          <span className="font-medium text-[#4B5563]">
            {item.user?.name || "Unknown"}
          </span>
        ),
      },
      {
        key: "species",
        header: "Species",
        render: (species) => (
          <span className="text-[#9CA3AF] font-medium">{species}</span>
        ),
      },
      {
        key: "caughtAt",
        header: "Date",
        render: (date) => (
          <span className="text-[#4B5563]">
            {new Date(date).toLocaleDateString()}
          </span>
        ),
        sortable: true,
      },
      {
        key: "status",
        header: "Status",
        render: (status) => (
          <Badge
            variant={
              status === "active"
                ? "success"
                : status === "pending"
                  ? "warning"
                  : "destructive"
            }
            className="capitalize px-3 py-1 text-[11px] font-semibold tracking-wide rounded-full"
          >
            {status === "active" ? "Approved" : status}
          </Badge>
        ),
      },
    ],
    showActions: true,
    actions: [
      {
        icon: <CheckCircle2 className="w-5 h-5 cursor-pointer" />,
        label: "Approve",
        tooltip: "Approve Photo",
        onClick: (item) => handleApprove(item),
        show: (item) => item.status !== "active",
        variant: "success",
      },
      {
        icon: <Trash2 className="w-5 h-5 cursor-pointer" />,
        label: "Delete",
        tooltip: "Delete Catch",
        onClick: (item) => handleDeleteClick(item),
        variant: "danger",
      },
    ],
    actionsAlign: "center",
    actionsWidth: "100px",
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <DashboardHeader
        title="Photo Moderation"
        description="Review and approve user-submitted photos."
      />

      <div className="px-6 md:px-8 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-sm">
            <p className="text-secondary text-sm font-medium mb-1">
              Total Photos
            </p>
            <p className="text-2xl font-bold text-foreground">
              {data?.statusCounts?.total || 0}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-sm border-l-4 border-l-emerald-500">
            <p className="text-secondary text-sm font-medium mb-1">Approved</p>
            <p className="text-2xl font-bold text-emerald-600">
              {data?.statusCounts?.active || 0}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-sm border-l-4 border-l-amber-500">
            <p className="text-secondary text-sm font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {data?.statusCounts?.pending || 0}
            </p>
          </div>
        </div>

        <div className="w-full bg-white p-4 rounded-2xl border border-primary/10">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-primary/10 mb-6 sticky top-0 z-20">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search by lake or species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-8 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11 appearance-none cursor-pointer text-foreground font-medium min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Approved</option>
                </select>
              </div>

              <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-border">
                <button
                  type="button"
                  aria-label="Table view"
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Card view"
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "card" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-50 rounded-2xl aspect-[4/5]"
                />
              ))}
            </div>
          ) : viewMode === "table" ? (
            <DynamicTable<CatchItem>
              data={data?.catches || []}
              config={tableConfig}
              loading={isLoading}
              pagination={{
                enabled: true,
                pageSize: 12,
                total: data?.pagination?.total || 0,
              }}
              currentPage={page}
              onPageChange={setPage}
              emptyMessage="No photos found."
              className="border-none shadow-none bg-white p-0"
              headerClassName="!bg-white !text-foreground font-semibold border-b border-gray-100"
              rowClassName="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {!data?.catches?.length ? (
                <div className="col-span-full py-20 text-center text-secondary">
                  No photos found matching your criteria.
                </div>
              ) : (
                data.catches.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={resolveMediaUrl(item.image) || "/images/catch-placeholder.png"}
                        alt={item.lakeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge
                          variant={
                            item.status === "active"
                              ? "success"
                              : item.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                          className="shadow-sm backdrop-blur-md"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.lakeName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-100">
                            {item.user?.avatar ? (
                              <Image
                                src={resolveMediaUrl(item.user.avatar) || "/images/avatar.png"}
                                alt="User"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <UserIcon className="w-4 h-4 m-1.5 text-secondary" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
                            {item.user?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(item.caughtAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="space-y-1 mt-auto">
                        <div className="text-xs text-secondary line-clamp-2 italic mb-3 min-h-[32px]">
                          &quot;{item.description || "No description provided."}
                          &quot;
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              item.status === "active"
                                ? "bg-white border-red-200 text-red-500 hover:bg-red-50"
                                : "bg-white border-primary/50 text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                          {item.status !== "active" && (
                            <button
                              onClick={() => handleApprove(item)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Catch Photo"
        description={`Are you sure you want to delete this catch photo from ${itemToDelete?.lakeName}? This action cannot be undone.`}
      />
    </div>
  );
}
