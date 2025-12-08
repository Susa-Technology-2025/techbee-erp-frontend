import { z } from "zod";

const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const htmlDateTimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const monthlyPayrollInputEmployeeRefSchema = z.object({
  id: z.string().min(1, "Employee ID is required."),
});

export const monthlyPayrollInputComponentRefSchema = z.object({
  id: z.string().min(1, "Component ID is required."),
});

export const monthlyPayrollInputSchema = z.object({
  id: z.string().optional(),

  employee: monthlyPayrollInputEmployeeRefSchema,

  component: monthlyPayrollInputComponentRefSchema,

  forMonth: z
    .string()
    .min(1, "For Month is required.")
    .refine(
      (val) => isoDateTimeRegex.test(val) || htmlDateTimeLocalRegex.test(val),
      {
        message:
          "For Month must be in YYYY-MM-DDTHH:mm:ss.SSSZ or YYYY-MM-DDTHH:mm format.",
      }
    ),

  amount: z
    .number()
    .min(0, "Amount must be a non-negative number.")
    .or(
      z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Amount must be a valid number.")
        .transform(Number)
    )
    .refine((val) => !isNaN(val), {
      message: "Amount must be a valid number.",
    }),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type MonthlyPayrollInput = z.infer<typeof monthlyPayrollInputSchema>;
