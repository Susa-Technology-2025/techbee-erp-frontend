import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const trainingRecordSchema = z.object({
  id: z.string().optional(),
  certificate: z
    .string()
    .url("Invalid URL format.")
    .min(1, "Certificate URL is required."),
  completionDate: z
    .string()
    .regex(
      dateTimeRegex,
      "Completion Date must be in YYYY-MM-DDTHH:mm format."
    ),
  courseName: z.string().min(1, "Course Name is required."),
  employee: z.object({ id: z.string().min(1, "Employee is required.") }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TrainingRecord = z.infer<typeof trainingRecordSchema>;
