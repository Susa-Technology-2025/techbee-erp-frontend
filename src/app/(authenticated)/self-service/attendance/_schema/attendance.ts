import { z } from "zod";

// YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// YYYY-MM-DDTHH:mm:ss.sssZ  (full ISO string with timezone Z)
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3}Z)?)?$/;

export const attendanceSchema = z.object({
  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),

  date: z
    .string()
    .regex(dateRegex, "Date must be in YYYY-MM-DD format."),

  checkIn: z
    .string()
    .regex(dateTimeRegex, "Check In must be a valid ISO datetime."),

});

export type CreateAttendance = z.infer<typeof attendanceSchema>;
