import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const bankSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  isActive: z.boolean(),
});

export const bankAccountSchema = z.object({
  id: z.string(),
  accountNumber: z.string(),
  accountType: z.string(),
  isPrimary: z.boolean(),
  swiftCode: z.string().nullable(),
  bank: bankSchema,
  branch: z.string().nullable(),
});

export const employeeSchemaForPayslip = z.object({
  id: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  employeeCode: z.string().optional(),
});

export const payrollRunSchemaForPayslip = z.object({
  id: z.string().min(1),
  runDate: z.union([z.string().datetime(), z.null()]).optional(),
});

export const payslipSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  deductions: z.number(),
  grossPay: z.number(),
  netPay: z.number(),
  status: z.string().min(1),

  issueDate: z.union([z.string().datetime(), z.null()]).optional(),
  employee: employeeSchemaForPayslip,
  payrollRun: payrollRunSchemaForPayslip,
  bankAccount: bankAccountSchema.optional(),
});

export type Payslip = z.infer<typeof payslipSchema>;

export const payrollRunDetailSchema = z.object({
  id: z.string().min(1),
  runDate: z.string().datetime().min(1, "Run Date is required."),
});

export type PayrollRunDetail = z.infer<typeof payrollRunDetailSchema>;

export const employeeDetailSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1, "First Name is required."),
  lastName: z.string().min(1, "Last Name is required."),
  employeeCode: z.string().min(1, "Employee Code is required."),
});

export type EmployeeDetail = z.infer<typeof employeeDetailSchema>;