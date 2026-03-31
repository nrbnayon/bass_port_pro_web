import { apiSlice } from "./apiSlice";
import { Job } from "@/data/jobsData";

export interface PaginationData {
  current: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsResponse {
  success: boolean;
  count: number;
  pagination: PaginationData;
  data: Job[];
}

export const jobApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, Record<string, any> | void>({
      query: (params) => {
        if (!params) return "/jobs";
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });
        const qString = queryParams.toString();
        return `/jobs${qString ? `?${qString}` : ""}`;
      },
      providesTags: ["Job"],
    }),
    getJob: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (job) => ({
        url: "/jobs",
        method: "POST",
        body: job,
      }),
      invalidatesTags: ["Job", "Dashboard"],
    }),
    updateJob: builder.mutation<Job, { id: string; data: Partial<Job> }>({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Job", "Dashboard"],
    }),
    deleteJob: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job", "Dashboard"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
