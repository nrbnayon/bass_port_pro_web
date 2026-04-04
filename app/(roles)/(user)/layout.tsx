import React from "react";
import Footer from "@/components/Layouts/Footer";
import Navbar from "@/components/Layouts/Navbar";

export default function CommonRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
