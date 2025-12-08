import { z } from "zod";

export const shiftSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Shift name is required."),
  code: z.string().min(1, "Shift code is required."),
  startTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Start time must be in HH:MM format (e.g., 08:00)."
    ),
  endTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "End time must be in HH:MM format (e.g., 16:00)."
    ),
  isDefault: z.boolean().default(false),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type Shift = z.infer<typeof shiftSchema>;
