import { z } from "zod";

export const paySlipComponentSchema = z.object({
  id: z.string().optional(),
  paySlip: z.object({
    id: z.string().min(1),
  }),
  amount: z.number().min(0, "Amount must be a non-negative number."),
});

export type PaySlipComponent = z.infer<typeof paySlipComponentSchema>;
