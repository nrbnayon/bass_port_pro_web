"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";

interface AuditLogItem {
  _id: string;
  action: string;
  createdAt: string;
  user?: { name?: string; email?: string };
  target?: { name?: string; email?: string };
}

export default function AuditLogsPage() {
  const { accessToken } = useUser();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/audit-logs?limit=25`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.message || "Failed to load audit logs");
        }

        const payload = await res.json();
        setLogs(payload?.data || []);
      } catch (err: unknown) {
        const message =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load audit logs";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [accessToken]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <p className="text-sm text-muted-foreground mt-2">Append-only activity trail for admin and manager operations.</p>

      {loading ? <div className="mt-6">Loading audit logs...</div> : null}
      {error ? <div className="mt-6 text-red-500">{error}</div> : null}

      {!loading && !error ? (
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Actor</th>
                <th className="text-left p-3">Target</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td className="p-3" colSpan={4}>No audit activity found.</td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-medium">{item.action}</td>
                    <td className="p-3">{item.user?.name || item.user?.email || "-"}</td>
                    <td className="p-3">{item.target?.name || item.target?.email || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
