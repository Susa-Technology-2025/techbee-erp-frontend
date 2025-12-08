import { z } from "zod";

// YYYY-MM-DDTHH:mm:ss.sssZ (full ISO string with timezone Z)
const dateTimeRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3}Z)?)?$/;

export const attendanceEventSchema = z.object({
  attendance: z.object({
    id: z.string().min(1, "Attendance ID is required."),
  }),

  kind: z.enum(["BreakStart", "BreakEnd", "CheckIn", "CheckOut"], {
    required_error: "Event kind is required.",
  }),

  happenedAt: z
    .string()
    .regex(dateTimeRegex, "happenedAt must be a valid ISO datetime."),

  method: z.enum(["Manual", "System"], {
    required_error: "Method is required.",
  }),

  note: z.string().optional(),
});

export type CreateAttendanceEvent = z.infer<typeof attendanceEventSchema>;
