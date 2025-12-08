import { z } from "zod";

export const leaveTypeSchema = z.object({
  id: z.string().optional(),
  defaultAllocation: z
    .number()
    .min(0, "Default Allocation must be a non-negative number."),
  description: z.string().min(1, "Description is required."),
  isActive: z.boolean().default(true),
  isPaid: z.boolean().default(false),
  name: z.string().min(1, "Leave Type Name is required."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type LeaveType = z.infer<typeof leaveTypeSchema>;
