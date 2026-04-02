import React from "react";
import Footer from "@/components/Layouts/Footer";
import Navbar from "@/components/Layouts/Navbar";

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
