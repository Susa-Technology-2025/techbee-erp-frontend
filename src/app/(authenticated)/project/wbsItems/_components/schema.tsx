import { z } from "zod";
export const WbsItemCreateInputSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string({ error: "Title is required" }),
  code: z.string({ error: "Code is required" }).optional().nullable(),
  color: z.string({ error: "color is required" }).optional().nullable(),
  type: z
    .enum(["Phase", "Task", "Subtask"], { error: "Type is required" })
    .default("Task"),
  approvalStatus: z
    .enum(["Draft", "Pending", "Approved", "Rejected"], {
      error: "Approval status is required",
    })
    .default("Draft"),
  slaState: z
    .enum(["Ok", "Warning", "Breached"], { error: "Sla state is required" })
    .default("Ok"),
  approvalRequired: z
    .boolean({ error: "Approval required is required" })
    .default(false),
  notifyTaskAssignmentChanged: z
    .boolean({ error: "Notify task assignment changed is required" })
    .default(false),
  actualCost: z.coerce.number().optional().nullable(),
  budgetEstimate: z.coerce.number().optional().nullable(),
  durationDays: z.coerce.number().optional().nullable(),
  order: z.coerce.number().optional().nullable(),
  percentCompletion: z.coerce.number().optional().nullable(),
  weightPercent: z.coerce.number().optional().nullable(),
  actualCompletionDate: z.coerce.date().optional().nullable(),
  plannedStartDate: z.coerce.date().optional().nullable(),
  plannedEndDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  responsibleRoleOrName: z
    .string()
    .optional()
    .nullable()
    .meta({ url: "/users" }),
  riskOrIssues: z.string().optional().nullable(),
  statusLabel: z.string().optional().nullable(),
  deliverables: z.unknown().optional().nullable(),
  milestone: z
    .object({ id: z.string().optional().nullable() })
    .optional()
    .nullable()
    .meta({ url: "/milestones" }),
  project: z.object({ id: z.string() }).meta({ url: "/projects" }),
  parent: z
    .object({ id: z.string().optional().nullable() })
    .optional()
    .nullable()
    .meta({ url: "/wbsItems" }),
  taskStage: z
    .object({ id: z.string().optional().nullable() })
    .optional()
    .nullable()
    .meta({ url: "/taskStages" }),
});
