// next-version workforce schema
import { z } from "zod";

export const dashboardStat = z.object({
  window: z.object({
    from: z.string().min(1, "From date is required."),
    to: z.string().min(1, "To date is required."),
  }),
  summary: z.object({
    total: z.number(),
    active: z.number(),
    newHires: z.number(),
    onLeave: z.number(),
    attendanceRate: z.number(),
    overtimeHours: z.number(),
    payroll: z.object({
      periods: z.number(),
      gross: z.number(),
      net: z.number(),
    }),
  }),
  distributions: z.object({
    byStatus: z.array(
      z.object({
        status: z.string().optional().or(z.literal("")),
        count: z.number(),
      })
    ),
    byEmploymentTerm: z.array(
      z.object({
        employmentTerm: z.string().optional().or(z.literal("")),
        count: z.number(),
      })
    ),
    byTitle: z.array(z.any()), // Empty array now, can define later if structure changes
    byGrade: z.array(
      z.object({
        count: z.number(),
        id: z.string(),
        name: z.string(),
        code: z.string(),
      })
    ),
    byDepartment: z.array(
      z.object({
        organizationNodeId: z.string().optional().or(z.literal("")),
        name: z.string(),
        code: z.string().optional().or(z.literal("")),
        count: z.number(),
      })
    ),
    byLocation: z.array(
      z.object({
        label: z.string(),
        count: z.number(),
      })
    ),
    qualifications: z.object({
      byLevel: z.array(z.any()),
      topFields: z.array(z.any()),
    }),
    leaveUtilization: z.array(
      z.object({
        leaveTypeId: z.string(),
        name: z.string(),
        allocated: z.number(),
        used: z.number(),
        remaining: z.number(),
        utilizationPct: z.number(),
        isPaid: z.boolean(),
      })
    ),
  }),
  leave: z.object({
    planned: z.number(),
    pending: z.number(),
    sick: z.number(),
    pendingRequests: z.array(z.any()),
  }),
  peopleOps: z.object({
    performance: z.object({
      reviews: z.number(),
      avgScore: z.number(),
    }),
    trainingCompleted: z.number(),
    disciplinaryActions: z.number(),
    recognitions: z.number(),
    loansOutstanding: z.number(),
    benefitsEnrollment: z.array(z.any()),
  }),
  recentActivity: z.array(
    z.object({
      when: z.string(),
      type: z.string(),
      title: z.string(),
      subtitle: z.string(),
      employeeId: z.string(),
    })
  ),
  alerts: z.object({
    contractsExpiringSoon: z.array(
      z.object({
        id: z.string(),
        endDate: z.string(),
        employee: z.object({
          id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          employeeCode: z.string(),
        }),
        salaryStructure: z.object({
          id: z.string(),
          name: z.string(),
          code: z.string(),
        }),
      })
    ),
    probationEndingSoon: z.array(z.any()),
  }),
  workforceAnalytics: z.object({
    turnoverRate: z.number(),
    promotionRate: z.number(),
    femaleRatio: z.number(),
    avgTenureYears: z.number(),
  }),
  dataQuality: z.object({
    missingEmail: z.number(),
    missingPhone: z.number(),
    missingTIN: z.number(),
    orphanNoManager: z.number(),
    orphanNoPosition: z.number(),
  }),
  managersTopSpan: z.array(
    z.object({
      managerId: z.string(),
      manager: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        employeeCode: z.string(),
      }),
      span: z.number(),
    })
  ),
});

export type DashboardStat = z.infer<typeof dashboardStat>;
