export interface PayrollWindow {
  from: string; // ISO date string
  to: string;   // ISO date string
}

export interface PayrollSummary {
  periods: number;
  totalSlips: number;
  employees: number;
  payroll: {
    periods: number;
    gross: number;
    net: number;
  };
  policies: {
    activeTaxBrackets: number;
    activePensionPolicies: number;
  };
}

export interface BatchStatus {
  status: string;
  count: number;
}

export interface MonthlyTrend {
  month: string; // e.g., "2025-08"
  gross: number;
  net: number;
  batches: number;
  slipsFinalized: number;
}

export interface Anomalies {
  negativeNetPays: number;
  missingGrossOrNet: number;
  noComponents: number;
}

export interface PayrollData {
  window: PayrollWindow;
  summary: PayrollSummary;
  distributions: {
    byBatchStatus: BatchStatus[];
    bySlipStatus: any[];
    byRuleCategory: any[];
    byInputCode: any[];
    byCostCenter: any[];
  };
  monthlyTrends: MonthlyTrend[];
  openPayslipsTop: any[];
  staging: {
    byStatus: any[];
    exampleErrors: any[];
  };
  anomalies: Anomalies;
}
