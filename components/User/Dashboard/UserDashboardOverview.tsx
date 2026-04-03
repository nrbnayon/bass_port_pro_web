"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Filter,
  MapPin,
  LayoutDashboard,
  ClipboardList,
  UserCog,
  Settings,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { StatsCard } from "@/components/Shared/StatsCard";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { useGetDashboardStatsQuery } from "@/redux/services/dashboardApi";
import { StatsSkeleton } from "@/components/Skeleton/StatsSkeleton";

// Mapping icons for stats
const iconMap: Record<string, any> = {
  Briefcase,
  Users,
  FileText,
  MapPin,
  TrendingUp,
};

// Original Section Cards from (user)/dashboard/page.tsx
const SECTION_CARDS = [
  {
    key: "dashboard",
    label: "Admin Dashboard",
    description: "View main statistics and overview.",
    href: "/admin/dashboard",
    atom: "view_dashboard",
    icon: LayoutDashboard,
    color: "#4640DE",
  },
  {
    key: "jobs",
    label: "Job Management",
    description: "Access and manage job records when granted.",
    href: "/admin/jobs",
    atom: "manage_jobs",
    icon: Briefcase,
    color: "#56CDAD",
  },
  {
    key: "applications",
    label: "Applications",
    description: "See submitted applications under your permissions.",
    href: "/admin/applications",
    atom: "view_applications",
    icon: FileText,
    color: "#26A4FF",
  },
  {
    key: "users",
    label: "User Management",
    description: "Manage users only when this atom is assigned.",
    href: "/admin/users",
    atom: "manage_users",
    icon: UserCog,
    color: "#FFB836",
  },
  {
    key: "leads",
    label: "Lead Pipeline",
    description: "Work with leads assigned to your access level.",
    href: "/admin/leads",
    atom: "view_leads",
    icon: Filter,
    color: "#FF6550",
  },
  {
    key: "tasks",
    label: "Team Tasks",
    description: "View and execute team tasks assigned to you.",
    href: "/admin/tasks",
    atom: "view_tasks",
    icon: ClipboardList,
    color: "#7C8493",
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    description: "Open reports and analytics if permitted.",
    href: "/admin/reports",
    atom: "view_reports",
    icon: TrendingUp,
    color: "#4640DE",
  },
  {
    key: "audit",
    label: "Audit Logs",
    description: "Track administrative activity and changes.",
    href: "/admin/audit-logs",
    atom: "view_audit_logs",
    icon: ShieldCheck,
    color: "#515B6F",
  },
  {
    key: "settings",
    label: "System Settings",
    description: "Configure system settings when allowed.",
    href: "/admin/settings",
    atom: "manage_settings",
    icon: Settings,
    color: "#25324B",
  },
];

export default function UserDashboardOverview() {
  const { name, permissions, hasPermission, isLoading } = useUser();
  const { data: statsData, isLoading: isLoadingStats } =
    useGetDashboardStatsQuery();

  const grantedSections = SECTION_CARDS.filter((item) =>
    hasPermission(item.atom),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#f8f9fc] dark:bg-[#0a0c10] overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[80px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Main Loading Logo / Spinner */}
          <div className="relative group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-t-2 border-r-2 border-primary shadow-[0_0_15px_rgba(70,64,222,0.3)]"
            />
            <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-primary/30" />
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-12 transition-transform group-hover:rotate-0">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Text Elements */}
          <div className="text-center space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-clash font-bold text-[#1F232A] dark:text-white tracking-tight"
            >
              Preparing Your Workspace
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(70,64,222,0.5)]"
                  />
                ))}
              </div>
              <p className="text-[#7C8493] dark:text-[#94A3B8] font-onest text-sm font-medium">
                Syncing permissions & context...
              </p>
            </motion.div>
          </div>

          {/* Glass Card Backdrop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute -inset-10 bg-white/40 dark:bg-card/20 backdrop-blur-xl rounded-[4rem] -z-10 shadow-2xl border border-white/20 dark:border-white/5"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-[#F5F6FA] dark:bg-background overflow-y-auto pb-10">
      <DashboardHeader
        title={`Welcome back, ${name || "Member"}`}
        description="Your dashboard is dynamically tailored to your current authorization level."
      />

      <main className="p-5 md:p-8 space-y-8">
        {/* Permission Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card border border-[#D6DDEB] rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                Authorization Status
              </p>
              <h2 className="text-xl font-clash font-bold text-[#25324B]">
                Active Permission Atoms
              </h2>
              <p className="text-sm text-[#7C8493] mt-1">
                These define the features and modules currently available to
                your account.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {permissions.map((atom) => (
                <div
                  key={atom}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-xs font-bold rounded-lg group hover:bg-primary/10 transition-colors"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  {atom}
                </div>
              ))}
              {!permissions.length && (
                <span className="text-sm text-[#7C8493] italic">
                  No active permissions found.
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dynamic Stats Grid (If they have view_dashboard permission) */}
        {hasPermission("view_dashboard") && (
          <div className="space-y-6">
            <h3 className="text-lg font-clash font-bold text-[#25324B]">
              Organizational Snapshot
            </h3>
            {isLoadingStats ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {statsData?.map((stat, i) => {
                  const IconComp = iconMap[stat.iconName] || Briefcase;
                  return (
                    <StatsCard
                      key={i}
                      title={stat.title}
                      value={stat.value}
                      icon={IconComp}
                      iconColor={stat.iconColor}
                      iconBgColor={stat.iconBgColor}
                      subtitle={stat.subtitle}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modules Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-clash font-bold text-[#25324B]">
              Available Modules
            </h3>
            <span className="text-xs font-semibold text-[#7C8493] px-2 py-1 bg-[#D6DDEB]/30 rounded-full">
              {grantedSections.length} Sections Granted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {grantedSections.length ? (
              grantedSections.map((section, idx) => (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={section.href}
                    className="group relative flex flex-col p-6 h-full bg-white dark:bg-card border border-[#D6DDEB] hover:border-primary rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Background Icon Pattern */}
                    <section.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-100 group-hover:text-primary/5 transition-colors duration-300 pointer-events-none" />

                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="p-3 rounded-xl transition-colors duration-300"
                        style={{ backgroundColor: `${section.color}15` }}
                      >
                        <section.icon
                          className="w-6 h-6"
                          style={{ color: section.color }}
                        />
                      </div>
                      <div className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-primary/10 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#25324B] group-hover:text-primary transition-colors">
                        {section.label}
                      </h4>
                      <p className="text-sm text-[#7C8493] mt-2 line-clamp-2">
                        {section.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#D6DDEB]/50">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wide">
                          Auth: {section.atom}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold text-xs">
                        Enter <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed border-[#D6DDEB] rounded-3xl">
                <div className="w-16 h-16 bg-[#F8F8FD] rounded-2xl flex items-center justify-center mb-4">
                  <UserCog className="w-8 h-8 text-[#7C8493]" />
                </div>
                <h4 className="text-lg font-semibold text-[#25324B]">
                  Access Restricted
                </h4>
                <p className="text-sm text-[#7C8493] mt-2 max-w-[300px]">
                  No administrative modules are currently assigned to your
                  account.
                </p>
                <button className="mt-6 text-primary font-bold text-sm hover:underline">
                  Contact System Administrator
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
