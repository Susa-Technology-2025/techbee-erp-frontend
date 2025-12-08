import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const pensionPolicySchema = z.object({
  id: z.string().optional(),
  effectiveFrom: z
    .string()
    .regex(
      dateTimeRegex,
      "Effective From Date must be in YYYY-MM-DDTHH:mm format."
    ),
  employeeRate: z
    .number()
    .min(0, "Employee Rate must be a non-negative number.")
    .max(100, "Employee Rate cannot exceed 100."),
  employerRate: z
    .number()
    .min(0, "Employer Rate must be a non-negative number.")
    .max(100, "Employer Rate cannot exceed 100."),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type PensionPolicy = z.infer<typeof pensionPolicySchema>;
