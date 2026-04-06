/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  MapPin,
  Fish,
  LayoutGrid,
  List,
  Search,
  SquarePen,
} from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import {
  useGetLakesQuery,
  useDeleteLakeMutation,
  Lake,
} from "@/redux/services/lakesApi";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableConfig } from "@/types/table.types";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import LakeFormModal from "./LakeFormModal";
import { Badge } from "@/components/ui/badge";

export default function LakeManagementClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [lakeToDelete, setLakeToDelete] = useState<Lake | null>(null);

  const { data, isLoading, isError } = useGetLakesQuery({
    page,
    limit: 10,
    search: searchTerm,
  });

  const [deleteLake, { isLoading: isDeleting }] = useDeleteLakeMutation();

  const handleEdit = (lake: Lake) => {
    setSelectedLake(lake);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (lake: Lake) => {
    setLakeToDelete(lake);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!lakeToDelete) return;
    try {
      await deleteLake(lakeToDelete._id).unwrap();
      toast.success("Lake deleted successfully");
      setIsDeleteOpen(false);
      setLakeToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete lake");
    }
  };

  const tableConfig: TableConfig<Lake> = {
    columns: [
      {
        key: "name",
        header: "Lake Name",
        render: (name, lake) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border bg-gray-50 flex items-center justify-center">
              {lake.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lake.image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Fish className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{name}</span>
              <span className="text-xs text-secondary truncate max-w-[200px]">
                {lake.slug}
              </span>
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        key: "state",
        header: "Location",
        render: (state) => (
          <div className="flex items-center gap-1.5 text-secondary">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{state}</span>
          </div>
        ),
      },
      {
        key: "rating",
        header: "Rating",
        render: (rating) => (
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-foreground">
              {(rating || 0).toFixed(1)}
            </span>
          </div>
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
          >
            {status}
          </Badge>
        ),
      },
      {
        key: "reportCount",
        header: "Reports",
        render: (count) => (
          <span className="text-sm font-medium text-secondary">
            {count || 0}
          </span>
        ),
        sortable: true,
      },
    ],
    showActions: true,
    actions: [
      {
        icon: <SquarePen className="w-4 h-4 hover:text-blue cursor-pointer" />,
        label: "Edit",
        onClick: (lake) => handleEdit(lake),
        variant: "primary",
        tooltip: "Edit Lake Information",
      },
      {
        icon: <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer" />,
        label: "Delete",
        onClick: (lake) => handleDeleteClick(lake),
        variant: "danger",
        tooltip: "Delete Lake",
      },
    ],
    actionsAlign: "center",
    actionsWidth: "120px",
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <DashboardHeader
        title="Lake Management"
        description="Monitor, update, and manage all your fishing locations across the platform."
      />

      <div className="px-6 md:px-8 space-y-6">
        {/* Table / Grid Content */}
        <div className="w-full bg-white p-4 rounded-2xl  border border-primary/10">
          {/* Search and Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl  border border-primary/10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search by lake name, state, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-border">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedLake(null);
                  setIsFormOpen(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl h-11 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Add New Lake
              </button>
            </div>
          </div>

          <DynamicTable<Lake>
            data={data?.lakes || []}
            config={tableConfig}
            loading={isLoading}
            pagination={{
              enabled: true,
              pageSize: 10,
            }}
            onPageChange={setPage}
            emptyMessage={
              isError
                ? "Error loading lakes data"
                : "Start by adding your first fishing lake"
            }
            className="border-none shadow-none bg-white rounded-none p-0"
            headerClassName="!bg-white !text-foreground font-semibold border-b border-gray-100"
            rowClassName="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
            striped={false}
            hoverable={true}
          />
        </div>
      </div>

      {/* Modals */}
      <LakeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLake(null);
        }}
        lake={selectedLake}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setLakeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Lake"
        description={`Warning: You are about to permanently remove ${lakeToDelete?.name} and all its associated reports and data. This action is irreversible.`}
      />
    </div>
  );
}
