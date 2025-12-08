import { api, hr_base_url } from "../../../../lib/store/api";
import { ComplianceData } from "../types/dashboard";

export const complienceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getComplienceDashboard: build.query<ComplianceData, void>({
      query: () => ({
        url: `https://api.techbee.et/api/hr/compliances/dashboard`,
        method: "GET",
      }),
      providesTags: ["Complience"],
    }),
  }),
});

export const { useGetComplienceDashboardQuery } = complienceApi;
