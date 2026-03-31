"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, FileText, X, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { useGetApplicationsQuery } from "@/redux/services/applicationApi";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { TablePagination } from "@/components/Shared/TablePagination";

const DEFAULT_PAGE_SIZE = 15;

function ApplicationDetailModal({
  app,
  onClose,
}: {
  app: any;
  onClose: () => void;
}) {
  const jobInfo =
    typeof app.jobId === "object"
      ? app.jobId
      : { title: "Job", company: "" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-[560px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-primary px-8 py-6">
          <h2 className="text-white font-semibold text-[20px]">Application Details</h2>
          <p className="text-white/70 text-[14px] mt-1">
            {jobInfo.title}
            {jobInfo.company ? ` @ ${jobInfo.company}` : ""}
          </p>
        </div>

        <div className="px-8 py-6 flex flex-col gap-5">
          {[
            { label: "Applicant Name", value: app.name },
            { label: "Email", value: app.email },
            { label: "Applied On", value: new Date(app.createdAt).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[12px] font-semibold text-[#7C8493] uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-[15px] text-[#25324B] font-medium">{value}</p>
            </div>
          ))}

          <div>
            <p className="text-[12px] font-semibold text-[#7C8493] uppercase tracking-wide mb-1">
              Resume
            </p>
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold text-[14px] hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> View Resume
            </a>
          </div>

          {app.portfolio && (
            <div>
              <p className="text-[12px] font-semibold text-[#7C8493] uppercase tracking-wide mb-1">
                Portfolio / LinkedIn
              </p>
              <a
                href={app.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold text-[14px] hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Open Link
              </a>
            </div>
          )}

          {app.coverNote && (
            <div>
              <p className="text-[12px] font-semibold text-[#7C8493] uppercase tracking-wide mb-1">
                Cover Note
              </p>
              <p className="text-[15px] text-[#515B6F] leading-relaxed whitespace-pre-wrap">
                {app.coverNote}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full border-2 border-[#D6DDEB] text-[#515B6F] font-semibold py-3 hover:border-primary hover:text-primary transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminApplicationsView() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const { data, isLoading, isError } = useGetApplicationsQuery({ page, limit: pageSize });

  const applications = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 0;

  useEffect(() => {
    if (!isLoading && totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [isLoading, page, totalPages]);

  // Client-side filter by name/email (since backend doesn't support search on applications)
  const filtered = search
    ? applications.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase())
      )
    : applications;

  return (
    <div className="flex flex-col flex-1 h-full bg-[#F5F6FA] dark:bg-background overflow-y-auto">
      <DashboardHeader 
        title="Applications" 
        description={`${total} total applications received`}
      />

      <main className="p-5 md:p-8 flex flex-col gap-6">
        {/* Search */}
        <div className="bg-white border border-[#D6DDEB] flex items-center gap-3 px-4 py-3 max-w-[380px]">
        <Search className="w-4 h-4 text-[#7C8493] shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email…"
          className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#25324B] placeholder:text-[#7C8493]/70"
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} className="text-[#7C8493] hover:text-[#25324B]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#D6DDEB] overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1.5fr_auto] gap-4 px-6 py-3 bg-[#F8F8FD] border-b border-[#D6DDEB]">
          {["Applicant", "Email", "Position", ""].map((col) => (
            <span key={col} className="text-[12px] font-semibold text-[#7C8493] uppercase tracking-wide">
              {col}
            </span>
          ))}
        </div>

        {isLoading ? (
          <TableSkeleton rowCount={8} />
        ) : isError ? (
          <div className="p-16 text-center">
            <p className="text-[#FF6550] font-semibold">Could not load applications</p>
            <p className="text-[#7C8493] text-[14px] mt-1">Ensure the backend is running</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-10 h-10 text-[#D6DDEB] mx-auto mb-3" />
            <p className="font-semibold text-[#25324B]">No applications found</p>
            <p className="text-[#7C8493] text-[14px]">Applications submitted through job listings will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F2F6]">
            {filtered.map((app, i) => {
              const jobInfo =
                typeof app.jobId === "object"
                  ? app.jobId
                  : { title: "—", company: "" };
              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedApp(app)}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_auto] gap-4 items-center px-6 py-4 hover:bg-[#F8F8FD] cursor-pointer group transition-colors"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-semibold text-[14px] text-primary">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[14px] text-[#25324B] truncate">
                      {app.name}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-[#7C8493] shrink-0" />
                    <span className="text-[14px] text-[#515B6F] truncate">{app.email}</span>
                  </div>

                  {/* Job */}
                  <div className="min-w-0">
                    <p className="font-semibold text-[14px] text-[#25324B] truncate">
                      {jobInfo.title}
                    </p>
                    {jobInfo.company && (
                      <p className="text-[12px] text-[#7C8493]">{jobInfo.company}</p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#7C8493]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#D6DDEB] group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="border-t border-[#D6DDEB]">
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={pageSize}
              onPageChange={(nextPage) => setPage(Math.min(Math.max(1, nextPage), totalPages))}
              showPageSize
              pageSizeOptions={[10, 15, 25, 50]}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
      </main>

      {selectedApp && (
        <ApplicationDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}
