import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const onboardingTaskSchema = z.object({
  id: z.string().optional(),
  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),
  taskName: z.string().min(1, "Task Name is required."),
  dueDate: z
    .string()
    .regex(dateTimeRegex, "Due Date must be in YYYY-MM-DDTHH:mm format."),
  completed: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type OnboardingTask = z.infer<typeof onboardingTaskSchema>;
