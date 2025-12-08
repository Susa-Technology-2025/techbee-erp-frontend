import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?$/;

export const salaryStructureSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "code is required."),

  basicSalary: z.number().min(0, "Basic Salary must be a non-negative number."),

  // bonuses: z
  //   .number()
  //   .min(0, "Bonuses must be a non-negative number.")
  //   .optional()
  //   .nullable(),

  // deductions: z
  //   .number()
  //   .min(0, "Deductions must be a non-negative number.")
  //   .optional()
  //   .nullable(),

  effectiveFrom: z
    .string()
    .regex(
      dateTimeRegex,
      "Effective From must be a valid date-time string (e.g., YYYY-MM-DDTHH:mm)."
    ),

  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),

  createdAt: z
    .string()
    .regex(dateTimeRegex, "Created At must be a valid date-time string.")
    .optional(),

  updatedAt: z
    .string()
    .regex(dateTimeRegex, "Updated At must be a valid date-time string.")
    .optional(),
});

export type SalaryStructure = z.infer<typeof salaryStructureSchema>;
