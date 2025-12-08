import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const developmentPlanSchema = z.object({
  id: z.string().optional(),
  employees: z
    .object({
      id: z.string().min(1, "Employee ID is required."),
    })
    .optional(),
  goal: z.object({
    id: z.string().min(1, "Goal is required."),
  }),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional().or(z.literal("")),
  startDate: z
    .string()
    .regex(dateTimeRegex, "Start Date must be in YYYY-MM-DDTHH:mm format."),
  endDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "End Date must be in YYYY-MM-DDTHH:mm format.",
    }),
  status: z
    .enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELED"])
    .default("PLANNED")
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;
