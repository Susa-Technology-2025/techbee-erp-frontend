import { api, hr_base_url } from "@/lib/store/api";
import { CreateAttendanceEvent } from "../_schema/attendanceEvent";

export const attendanceEventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // getAttendanceEvents: build.query<any[], { attendanceId?: string } | void>({
    //   query: (params = {}) => {
    //     const searchParams = new URLSearchParams();

    //     if (params.attendanceId) {
    //       searchParams.append("where[attendance][id]", params.attendanceId);
    //     }

    //     const queryString = searchParams.toString();
    //     const url =
    //       hr_base_url +
    //       "/api/attendanceEvents" +
    //       (queryString ? `?${queryString}` : "");

    //     return {
    //       url,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ["AttendanceEvents"],
    // }),

    getAttendanceEventById: build.query<any, string>({
      query: (id) => hr_base_url + `/api/attendanceEvents/${id}`,
      providesTags: (_result, _err, id) => [
        { type: "AttendanceEvents", id },
      ],
    }),
    createAttendanceEvent: build.mutation<
      CreateAttendanceEvent,
      Partial<CreateAttendanceEvent>
    >({
      query: (body) => ({
        url: hr_base_url + "/api/attendanceEvents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttendanceEvents"],
    }),

    updateAttendanceEvent: build.mutation<
      any,
      { id: string; data: Partial<CreateAttendanceEvent> }
    >({
      query: ({ id, data }) => ({
        url: hr_base_url + `/api/attendanceEvents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AttendanceEvents"],
    }),

    deleteAttendanceEvent: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: hr_base_url + `/api/attendanceEvents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AttendanceEvents"],
    }),
  }),
});

export const {
//   useGetAttendanceEventsQuery,
  useGetAttendanceEventByIdQuery,
  useCreateAttendanceEventMutation,
  useUpdateAttendanceEventMutation,
  useDeleteAttendanceEventMutation,
} = attendanceEventsApi;
