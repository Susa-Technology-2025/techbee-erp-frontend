interface WindowData {
  from: string;
  to: string;
}

interface LeaveBalance {
  leaveTypeId: string;
  name: string;
  isPaid: boolean;
  opening: number;
  carryForward: number;
  taken: number;
  current: number;
  entitled: number;
  utilizationPct: number;
}

interface LeaveSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  onLeaveNow: number;
}

interface LeaveDashboardData {
  window: WindowData;
  summary: LeaveSummary;
  balances: {
    byType: LeaveBalance[];
  };
}
