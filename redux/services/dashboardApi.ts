import { apiSlice } from "./apiSlice";

export interface DashboardStat {
  title: string;
  value: string;
  subtitle: string;
  iconName: string;
  iconColor: string;
  iconBgColor: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStat[];
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStat[], void>({
      query: () => "/dashboard/stats",
      transformResponse: (response: DashboardResponse) => response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
