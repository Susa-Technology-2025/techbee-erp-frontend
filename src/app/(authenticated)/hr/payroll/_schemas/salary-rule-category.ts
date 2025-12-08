import { z } from "zod";

export const salaryRuleCategorySchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required."),
  name: z.string().min(1, "Name is required."),
  description: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type SalaryRuleCategory = z.infer<typeof salaryRuleCategorySchema>;
