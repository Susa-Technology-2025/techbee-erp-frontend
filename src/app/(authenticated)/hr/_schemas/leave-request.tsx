import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const dateTimeInputRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const leaveRequestSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().regex(dateTimeRegex).optional(),
  updatedAt: z.string().regex(dateTimeRegex).optional(),
  employee: z.object({
    id: z.string().min(1, "Employee is required."),
  }),
  leaveType: z.object({
    id: z.string().min(1, "Leave Type is required."),
  }),
  startDate: z
    .string()
    .regex(
      dateTimeInputRegex,
      "Start Date must be in YYYY-MM-DDTHH:mm format."
    ),
  endDate: z
    .string()
    .regex(dateTimeInputRegex, "End Date must be in YYYY-MM-DDTHH:mm format."),
  reason: z.string().min(1, "Reason is required."),
  status: z
    .enum([
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
      "HrApproved",
      "ManagerApproved",
      "HrRejected",
      "ManagerRejected",
    ])
    .optional(),
  managerReviewedAt: z.string().regex(dateTimeRegex).nullable().optional(),
  managerReviewerId: z.string().nullable().optional(),
  hrReviewedAt: z.string().regex(dateTimeRegex).nullable().optional(),
  hrReviewerId: z.string().nullable().optional(),
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;
