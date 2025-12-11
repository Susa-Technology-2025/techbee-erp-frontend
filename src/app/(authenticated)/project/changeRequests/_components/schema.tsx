import { z } from "zod";
export const ChangeRequestCreateInputFormSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string({ error: "Title is required" }),
  code: z.string({ error: "Code is required" }).optional().nullable(),
  changeType: z.string({ error: "Change type is required" }),
  approvalStatus: z.enum(["Draft", "Pending", "Approved", "Rejected"], {
    error: "Approval status is required",
  }),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional().nullable(),
  description: z.string({ error: "Description is required" }),
  reason: z.string().optional().nullable(),
  commentsNotes: z.string().optional().nullable(),
  implementationPlan: z.string().optional().nullable(),
  billingAmount: z.coerce.number().optional().nullable(),
  impactCost: z.coerce.number().optional().nullable(),
  impactTimeDays: z.coerce.number().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  project: z
    .object({ id: z.string().optional().nullable() })
    .optional()
    .nullable()
    .meta({ url: "/projects" }),
  updatedBy: z.string().optional().nullable(),
  requestedByName: z.string().optional().nullable(),
  requestedByEmployeeId: z
    .union([
      z.string().optional().nullable(),
      z.object({ id: z.string().optional().nullable() }).optional().nullable(),
    ])
    .transform((v) => (typeof v === "string" ? v : v?.id)),
  impactResources: z.unknown().optional().nullable(),
  notificationsPolicy: z.unknown().optional().nullable(),
  wbsItem: z.object({ id: z.string() }).meta({ url: "/wbsItems" }),
});
