import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:S{2}.\d{3}Z$/;

export const benefitplanSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Benefit plan name is required."),
  code: z.string().min(1, "Benefit plan code is required."),
  description: z.string().min(1, "Description is required."),
  provider: z.string().min(1, "Provider is required."),
  typeField: z.enum([
    "HealthInsurance",
    "RetirementPlan",
    "TravelAllowance",
    "Wellness",
    "Education",
    "Other",
  ]),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Benefitplan = z.infer<typeof benefitplanSchema>;
