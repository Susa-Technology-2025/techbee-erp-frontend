export interface DashboardData {
  summary: {
    totalProjects: number;
    byApprovalStatus: Record<string, number>;
    totalPlannedBudget: number;
    totalActualCost: number;
    averageProgressPercent: number;
    [key: string]: any;
  };
  pipelineByStage: Array<{
    stageId: string | null;
    stageName: string | null;
    count: number;
    totalBudget: number;
    averageProgressPercent: number;
    [key: string]: any;
  }>;
  projectsByType: Array<{
    projectTypeId: string;
    projectTypeCode: string;
    projectTypeName: string;
    count: number;
    totalBudget: number;
    [key: string]: any;
  }>;
  managerWorkload: Array<{
    projectManagerEmployeeId: string;
    projectCount: number;
    totalBudget: number;
    averageProgressPercent: number;
    [key: string]: any;
  }>;
  riskAndDeadlines: {
    atRiskCount: number;
    overdueCount: number;
    dueIn7DaysCount: number;
    dueIn30DaysCount: number;
    [key: string]: any;
  };
  timesheets: {
    totalTrackedHours: number;
    totalBillableHours: number;
    projectsWithTimeEntries: number;
    [key: string]: any;
  };
  topProjects: Array<{
    id: string;
    code: string;
    title: string;
    approvalStatus: string;
    totalBudget: number | null;
    actualCost: number | null;
    totalPercentCompletion: number | null;
    riskFlag: boolean;
    [key: string]: any;
  }>;
  topRiskProjects: Array<{
    id: string;
    code: string;
    title: string;
    riskFlag: boolean;
    plannedEndDate: string;
    daysOverdue: number;
    totalBudget: number | null;
    totalPercentCompletion: number | null;
    [key: string]: any;
  }>;
  projectsByCustomer: Array<{
    customerName: string;
    projectCount: number;
    totalBudget: number;
    [key: string]: any;
  }>;
  monthlyTrends: Array<{
    month: string;
    newProjectsCount: number;
    totalBudget: number;
    totalTrackedHours: number;
    [key: string]: any;
  }>;
}

// Generic type for dynamic handling
export type DashboardDataKey = keyof DashboardData;