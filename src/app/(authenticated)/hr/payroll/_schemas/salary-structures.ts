import { z } from "zod";

export const salaryStructureSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  code: z.string().min(1, "Code is required."),
  description: z.string().min(1, "Description is required."),
  organizationNodeId: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type SalaryStructure = z.infer<typeof salaryStructureSchema>;
