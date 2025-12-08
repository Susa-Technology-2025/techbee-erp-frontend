import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const performanceReviewSchema = z.object({
  id: z.string().optional(),
  comments: z.string().min(1, "Comments are required."),
  createdAt: z.string().optional(),
  employee: z.object({
    id: z.string().min(1, "Employee is required."),
  }),
  reviewDate: z
    .string()
    .regex(dateTimeRegex, "Review Date must be in YYYY-MM-DDTHH:mm format."),
  reviewer: z.string().min(1, "Reviewer name is required."),
  score: z
    .number()
    .min(0, "Score must be non-negative.")
    .max(10, "Score must be at most 10."),
  updatedAt: z.string().optional(),
});

export type PerformanceReview = z.infer<typeof performanceReviewSchema>;
