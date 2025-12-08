import {z} from "zod"
export const TimesheetCreateFormSchema = z.object({
  id: z.string().optional().nullable(),
  employeeId: z.string({
    error: "Employee Id is required",
  }),
  entryCode: z.string({
    error: "Entry Code is required",
  }),
  status: z.enum(["Draft", "Submitted", "Approved", "Rejected"], {
    error: "Status is required",
  }),
  totalAmount: z.coerce.number().optional().nullable(),
  totalHours: z.coerce.number().optional().nullable(),
  periodStart: z.coerce.date({
    error: "Period Start is required",
  }),
  periodEnd: z.coerce.date({
    error: "Period End is required",
  }),
  approvedByEmployeeId: z.union([ z.string().optional().nullable(),z.object({ id: z.string().optional().nullable() }).optional().nullable()]).transform(v => (typeof v === "string" ? v : v?.id)),
  approvedAt: z.coerce.date().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  entries: z.array(z.unknown()).optional().nullable().meta({
    url: "/timeEntries",
  }),
})