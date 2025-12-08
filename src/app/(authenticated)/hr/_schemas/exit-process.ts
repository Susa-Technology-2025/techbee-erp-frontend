import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const exitProcessSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),
  exitDate: z
    .string()
    .regex(dateTimeRegex, "Exit Date must be in YYYY-MM-DDTHH:mm format."),
  reason: z.string().min(1, "Reason is required."),
  remarks: z.string().optional().or(z.literal("")),
});

export type ExitProcess = z.infer<typeof exitProcessSchema>;
