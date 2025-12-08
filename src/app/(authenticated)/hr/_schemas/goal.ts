import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const goalSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  description: z.string().min(1, "Description is required."),
  dueDate: z
    .string()
    .regex(dateTimeRegex, "Due Date must be in YYYY-MM-DDTHH:mm format."),
  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),
  status: z
    .enum(["Pending", "InProgress", "Completed", "Cancelled"])
    .default("Pending"),
  title: z.string().min(1, "Title is required."),
  updatedAt: z.string().optional(),
});

export type Goal = z.infer<typeof goalSchema>;
