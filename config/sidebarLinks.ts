import type React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Bell,
  FileText,
  Flag,
  List,
  ListChecks,
  PieChart,
  ShieldCheck,
} from "lucide-react";
import {
  DashboardSquare02Icon,
  PackageAddIcon,
  Settings01Icon,
  UserMultiple03Icon,
} from "@hugeicons/core-free-icons";

export interface SidebarSubLink {
  label: string;
  href: string;
  permission?: string;
}

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ElementType | React.ReactElement | IconSvgElement;
  subLinks?: SidebarSubLink[];
  permission?: string;
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: DashboardSquare02Icon,
    permission: "view_dashboard", // Anyone with view_dashboard atom
  },

  {
    label: "Job Management",
    href: "/admin/jobs",
    icon: PackageAddIcon,
    permission: "manage_jobs",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserMultiple03Icon,
    permission: "manage_users",
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: FileText,
    permission: "view_applications",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: Flag,
    permission: "view_leads",
  },
  {
    label: "Tasks",
    href: "/admin/tasks",
    icon: ListChecks,
    permission: "view_tasks",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: PieChart,
    permission: "view_reports",
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: FileText,
    permission: "view_audit_logs",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: List,
    permission: "manage_categories",
  },

  {
    label: "Privacy & policy",
    href: "/admin/privacy-policy",
    icon: ShieldCheck,
    permission: "manage_settings",
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    permission: "view_notifications",
  },
  // {
  // 	label: "My Applications",
  // 	href: "/admin/applications",
  // 	icon: ListChecks,
  // 	// No permission required, visible to all users
  // },
  {
    label: "Support Center",
    href: "/admin/support",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings01Icon,
    permission: "customer",
  },
];
