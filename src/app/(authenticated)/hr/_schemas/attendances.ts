import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const CheckInOutDate =  /^\d{4}-\d{2}-\d{2}$/;

export const attendanceSchema = z.object({
  id: z.string().optional(),

  employee: z.object({ id: z.string().min(1, "Employee is required.") }),

  date: z
    .string()
    .regex(CheckInOutDate, "Date must be in YYYY-MM-DD"),

  checkIn: z
    .string()
    .regex(dateTimeRegex, "Check In must be in YYYY-MM-DDTHH:mm format."),

  checkOut: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "Check Out must be in YYYY-MM-DDTHH:mm format.",
    }),

  status: z.string().min(1, "Status is required."),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Attendance = z.infer<typeof attendanceSchema>;
