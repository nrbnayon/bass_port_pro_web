"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ForbiddenContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const atom = searchParams.get("atom");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-100">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 animate-pulse">
            <ShieldAlert size={40} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-gray-500">
            You do not have the necessary permissions to access this page.
          </p>
        </div>

        {atom && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-xs font-mono text-red-600 uppercase tracking-widest font-bold mb-1">
              Missing Permission Atom
            </p>
            <p className="text-sm font-semibold text-red-800">{atom}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 h-12 rounded-xl"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 h-12 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Home size={18} />
            Home
          </Button>
        </div>

        <p className="text-xs text-gray-400">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default function ForbiddenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ForbiddenContent />
    </Suspense>
  );
}
