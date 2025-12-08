import { z } from "zod";

export const timeOffTypeSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required."),
  description: z.string().min(1, "Description is required."),
  externalCode: z.string().optional().or(z.literal("")),
  isPaid: z.boolean().default(false),
  name: z.string().min(1, "Name is required."),
  organizationNodeId: z.string().min(1, "Organization Node is required."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type TimeOffType = z.infer<typeof timeOffTypeSchema>;
