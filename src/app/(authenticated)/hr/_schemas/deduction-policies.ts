import { z } from "zod";

export const deductionPolicySchema = z.object({
  id: z.string().optional(),
  fixedAmount: z.number().min(0, "Fixed Amount must be a non-negative number."),
  isActive: z.boolean().default(true),
  name: z.string().min(1, "Name is required."),
  rate: z
    .number()
    .min(0, "Rate must be a non-negative number.")
    .max(100, "Rate cannot exceed 100."),
  typeField: z.enum(["Loan", "UnionFee", "Saving", "Insurance"], {
    errorMap: () => ({ message: "Please select a valid type." }),
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type DeductionPolicy = z.infer<typeof deductionPolicySchema>;
