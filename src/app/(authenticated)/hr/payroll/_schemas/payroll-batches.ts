import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

// Add these schemas for rounding and pools
const roundingSchema = z.object({
  mode: z.enum(["round", "floor", "ceil"]),
  step: z.number().min(0.01, "Step must be at least 0.01"),
}).optional();

const poolStrategySchema = z.object({
  type: z.enum(["EqualPerHead", "ProRataByBaseSalary", "ProRataByGross"]), // You can add more types later
});

const poolEligibilitySchema = z.object({
  salaryStructureIds: z.array(z.string()).optional(),
}).optional();

const poolSchema = z.object({
  salaryRuleId: z.string().min(1, "Salary rule ID is required"),
  amount: z.number().min(0, "Amount must be positive"),
  strategy: poolStrategySchema,
  inheritBatchFilters: z.boolean().default(false),
  eligibility: poolEligibilitySchema.optional(),
});

export const payrollBatchSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  batchType: z.enum(["Monthly", "Bonus", "OffCycle", "Termination", "Custom"], {
    errorMap: () => ({ message: "Batch Type must be one of: Monthly, Bonus, OffCycle, Termination, Custom." }),
  }),
  description: z.string().optional(),
  periodStart: z
    .string()
    .regex(dateTimeRegex, "Period Start must be in YYYY-MM-DDTHH:mm format."),
  periodEnd: z
    .string()
    .regex(dateTimeRegex, "Period End must be in YYYY-MM-DDTHH:mm format."),
  status: z.enum(["Draft", "Generated", "Verified", "Done", "Paid", "Posted"], {
    errorMap: () => ({ message: "Status must be 'Draft' or 'Verified'." }),
  }).default("Draft"),
  filters: z
    .object({
      positionIds: z.array(z.string()).optional(),
      employmentTerms: z.array(z.string()).optional(),
      organizationNodeIds: z.array(z.string()).optional(),
      salaryStructureIds: z.array(z.string()).optional(),
      // Add rounding and pools inside filters
      rounding: roundingSchema,
      pools: z.array(poolSchema).optional(),
    })
    .optional(),
  organizationNodeId: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  locked: z.boolean().optional(),
});

export type PayrollBatch = z.infer<typeof payrollBatchSchema>;