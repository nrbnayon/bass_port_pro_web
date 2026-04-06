import { Metadata } from "next";
import AuditLogsClient from "@/components/AuthProtected/Admin/AuditLogs/AuditLogsClient";

export const metadata: Metadata = {
  title: "Audit Logs | Bass Insight Admin",
  description: "View system audit logs and activity history.",
};

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
