export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  assignedToEmployee: number;
  assignedToRole: number;
}

export interface RatesDetail {
  taskRate: number | null;
  auditRate: number | null;
  rateSource: string;
}

export interface AuditRecord {
  performedAt: string;
  performedBy: string;
  complianceRate: number;
  result: string;
}

export interface TrendRecord {
  performedAt: string;
  complianceRate: number;
  result: string;
}

export interface ComplianceItem {
  id: string;
  code: string;
  name: string;
  type: string;
  requirementCount: number;
  taskStats: TaskStats;
  complianceRate: number | null;
  ratesDetail: RatesDetail;
  lastAudit: AuditRecord | null;
  trend: TrendRecord[];
}

export interface ComplianceData {
  overallComplianceRate: number;
  totalCompliances: number;
  byType: {
    Legal: number;
    Policy: number;
    Safety: number;
  };
  taskStats: TaskStats;
  compliances: ComplianceItem[];
}