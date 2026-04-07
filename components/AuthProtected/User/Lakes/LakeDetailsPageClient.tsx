"use client";

import { useEffect } from "react";
import CTASection from "@/components/Landing/CTASection";
import LakeDetailsHero from "./LakeDetailsHero";
import LakeDetailsWrapper from "./LakeDetailsWrapper";
import { useGetLakeByIdQuery } from "@/redux/services/lakesApi";
import { getFallbackLakeByIdOrSlug, mapApiLakeToView } from "@/lib/lakeMappers";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

interface LakeDetailsPageClientProps {
  id: string;
}

export default function LakeDetailsPageClient({
  id,
}: LakeDetailsPageClientProps) {
  const { isLoading: isAuthLoading } = useUser();
  const { data, isLoading, isError, refetch } = useGetLakeByIdQuery(id);

  const lake = data?.lake
    ? mapApiLakeToView(data.lake)
    : getFallbackLakeByIdOrSlug(id);

  useEffect(() => {
    if (!isAuthLoading) {
      refetch();
    }
  }, [isAuthLoading, refetch]);

  if (isLoading && !lake) {
    return (
      <div className="min-h-screen bg-white pt-32 px-4">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-10 w-1/2 rounded-xl bg-gray-100" />
          <div className="h-80 w-full rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!lake) {
    return (
      <div className="min-h-screen bg-white pt-40 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Lake not found</h1>
        <p className="mt-2 text-secondary">
          This lake could not be loaded from API or fallback data.
        </p>
        <Link
          href="/lakes"
          className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
        >
          Back to lakes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-white">
      {isError && (
        <p className="px-4 py-2 text-center text-xs font-semibold text-amber-600">
          API unavailable. Showing fallback lake data.
        </p>
      )}
      <LakeDetailsHero lake={lake} onFavouriteChanged={refetch} />
      <div className="p-5">
        <LakeDetailsWrapper
          lake={lake}
          lakeId={data?.lake?._id || ""}
          onDataChanged={refetch}
        />
      </div>
      <CTASection />
    </div>
  );
}
