import React from "react";
import DashboardWrapper from "@/components/Sidebar/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
