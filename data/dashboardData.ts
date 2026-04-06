import { DashboardData } from "@/types/dashboard.types";

export const dummyDashboardData: DashboardData = {
  stats: {
    totalUsers: {
      value: 1234,
      trend: 12.5,
    },
    totalLakes: {
      value: 568,
      trend: 8,
    },
    totalReports: {
      value: 90,
      trend: 45,
    },
    lakeRequests: {
      value: 123,
      trend: 55,
    },
  },
  userActivity: [
    { day: "Mon", users: 150 },
    { day: "Tue", users: 180 },
    { day: "Wed", users: 160 },
    { day: "Thu", users: 200 },
    { day: "Fri", users: 450 },
    { day: "Sat", users: 120 },
    { day: "Sun", users: 480 },
  ],
  reportsSubmitted: [
    { week: "Week-1", reports: 600 },
    { week: "Week-2", reports: 400 },
    { week: "Week-3", reports: 410 },
    { week: "Week-4", reports: 800 },
  ],
  recentActivity: [
    {
      id: "1",
      user: { name: "Sarah Johnson" },
      action: "Submitted report",
      lake: "Lake Guntersville",
      time: "2 hours ago",
    },
    {
      id: "2",
      user: { name: "Mike Chen" },
      action: "Uploaded Lake",
      lake: "Sam Rayburn Reservoir",
      time: "4 hours ago",
    },
    {
      id: "3",
      user: { name: "Emily Davis" },
      action: "Created account",
      lake: "Lake Chikamauga",
      time: "6 hours ago",
    },
    {
      id: "4",
      user: { name: "John Smith" },
      action: "Flagged content",
      lake: "Lake Fork",
      time: "8 hours ago",
    },
  ],
};
