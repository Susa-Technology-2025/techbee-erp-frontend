import { z } from "zod";

export const employeesurveySchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  description: z.string().min(1, "Description is required."),
  isActive: z.boolean().default(true),
  questions: z.record(z.string(), z.string()).optional(),
  title: z.string().min(1, "Title is required."),
  updatedAt: z.string().datetime().optional(),
});

export type EmployeeSurvey = z.infer<typeof employeesurveySchema>;
