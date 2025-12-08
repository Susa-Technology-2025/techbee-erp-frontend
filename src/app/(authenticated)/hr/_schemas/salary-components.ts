import { z } from "zod";

export const salaryComponentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  amount: z.number().optional().nullable(),
  description: z.string().optional().or(z.literal("")),
  typeField: z.enum(
    [
      "Allowance",
      "Deduction",
      "Bonus",
      // "Tax", "Pension",
      "Basic",
      "Other",
      "Incentive",
      "Commission",
      "Severance",
      "LeaveEncashment",
      "Overtime",
      "InKindBenefit",
    ],
    {
      errorMap: () => ({
        message:
          "Invalid type. Must be one of Allowance, Deduction, Bonus, Tax, Pension, Basic, Other.",
      }),
    }
  ),
  isRecurring: z.boolean().default(false),
  isTaxable: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type SalaryComponent = z.infer<typeof salaryComponentSchema>;
