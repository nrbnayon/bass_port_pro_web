import React from "react";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default async function PublicLayoutView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8FD] flex flex-col w-full overflow-x-hidden">
      <PublicNavbar />
      {/* pt-[76px] to offset fixed navbar height */}
      <main className="flex-1 w-full pt-[76px]">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
