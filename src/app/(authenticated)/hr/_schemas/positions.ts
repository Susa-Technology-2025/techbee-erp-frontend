import { z } from "zod";

export const positionSchema = z.object({
  id: z.string().optional(),
  departmentId: z.string().optional(),
  description: z.string().min(1, "Description is required."),
  code: z.string().min(1, "code is required."),
  isActive: z.boolean().default(true),
  level: z.string().min(1, "Level is required."),
  title: z.string().min(1, "Title is required."),
});

export type Position = z.infer<typeof positionSchema>;
