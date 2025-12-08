import { RecruitmentData } from './../_types/recruitment-data';
import { api } from "@/lib/store/api";
import { hr_base_url } from '@/lib/store/api';

export const RecruitmentDataApi = api.injectEndpoints({
  endpoints: (build) => ({
    getApplicationDashboard: build.query<RecruitmentData, { from: string; to: string }>({
      query: ({ from, to }) => ({
        url: `${hr_base_url}/api/applications/dashboard?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        method: "GET",
      }),
      providesTags: ["RecruitmentApplication"],
    }),
  }),
});

export const {
  useGetApplicationDashboardQuery,
} = RecruitmentDataApi;
