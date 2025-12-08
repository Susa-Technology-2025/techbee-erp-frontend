import { z } from "zod";

// YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Full ISO 8601 datetime with optional milliseconds + Z
const dateTimeRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?Z)?$/;

export const attendanceCorrectionSchema = z.object({
  attendanceId: z.string().min(1, "Attendance ID is required."),
  employeeId: z.string().min(1, "Employee ID is required."),
  reason: z.string().min(5, "Reason must be at least 5 characters long."),

  correctedCheckIn: z
    .string()
    .regex(dateTimeRegex, "Corrected Check-In must be a valid ISO datetime.")
    .optional(),

  correctedCheckOut: z
    .string()
    .regex(dateTimeRegex, "Corrected Check-Out must be a valid ISO datetime.")
    .optional(),

  ops: z
    .array(
      z.object({
        op: z.enum(["add", "remove", "update"]),
        kind: z.enum(["CheckIn", "CheckOut", "BreakStart", "BreakEnd"]),
        oldAt: z
          .string()
          .regex(dateTimeRegex, "OldAt must be a valid ISO datetime.")
          .optional(),
        newAt: z
          .string()
          .regex(dateTimeRegex, "NewAt must be a valid ISO datetime.")
          .optional(),
      })
    )
    .optional(),
});

export type AttendanceCorrection = z.infer<typeof attendanceCorrectionSchema>;
