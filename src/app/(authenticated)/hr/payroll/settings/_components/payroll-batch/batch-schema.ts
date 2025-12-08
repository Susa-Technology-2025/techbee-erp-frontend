import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const batchSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  periodStart: z
    .string()
    .regex(dateTimeRegex, "Period Start must be in YYYY-MM-DDTHH:mm format."),
  periodEnd: z
    .string()
    .regex(dateTimeRegex, "Period End must be in YYYY-MM-DDTHH:mm format."),
  status: z.enum(["Draft", "Verified"], {
    errorMap: () => ({ message: "Status must be 'Draft' or 'Verified'." }),
  }),
  organizationNodeId: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Batch = z.infer<typeof batchSchema>; 