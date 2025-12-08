import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  employeeCode: z.string().nullable(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  manager: z.string().nullable(),
});

export const PositionSchema = z.object({
  id: z.string(),
  title: z.string(),
  code: z.string(),
  level: z.string(),
  isActive: z.boolean(),
  organizationNodeId: z.string().nullable(),
});


export const positionHistorySchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().datetime(),
  employee: EmployeeSchema,
  endDate: z.string().datetime().nullable().optional(),
  isCurrent: z.boolean(),
  position: PositionSchema,
  startDate: z.string().datetime().min(1, "Start Date is required."),
  updatedAt: z.string().datetime(),
});

export type PositionHistory = z.infer<typeof positionHistorySchema>;
