"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Filter,
  Calendar,
  MapPin,
} from "lucide-react";
import { Job } from "@/data/jobsData";
import { StatsCard } from "@/components/Shared/StatsCard";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { useGetDashboardStatsQuery } from "@/redux/services/dashboardApi";
import { useGetJobsQuery } from "@/redux/services/jobApi";
import { StatsSkeleton } from "@/components/Skeleton/StatsSkeleton";

const COLORS = [
  "#4640DE",
  "#56CDAD",
  "#26A4FF",
  "#FFB836",
  "#FF6550",
  "#7C8493",
];

// Helper to map string icon names from API back to Lucide components
const iconMap: Record<string, any> = {
  Briefcase: Briefcase,
  Users: Users,
  FileText: FileText,
  MapPin: MapPin,
  TrendingUp: TrendingUp,
};

export default function DashboardOverview() {
  const { data: statsData, isLoading: isLoadingStats } =
    useGetDashboardStatsQuery();
  const { data: jobsResp, isLoading: isLoadingJobs } = useGetJobsQuery();

  const jobs: Job[] = jobsResp?.data || [];

  // 1. Calculate Graph Data
  const totalJobs = jobs.length;

  // 2. Job Statistics by Category (for Pie Chart)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      counts[job.category] = (counts[job.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  // 3. Postings per day/month (for Area Chart)
  const trendData = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    jobs.forEach((job) => {
      const date = new Date(job.postedAt || new Date()).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" },
      );
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    return Object.entries(dailyCounts)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([name, count]) => ({ name, count }));
  }, [jobs]);

  // 4. Job Types (for Bar Chart)
  const typeData = useMemo(() => {
    const types: Record<string, number> = {};
    jobs.forEach((job) => {
      types[job.type] = (types[job.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  return (
    <div className="flex flex-col flex-1 h-full bg-[#F5F6FA] dark:bg-background overflow-y-auto">
      <DashboardHeader
        title="Admin Dashboard"
        description="Welcome back! Here's a summary of Obliq's performance."
      />

      <main className="p-5 md:p-8 space-y-8">
        {/* Stats Grid */}
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-white via-[#FAFBFF] to-[#F5F6FA] dark:from-card dark:via-card dark:to-card border border-[#D6DDEB]/60 rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Decorative gradient background */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary to-[#56CDAD] rounded-full opacity-5 blur-3xl" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-clash font-bold text-[22px] bg-gradient-to-r from-[#25324B] to-primary bg-clip-text text-transparent">
                    Job Posting Volume
                  </h3>
                  <span className="px-2.5 py-1 bg-gradient-to-r from-primary/10 to-[#56CDAD]/10 text-[11px] font-semibold text-primary rounded-full uppercase tracking-wide">
                    Live
                  </span>
                </div>
                <p className="text-xs text-[#7C8493] font-medium">
                  Real-time trajectory of new job listings across all
                  departments
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4 hidden">
                <button className="p-3 bg-gradient-to-br from-primary/10 to-[#56CDAD]/10 border border-primary/20 rounded-xl hover:from-primary/15 hover:to-[#56CDAD]/15 transition-all duration-200 hover:shadow-md hover:scale-105">
                  <Calendar className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            <div className="h-[320px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#4640DE"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="50%"
                        stopColor="#56CDAD"
                        stopOpacity={0.08}
                      />
                      <stop offset="95%" stopColor="#4640DE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#E5E7EB"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#7C8493", fontWeight: 500 }}
                    dy={12}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#7C8493", fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "2px solid #4640DE",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 20px 60px rgba(70, 64, 222, 0.2)",
                      padding: "12px 16px",
                    }}
                    itemStyle={{
                      color: "#4640DE",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                    labelStyle={{
                      color: "#25324B",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="count"
                    stroke="#4640DE"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom stats pill */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/5 to-[#56CDAD]/5 border border-primary/10 rounded-xl relative z-10">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-[#25324B]">
                  Trend:
                </span>
              </div>
              <span className="text-xs font-bold text-primary">
                {trendData.length > 1
                  ? trendData[trendData.length - 1]?.count > trendData[0]?.count
                    ? "↑ Increasing"
                    : "↓ Decreasing"
                  : "—"}
              </span>
            </div>
          </motion.div>

          {/* Category Distribution (Pie) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-card border border-[#D6DDEB] rounded-2xl p-7 shadow-sm flex flex-col gap-6"
          >
            <div>
              <h3 className="font-clash font-semibold text-[18px] text-[#25324B]">
                Department Shares
              </h3>
              <p className="text-xs text-[#7C8493]">
                Breakdown of jobs by category
              </p>
            </div>

            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={4}
                    startAngle={-90}
                    cornerRadius={4}
                    endAngle={270}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="block text-[24px] font-semibold text-[#25324B]">
                  {totalJobs}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#7C8493]">
                  Jobs
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              {categoryData.slice(0, 3).map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="text-[#515B6F] font-medium">
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-semibold text-[#25324B]">
                    {Math.round((cat.value / totalJobs) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Types Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-card border border-[#D6DDEB] rounded-2xl p-7 shadow-sm"
          >
            <h3 className="font-clash font-semibold text-[18px] text-[#25324B] mb-6">
              Employment Types
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F5F6FA"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#56CDAD"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity / Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-card border border-[#D6DDEB] rounded-2xl p-7 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-clash font-semibold text-[18px] text-[#25324B]">
                Quick Insights
              </h3>
              <span className="px-3 py-1 bg-[#4640DE10] text-primary text-[10px] font-semibold rounded-lg uppercase">
                Real-Time
              </span>
            </div>

            <div className="space-y-6">
              {[
                {
                  label: "Talent Search",
                  value: "84 Candidates online",
                  desc: "Searching for technology roles",
                  icon: Users,
                  color: "#4640DE",
                },
                {
                  label: "Application Velocity",
                  value: "Low (Avg 2.5 per job)",
                  desc: "Requires more featured listings",
                  icon: TrendingUp,
                  color: "#FF6550",
                },
                {
                  label: "Category Leading",
                  value: "Marketing",
                  desc: "Highest click-through rate",
                  icon: Filter,
                  color: "#56CDAD",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-transparent hover:border-[#D6DDEB] hover:bg-[#F8F8FD] transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[14px] text-[#25324B] mb-0.5">
                      {item.label}
                    </h4>
                    <p className="text-[14px] font-semibold text-primary">
                      {item.value}
                    </p>
                    <p className="text-[12px] text-[#7C8493]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
