import { z } from "zod";

export const taxBracketSchema = z.object({
  id: z.string().optional(),
  deduction: z.number().min(0, "Deduction must be a non-negative number."),
  maxSalary: z.number().min(0, "Max Salary must be a non-negative number."),
  minSalary: z.number().min(0, "Min Salary must be a non-negative number."),
  rate: z
    .number()
    .min(0, "Rate must be a non-negative number.")
    .max(100, "Rate cannot exceed 100."),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type TaxBracket = z.infer<typeof taxBracketSchema>;
