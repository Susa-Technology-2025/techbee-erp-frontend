import { z } from "zod";

export const structureRuleSchema = z.object({
  id: z.string().optional(),
  salaryStructure: z.object({
    id: z.string().min(1, "Salary Structure ID is required."),
  }),
  salaryRule: z.object({
    id: z.string().min(1, "Salary Rule ID is required."),
  }),
  sequence: z.number().int().min(0, "Sequence must be a non-negative integer."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type StructureRule = z.infer<typeof structureRuleSchema>; 