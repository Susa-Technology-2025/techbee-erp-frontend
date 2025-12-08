import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const payrollrunSchema = z.object({
  id: z.string().optional(),
  periodEnd: z
    .string()
    .regex(
      dateTimeRegex,
      "Period End Date must be in YYYY-MM-DDTHH:mm format."
    ),
  periodStart: z
    .string()
    .regex(
      dateTimeRegex,
      "Period Start Date must be in YYYY-MM-DDTHH:mm format."
    ),
  runDate: z
    .string()
    .regex(dateTimeRegex, "Run Date must be in YYYY-MM-DDTHH:mm format."),
  status: z
    .enum(["Pending", "Processing", "Failed", "Completed"])
    .optional()
    .default("Pending"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Payrollrun = z.infer<typeof payrollrunSchema>;
