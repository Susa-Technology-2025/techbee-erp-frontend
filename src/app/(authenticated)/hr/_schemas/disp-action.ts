import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const disciplinaryActionSchema = z.object({
  id: z.string().optional(),
  employee: z.object({
    id: z.string().min(1, "Employee is required."),
  }),
  action: z.string().min(1, "Action is required."),
  reason: z.string().min(1, "Reason is required."),
  date: z
    .string()
    .regex(dateTimeRegex, "Date must be in YYYY-MM-DDTHH:mm format."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type DisciplinaryAction = z.infer<typeof disciplinaryActionSchema>;
