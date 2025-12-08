import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const salaryComponentReferenceSchema = z.object({
  id: z.string().min(1, "Salary Component ID is required."),
});

export const employeeReferenceSchema = z.object({
  id: z.string().min(1, "Employee ID is required."),
});

export const salaryStructureSchema = z.object({
  id: z.string().optional(),
  employee: employeeReferenceSchema,
  basicSalary: z.number().min(0, "Basic Salary must be a positive number."),
  bonuses: z.number().min(0, "Bonuses must be a positive number.").optional(),
  deductions: z
    .number()
    .min(0, "Deductions must be a positive number.")
    .optional(),
  effectiveFrom: z
    .string()
    .regex(dateTimeRegex, "Effective From must be in YYYY-MM-DDTHH:mm format."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const salaryStructureReferenceSchema = z.object({
  id: z.string().min(1, "Salary Structure ID is required."),
});

export const salaryStructureComponentSchema = z.object({
  id: z.string().optional(),
  salaryStructure: salaryStructureReferenceSchema,
  salaryComponent: salaryComponentReferenceSchema,
  amount: z.number().min(0, "Amount must be a positive number."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type SalaryStructureComponent = z.infer<
  typeof salaryStructureComponentSchema
>;
export type SalaryStructure = z.infer<typeof salaryStructureSchema>;
export type SalaryComponentReference = z.infer<
  typeof salaryComponentReferenceSchema
>;
export type EmployeeReference = z.infer<typeof employeeReferenceSchema>;
