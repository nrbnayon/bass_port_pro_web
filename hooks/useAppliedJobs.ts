import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "quickhire_applied_jobs";

/**
 * Persists applied job IDs in localStorage so guest users
 * can see which jobs they've already applied to across sessions.
 */
export function useAppliedJobs() {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  // Load persisted IDs on mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setAppliedIds(new Set(parsed));
      }
    } catch {
      // corrupt data — start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /** Returns true if the user has already applied to this job ID */
  const hasApplied = useCallback(
    (jobId: string) => appliedIds.has(jobId),
    [appliedIds]
  );

  /** Mark a job as applied and persist to localStorage */
  const markApplied = useCallback((jobId: string) => {
    setAppliedIds((prev) => {
      const next = new Set(prev);
      next.add(jobId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // storage quota exceeded or SSR — silently fail
      }
      return next;
    });
  }, []);

  /** Clear all applied job records (utility — useful for testing) */
  const clearAll = useCallback(() => {
    setAppliedIds(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { hasApplied, markApplied, clearAll, appliedIds };
}
