import { z } from "zod";

export const structureSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  organizationNodeId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Structure = z.infer<typeof structureSchema>;