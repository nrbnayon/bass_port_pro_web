import React, { Suspense } from "react";
import Footer from "@/components/Layouts/Footer";
import Navbar from "@/components/Layouts/Navbar";

export default function CommonRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-primary w-full" />}>
        <Navbar />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
