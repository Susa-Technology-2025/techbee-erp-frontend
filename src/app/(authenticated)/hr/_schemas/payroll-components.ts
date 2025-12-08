import { z } from "zod";

export const PayrollComponentTypeEnum = z.enum([
  "Allowance",
  "Deduction",
  "Bonus",
  "Reimbursement",
  "Benefit",
]);

export const payrollComponentSchema = z.object({
  id: z.string().optional(),
  amount: z.number().min(0, "Amount must be a non-negative number."),
  description: z.string().min(1, "Description is required."),
  name: z.string().min(1, "Name is required."),
  typeField: PayrollComponentTypeEnum,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type PayrollComponent = z.infer<typeof payrollComponentSchema>;
