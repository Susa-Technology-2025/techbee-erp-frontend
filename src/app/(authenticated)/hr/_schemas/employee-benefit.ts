import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const employeeBenefitSchema = z.object({
  id: z.string().optional(),
  benefitPlan: z.object({ id: z.string().min(1, "Benefit Plan is required.") }),
  employee: z.object({ id: z.string().min(1, "Employee is required.") }),
  coverageAmount: z
    .number()
    .min(0, "Coverage Amount must be a positive number."),
  enrollmentDate: z
    .string()
    .regex(
      dateTimeRegex,
      "Enrollment Date must be in YYYY-MM-DDTHH:mm format."
    ),
  notes: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type EmployeeBenefit = z.infer<typeof employeeBenefitSchema>;
