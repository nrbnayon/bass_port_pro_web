"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TablePagination } from "@/components/Shared/TablePagination";
import { useGetAuditLogsQuery, AuditLog } from "@/redux/services/auditApi";
import { TableColumn } from "@/types/table.types";
import Image from "next/image";

export default function AuditLogsClient() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useGetAuditLogsQuery({ page, limit });

  const columns: TableColumn<AuditLog>[] = [
    {
      key: "createdAt",
      header: "Time",
      render: (date: string) => (
        <span className="text-secondary opacity-80 text-sm">
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (action: string) => (
        <span className="font-semibold text-foreground bg-[#F0F2F5] px-3 py-1 rounded-full text-[11px] border border-black/5">
          {action}
        </span>
      ),
    },
    {
      key: "user",
      header: "Actor",
      render: (user: { name: string; avatar?: string; email: string }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold border border-black/10 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || "User Avatar"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0) || user?.email?.charAt(0) || "A"
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm tracking-tight leading-none">
              {user?.name || "Unknown"}
            </span>
            <span className="text-[10px] text-secondary opacity-60">
              {user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (target: { name: string; email?: string }, row: AuditLog) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium text-sm">
            {target?.name || target?.email || "-"}
          </span>
          {row.targetType && (
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest opacity-80 mt-0.5">
              {row.targetType}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader
        title="Audit Logs"
        description="Append-only activity trail for admin and manager operations."
      />

      <div className="p-5 flex flex-col gap-6 w-full mx-auto">
        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-none">
          <div className="overflow-hidden">
            <DynamicTable
              data={data?.data || []}
              config={{
                columns,
              }}
              loading={isLoading}
              pagination={{ enabled: false }}
              className="border-none shadow-none bg-white rounded-none p-0"
              headerClassName="!bg-white !text-gray-500 font-semibold border-b border-gray-50 text-[11px] uppercase tracking-wider"
              rowClassName="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
            />
          </div>

          {!isLoading && data?.pagination && data.pagination.total > 0 && (
            <div className="pt-8">
              <TablePagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                totalItems={data.pagination.total}
                itemsPerPage={limit}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
                showPageSize={true}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                className="border-t-0 p-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
