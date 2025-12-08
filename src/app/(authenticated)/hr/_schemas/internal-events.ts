import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const internalEventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  date: z
    .string()
    .regex(dateTimeRegex, "Date must be in YYYY-MM-DDTHH:mm format."),
  description: z.string().min(1, "Description is required."),
  location: z.string().min(1, "Location is required."),
  createdAt: z.string().optional(),
});

export type InternalEvent = z.infer<typeof internalEventSchema>;
