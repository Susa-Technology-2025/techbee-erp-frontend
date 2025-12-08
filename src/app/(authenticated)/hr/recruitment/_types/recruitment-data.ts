export interface RecruitmentData {
  window: {
    from: string;
    to: string;
  };
  recruitment: RecruitmentSection;
  onboarding: OnboardingSection;
}

// ---------------- Recruitment Section ----------------
export interface RecruitmentSection {
  kpis: RecruitmentKPIs;
  funnel: FunnelData[];
  jobRequisitions: JobRequisition[];
  candidatePipeline: PipelineStage[];
  recruiterPerformance: Recruiter[];
  upcomingInterviews: Interview[];
  alerts: Alert[];
  sourceOfHire: SourceData[];
  diversityMetrics: DiversityMetrics | null;
}

export interface RecruitmentKPIs {
  totalOpenPositions: number;
  totalApplications: number;
  candidatesInPipeline: number;
  timeToHire: number;
  timeToFill: number;
  offerAcceptanceRate: number;
  costPerHire: number | null;
}

export interface FunnelData {
  name: string;
  value: number;
  conversionRate?: string;
  dropOffRate?: string;
}

export interface JobRequisition {
  id: string;
  title: string;
  department: string | null;
  hiringManager: string | null;
  openPositions: number;
  priority: 'High' | 'Medium' | 'Low' | null;
  daysOpen: number;
  postingId?: string;
  closingDate?: string;
  position?: {
    id: string;
    title: string;
    code: string;
  };
  recruiterUserId?: string;
}

export interface PipelineStage {
  name: string;
  candidates: number;
  avgTime: number;
}

export interface Recruiter {
  id: string | number;
  name?: string;
  rolesFilled?: number;
  avgTimeToClose?: number;
  satisfactionScore?: number;
}

export interface Interview {
  id?: string | number;
  candidate?: string;
  position?: string;
  date?: string;
  time?: string;
  interviewers?: string[];
}

export interface Alert {
  id: string;
  type: 'position' | 'candidate' | 'approval' | 'onboarding';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SourceData {
  name: string;
  value: number;
}

export interface DiversityMetrics {
  gender: { name: string; value: number }[];
  age: { name: string; value: number }[];
}

// ---------------- Onboarding Section ----------------
export interface OnboardingSection {
  kpis: OnboardingKPIs;
  tasksByStatus: TaskStatus[];
  templateUsage: TemplateUsage[];
  upcomingTasks: any[];
  recentCompletedTasks: any[];
  planProgress: PlanProgress[];
  alerts: Alert[];
}

export interface OnboardingKPIs {
  activePlans: number;
  totalTasks: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksNotStarted: number;
  overdueTasks: number;
  dueThisWeek: number;
  avgCompletionDays: number;
}

export interface TaskStatus {
  status: string;
  count: number;
}

export interface TemplateUsage {
  templateId: string;
  name: string;
  count: number;
}

export interface PlanProgress {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  templateId: string;
  completed: number;
  total: number;
  progressPct: number;
}
