import { apiSlice } from "./apiSlice";

export interface ApplicationPayload {
  jobId: string;
  name: string;
  email: string;
  resumeUrl: string;
  coverNote?: string;
  portfolio?: string;
}

export interface Application {
  _id: string;
  jobId: string | { title: string; company: string };
  name: string;
  email: string;
  resumeUrl: string;
  coverNote?: string;
  portfolio?: string;
  createdAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  pagination: {
    current: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Application[];
}

export const applicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitApplication: builder.mutation<
      { success: boolean; message: string; data: Application },
      ApplicationPayload
    >({
      query: (body) => ({
        url: "/applications",
        method: "POST",
        body,
      }),
      // Refresh dashboard stats (total applications count) after new submission
      invalidatesTags: ["Dashboard"],
    }),
    getApplications: builder.query<
      ApplicationsResponse,
      { jobId?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (!params) return "/applications";
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, String(value));
        });
        const qs = queryParams.toString();
        return `/applications${qs ? `?${qs}` : ""}`;
      },
    }),
  }),
});

export const { useSubmitApplicationMutation, useGetApplicationsQuery } =
  applicationApi;
