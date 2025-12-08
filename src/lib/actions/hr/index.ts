import { fetcher } from "@/lib/fetch";

export const EmployeeService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/employees",
      params,
      tags: ["employees"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/employees/${id}`,
      tags: ["employees", `employee-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/employees",
      body: data,
      tags: ["employees"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/employees/${id}`,
      body: data,
      tags: ["employees", `employee-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/employees/${id}`,
      tags: ["employees"],
    }),
};

export const AttendanceService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/attendances",
      params,
      tags: ["attendances"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/attendances/${id}`,
      tags: ["attendances", `attendance-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/attendances",
      body: data,
      tags: ["attendances"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/attendances/${id}`,
      body: data,
      tags: ["attendances", `attendance-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/attendances/${id}`,
      tags: ["attendances"],
    }),
};

export const LeaveRequestService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/leaveRequests",
      params,
      tags: ["leave-requests"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/leaveRequests/${id}`,
      tags: ["leave-requests", `leave-request-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/leaveRequests",
      body: data,
      tags: ["leave-requests"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/leaveRequests/${id}`,
      body: data,
      tags: ["leave-requests", `leave-request-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/leaveRequests/${id}`,
      tags: ["leave-requests"],
    }),

  approveManager: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/manager-approve",
      body: data,
      tags: ["leave-requests"],
    }),

  approveHR: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/hr-approve",
      body: data,
      tags: ["leave-requests"],
    }),
};

export const LeaveBalanceService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/leaveBalances",
      params,
      tags: ["leave-balances"],
    }),

  getByEmployee: (employeeId: string) =>
    fetcher({
      endpoint: "/api/leaveBalances",
      params: { "where[employee][id]": employeeId },
      tags: ["leave-balances", `leave-balance-${employeeId}`],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/leaveBalances/${id}`,
      tags: ["leave-balances", `leave-balance-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/leaveBalances",
      body: data,
      tags: ["leave-balances"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/leaveBalances/${id}`,
      body: data,
      tags: ["leave-balances", `leave-balance-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/leaveBalances/${id}`,
      tags: ["leave-balances"],
    }),
};

export const PayrollService = {
  getPayslips: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/payslips",
      params,
      tags: ["payslips"],
    }),

  getPayslipById: (id: string) =>
    fetcher({
      endpoint: `/api/payslips/${id}`,
      tags: ["payslips", `payslip-${id}`],
    }),

  getPayrollRuns: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/payrollruns",
      params,
      tags: ["payroll-runs"],
    }),

  getPayrollRunById: (id: string) =>
    fetcher({
      endpoint: `/api/payrollruns/${id}`,
      tags: ["payroll-runs", `payroll-run-${id}`],
    }),
};

export const PerformanceReviewService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/performanceReviews",
      params,
      tags: ["performance-reviews"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/performanceReviews/${id}`,
      tags: ["performance-reviews", `performance-review-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/performanceReviews",
      body: data,
      tags: ["performance-reviews"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/performanceReviews/${id}`,
      body: data,
      tags: ["performance-reviews", `performance-review-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/performanceReviews/${id}`,
      tags: ["performance-reviews"],
    }),
};

export const EmployeeBenefitService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/employeebenefits",
      params,
      tags: ["employee-benefits"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/employeebenefits/${id}`,
      tags: ["employee-benefits", `employee-benefit-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/employeebenefits",
      body: data,
      tags: ["employee-benefits"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/employeebenefits/${id}`,
      body: data,
      tags: ["employee-benefits", `employee-benefit-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/employeebenefits/${id}`,
      tags: ["employee-benefits"],
    }),
};

export const TrainingRecordService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/trainingRecords",
      params,
      tags: ["training-records"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/trainingRecords/${id}`,
      tags: ["training-records", `training-record-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/trainingRecords",
      body: data,
      tags: ["training-records"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/trainingRecords/${id}`,
      body: data,
      tags: ["training-records", `training-record-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/trainingRecords/${id}`,
      tags: ["training-records"],
    }),
};

export const EmployeeRecognitionService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/employeerecognitions",
      params,
      tags: ["employee-recognitions"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/employeerecognitions/${id}`,
      tags: ["employee-recognitions", `employee-recognition-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/employeerecognitions",
      body: data,
      tags: ["employee-recognitions"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/employeerecognitions/${id}`,
      body: data,
      tags: ["employee-recognitions", `employee-recognition-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/employeerecognitions/${id}`,
      tags: ["employee-recognitions"],
    }),
};

export const EmployeeSurveyService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/employeesurveys",
      params,
      tags: ["employee-surveys"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/employeesurveys/${id}`,
      tags: ["employee-surveys", `employee-survey-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/employeesurveys",
      body: data,
      tags: ["employee-surveys"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/employeesurveys/${id}`,
      body: data,
      tags: ["employee-surveys", `employee-survey-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/employeesurveys/${id}`,
      tags: ["employee-surveys"],
    }),
};

export const SurveyResponseService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/surveyresponses",
      params,
      tags: ["survey-responses"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/surveyresponses/${id}`,
      tags: ["survey-responses", `survey-response-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/surveyresponses",
      body: data,
      tags: ["survey-responses"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/surveyresponses/${id}`,
      body: data,
      tags: ["survey-responses", `survey-response-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/surveyresponses/${id}`,
      tags: ["survey-responses"],
    }),
};

export const InternalEventService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/internalevents",
      params,
      tags: ["internal-events"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/internalevents/${id}`,
      tags: ["internal-events", `internal-event-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/internalevents",
      body: data,
      tags: ["internal-events"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/internalevents/${id}`,
      body: data,
      tags: ["internal-events", `internal-event-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/internalevents/${id}`,
      tags: ["internal-events"],
    }),
};

export const GoalService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/goals",
      params,
      tags: ["goals"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/goals/${id}`,
      tags: ["goals", `goal-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/goals",
      body: data,
      tags: ["goals"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/goals/${id}`,
      body: data,
      tags: ["goals", `goal-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/goals/${id}`,
      tags: ["goals"],
    }),
};

export const DevelopmentPlanService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/developmentplans",
      params,
      tags: ["development-plans"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/developmentplans/${id}`,
      tags: ["development-plans", `development-plan-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/developmentplans",
      body: data,
      tags: ["development-plans"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/developmentplans/${id}`,
      body: data,
      tags: ["development-plans", `development-plan-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/developmentplans/${id}`,
      tags: ["development-plans"],
    }),
};

export const PaySlipComponentService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/paySlipComponents",
      params,
      tags: ["payslip-components"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/paySlipComponents/${id}`,
      tags: ["payslip-components", `payslip-component-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/paySlipComponents",
      body: data,
      tags: ["payslip-components"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/paySlipComponents/${id}`,
      body: data,
      tags: ["payslip-components", `payslip-component-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/paySlipComponents/${id}`,
      tags: ["payslip-components"],
    }),
};

export const BenefitPlanService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/benefitplans",
      params,
      tags: ["benefit-plans"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/benefitplans/${id}`,
      tags: ["benefit-plans", `benefit-plan-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/benefitplans",
      body: data,
      tags: ["benefit-plans"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/benefitplans/${id}`,
      body: data,
      tags: ["benefit-plans", `benefit-plan-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/benefitplans/${id}`,
      tags: ["benefit-plans"],
    }),
};

export const ClaimRequestService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/claimrequests",
      params,
      tags: ["claim-requests"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/claimrequests/${id}`,
      tags: ["claim-requests", `claim-request-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/claimrequests",
      body: data,
      tags: ["claim-requests"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/claimrequests/${id}`,
      body: data,
      tags: ["claim-requests", `claim-request-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/claimrequests/${id}`,
      tags: ["claim-requests"],
    }),
};

export const EmployeeBankAccountService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/employeebankaccounts",
      params,
      tags: ["employee-bank-accounts"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/employeebankaccounts/${id}`,
      tags: ["employee-bank-accounts", `employee-bank-account-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/employeebankaccounts",
      body: data,
      tags: ["employee-bank-accounts"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/employeebankaccounts/${id}`,
      body: data,
      tags: ["employee-bank-accounts", `employee-bank-account-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/employeebankaccounts/${id}`,
      tags: ["employee-bank-accounts"],
    }),
};

export const PayrollComponentService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    fetcher({
      endpoint: "/api/payrollcomponents",
      params,
      tags: ["payroll-components"],
    }),

  getById: (id: string) =>
    fetcher({
      endpoint: `/api/payrollcomponents/${id}`,
      tags: ["payroll-components", `payroll-component-${id}`],
    }),

  create: (data: any) =>
    fetcher({
      method: "POST",
      endpoint: "/api/payrollcomponents",
      body: data,
      tags: ["payroll-components"],
    }),

  update: (id: string, data: any) =>
    fetcher({
      method: "PATCH",
      endpoint: `/api/payrollcomponents/${id}`,
      body: data,
      tags: ["payroll-components", `payroll-component-${id}`],
    }),

  delete: (id: string) =>
    fetcher({
      method: "DELETE",
      endpoint: `/api/payrollcomponents/${id}`,
      tags: ["payroll-components"],
    }),
};
