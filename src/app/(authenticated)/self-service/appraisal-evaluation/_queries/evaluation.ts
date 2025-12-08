// import { AttendanceCorrection } from './../_schema/attendanceCorrectionRequest';
// import { Attendance } from "@/app/(authenticated)/hr/_schemas/attendances";
// import { api, hr_base_url } from "@/lib/store/api";
// import { CreateAttendance } from "@/app/employee-portal/attendance/_schema/attendance";

// interface GetAttendancesParams {
//   skip?: number;
//   take?: number;
//   date?: string;
// }

// export const attendancesApi = api.injectEndpoints({
//   endpoints: (build) => ({

//     createAttendances: build.mutation<any, Partial<Attendance>>({
//       query: (body) => ({
//         url: hr_base_url + "/api/attendances",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Attendances"],
//     }),
//     createRequest: build.mutation<any, Partial<AttendanceCorrection>>({
//       query: (body) => ({
//         url: hr_base_url + "/api/attendances/correction/request",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["AttendanceCorrectionRequests"],
//     }),
//     getAttendancesByEmployeeId: build.query<any, string>({
//       query: (id) => hr_base_url + `/api/attendances?where[employee][id]=${id}`,
//       providesTags: (_result, _err, id) => [
//         { type: "Attendances", id },
//       ],
//     }),
//     updateAttendances: build.mutation<
//       Attendance,
//       { id: string; data: Partial<Attendance> }
//     >({
//       query: ({ id, data }) => ({
//         url: hr_base_url + `/api/attendances/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Attendances"],
//     }),
//     deleteAttendances: build.mutation<{ success: boolean }, string>({
//       query: (id) => ({
//         url: hr_base_url + `/api/attendances/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Attendances"],
//     }),
//   }),
// });

// export const {
// //   useGetAttendancesByIdQuery,
//   useCreateRequestMutation,
//   useCreateAttendancesMutation,
//   useUpdateAttendancesMutation,
//   useDeleteAttendancesMutation,
//   useGetAttendancesByEmployeeIdQuery,
//   useLazyGetAttendancesByEmployeeIdQuery
// } = attendancesApi;
