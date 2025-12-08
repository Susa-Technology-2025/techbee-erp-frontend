import { AttendanceCorrection } from "../_schema/attendanceCorrectionRequest";
import { Attendance } from "@/app/(authenticated)/hr/_schemas/attendances";
import { api, hr_base_url } from "@/lib/store/api";
import { CreateAttendance } from "@/app/employee-portal/attendance/_schema/attendance";

interface GetAttendancesParams {
  skip?: number;
  take?: number;
  date?: string;
}

export const attendancesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // getAttendances: build.query<Attendance[], GetAttendancesParams | void>({
    //   query: (params = {}) => {
    //     const searchParams = new URLSearchParams();
    //     const queryParams = params as GetAttendancesParams;

    //     if (queryParams.skip !== undefined) {
    //       searchParams.append('skip', queryParams.skip.toString());
    //     }
    //     if (queryParams.take !== undefined) {
    //       searchParams.append('take', queryParams.take.toString());
    //     }
    //     if (queryParams.date) {
    //       searchParams.append('where[date]', queryParams.date);
    //     }

    //     const queryString = searchParams.toString();
    //     const url = hr_base_url + "/api/attendances" + (queryString ? `?${queryString}` : '');

    //     return {
    //       url,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ["Attendances"],
    // }),
    // getAttendancesById: build.query<Attendance, string>({
    //   query: (id) => `/api/attendances/${id}`,
    //   providesTags: (_result, _err, id) => [{ type: "Attendances", id }],
    // }),
    // getAttendancesByEmployeeId: build.query<Attendance, string>({
    //   query: (id) => hr_base_url + `/api/attendances?where[employee][id]=${id}`,
    //   providesTags: (_result, _err, id) => [{ type: "Attendances", id }],
    // }),
    createAttendances: build.mutation<any, Partial<Attendance>>({
      query: (body) => ({
        url: hr_base_url + "/api/attendances",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendances"],
    }),
    createRequest: build.mutation<any, Partial<AttendanceCorrection>>({
      query: (body) => ({
        url: hr_base_url + "/api/attendances/correction/request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttendanceCorrectionRequests"],
    }),
    getAttendancesByEmployeeId: build.query<any, string>({
      query: (id) => hr_base_url + `/api/attendances?where[employee][id]=${id}`,
      providesTags: (_result, _err, id) => [{ type: "Attendances", id }],
    }),
    updateAttendances: build.mutation<
      Attendance,
      { id: string; data: Partial<Attendance> }
    >({
      query: ({ id, data }) => ({
        url: hr_base_url + `/api/attendances/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Attendances"],
    }),
    deleteAttendances: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: hr_base_url + `/api/attendances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendances"],
    }),
  }),
});

export const {
  //   useGetAttendancesByIdQuery,
  useCreateRequestMutation,
  useCreateAttendancesMutation,
  useUpdateAttendancesMutation,
  useDeleteAttendancesMutation,
  useGetAttendancesByEmployeeIdQuery,
  useLazyGetAttendancesByEmployeeIdQuery,
} = attendancesApi;
