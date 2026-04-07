/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { useGetAnalyticsQuery } from "@/redux/services/analyticsApi";
import { ChartSkeleton } from "@/components/Skeleton/ChartSkeleton";

const timeRanges = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const AnalyticsClient = () => {
  const [range, setRange] = useState(30);
  const { data, isLoading, isError } = useGetAnalyticsQuery(range);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF]">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium text-lg">
            Failed to load analytics data
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    userActivity = [],
    lakePopularity = [],
    engagementBreakdown = [],
  } = data || {};

  // Custom label renderer for the Pie chart to match image labels
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    color,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + outerRadius;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-[13px] font-bold"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col pb-10">
      {/* Header section with Range filters aligned to the right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pt-6">
        <div className="pb-0">
          <DashboardHeader
            title="Analytics"
            description="Platform Performance and engagement metrics"
          />
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0 p-1 bg-white rounded-2xl border border-primary/5 shadow-sm">
          {timeRanges.map((tr) => (
            <button
              key={tr.value}
              onClick={() => setRange(tr.value)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                range === tr.value
                  ? "bg-[#FB923C] text-white shadow-lg shadow-orange-500/20"
                  : "text-secondary hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* User Activity Chart */}
          <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm space-y-8">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-foreground">
                User Activity
              </h3>
              <p className="text-sm text-secondary font-medium mt-1">
                Total users per month
              </p>
            </div>
            <div className="h-[350px] w-full">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userActivity}
                    margin={{ top: 0, right: 30, left: -20, bottom: 10 }}
                  >
                    <defs>
                      <filter id="shadow" height="200%">
                        <feGaussianBlur
                          in="SourceAlpha"
                          stdDeviation="3"
                          result="blur"
                        />
                        <feOffset in="blur" dx="0" dy="4" result="offsetBlur" />
                        <feMerge>
                          <feMergeNode in="offsetBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FB923C"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FB923C"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#4B5563", fontSize: 13, fontWeight: 500 }}
                      dy={15}
                      interval="preserveStartEnd"
                      minTickGap={30}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#4B5563", fontSize: 13, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#FB923C"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      filter="url(#shadow)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Lake Popularity Chart */}
          <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm space-y-8">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-foreground">
                Lake Popularity
              </h3>
              <p className="text-sm text-secondary font-medium mt-1">
                Most visited lakes
              </p>
            </div>
            <div className="h-[350px] w-full border-b border-l border-gray-50 border-dotted">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={lakePopularity}
                    margin={{ top: 0, right: 10, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#4B5563", fontSize: 11, fontWeight: 500 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#4B5563", fontSize: 13, fontWeight: 500 }}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="visits"
                      fill="#FB923C"
                      radius={[10, 10, 0, 0]}
                      barSize={40}
                      animationDuration={2000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm max-w-full lg:max-w-[100%] overflow-hidden">
          <div className="flex flex-col mb-10">
            <h3 className="text-xl font-bold text-foreground">
              Engagement Breakdown
            </h3>
            <p className="text-sm text-secondary font-medium mt-1">
              Content types by engagement
            </p>
          </div>

          <div className="h-[450px] w-full flex items-center justify-center">
            {isLoading ? (
              <div className="w-64 h-64 rounded-full animate-pulse bg-gray-50" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementBreakdown}
                    innerRadius={0}
                    outerRadius={140}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {engagementBreakdown.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsClient;
