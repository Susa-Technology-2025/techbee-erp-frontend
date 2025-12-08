import { z } from "zod";

// Regex for YYYY-MM-DDTHH:mm format
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const salaryRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  code: z.string().min(1, "Code is required."),
  category: z.object({ id: z.string().min(1, "Category is required.") }),
  calculationType: z.enum(
    ["Fixed", "Formula", "PercentageOfCategory", "SplitEqually"],
    {
      errorMap: () => ({
        message:
          "Calculation Type is required and must be one of Fixed, Formula, PercentageOfCategory, or SplitEqually.",
      }),
    }
  ),
  fixedAmount: z.number().optional().or(z.literal(0)),
  formula: z.string().optional().or(z.literal("")),
  percentageOfCategory: z
    .object({ id: z.string().min(1, "Percentage of Category ID is required.") })
    .optional(),
  sequence: z.number().int().optional(),
  isActive: z.boolean().default(true).optional(),
  isDeduction: z.boolean().default(true).optional(),
  externalCode: z.string().optional().or(z.literal("")),
  organizationNodeId: z.string().optional().or(z.literal("")),
  conditionExpression: z.string().nullable().optional(),
  activeFrom: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "Active From Date must be in YYYY-MM-DDTHH:mm format.",
    }),
  activeTo: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "Active To Date must be in YYYY-MM-DDTHH:mm format.",
    }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const DictionarySchema = z.object({
  key: z.string(),
  description: z.string()
})
export type Dictionary = z.infer<typeof DictionarySchema>;
export type SalaryRule = z.infer<typeof salaryRuleSchema>;
