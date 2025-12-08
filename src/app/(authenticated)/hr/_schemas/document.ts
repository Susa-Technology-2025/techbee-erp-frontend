import { z } from "zod";

export const documentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  createdAt: z.string().datetime().optional(),
  employee: z.object({
    id: z.string().min(1, "Employee ID is required."),
  }),
  url: z.string().min(1, "URL is required."),
  updatedAt: z.string().datetime().optional(),
});

export type Document = z.infer<typeof documentSchema>;
