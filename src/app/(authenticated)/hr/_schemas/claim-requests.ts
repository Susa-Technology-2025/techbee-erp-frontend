import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const claimRequestSchema = z.object({
  id: z.string().optional(),
  employeeBenefit: z.object({
    id: z.string().min(1, "Employee Benefit is required."),
  }),
  employee: z.object({ id: z.string().min(1, "Employee is required.") }),
  amount: z.coerce
    .number()
    .positive("Amount must be a positive number.")
    .min(0.01, "Amount must be greater than 0."),
  approvedAmount: z.coerce
    .number()
    .positive("Approved Amount must be a positive number.")
    .optional()
    .or(z.literal(undefined)),
  claimDate: z
    .string()
    .regex(dateTimeRegex, "Claim Date must be in YYYY-MM-DDTHH:mm format."),
  reason: z.string().min(1, "Reason is required."),
  reviewedAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "Reviewed At must be in YYYY-MM-DDTHH:mm format.",
    }),
  reviewedBy: z.string().optional().or(z.literal("")),
  status: z
    .enum(["Pending", "Approved", "Rejected"], {
      errorMap: () => ({
        message: "Status must be PENDING, APPROVED, or REJECTED.",
      }),
    })
    .default("Pending")
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type ClaimRequest = z.infer<typeof claimRequestSchema>;
