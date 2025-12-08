import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const contractSchema = z.object({
  id: z.string().optional(),
  baseSalary: z.number({ message: "Base salary is required" }),
  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),
  endDate: z
    .string()
    .regex(dateTimeRegex, "End Date must be in YYYY-MM-DDTHH:mm format."),
  salaryStructure: z.object({
    id: z.string().min(1, "Salary Structure ID is required."),
  }),
  startDate: z
    .string()
    .regex(dateTimeRegex, "Start Date must be in YYYY-MM-DDTHH:mm format."),
  terms: z.string().min(1, "Terms are required."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Contract = z.infer<typeof contractSchema>;
