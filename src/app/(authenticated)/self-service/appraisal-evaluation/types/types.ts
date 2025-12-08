// types/performance.ts
export interface RatingScaleOption {
  id: string;
  value: string;
  label: string;
  score: number;
  order: number;
}

export interface RatingScale {
  id: string;
  code: string;
  name: string;
  type: string;
  options: RatingScaleOption[];
}

export interface Question {
  id: string;
  code: string;
  section: string;
  question: string;
  description: string | null;
  weight: number;
  required: boolean;
  order: number;
  ratingScale: RatingScale;
}

export interface PerformanceTemplate {
  id: string;
  code: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Cycle {
  id: string;
  name: string;
  durationMonths: number;
  isActive: boolean;
}

export interface Evaluator {
  id: string;
  type: string;
  weight: number;
  evaluator: {
    id: string;
    firstName: string;
    fatherName: string;
    employeeCode: string;
  };
  evaluations: any[];
}

export interface RecommendationRule {
  id: string;
  minScore: number;
  maxScore: number;
  recommendation: string;
  note: string | null;
}

export interface Evaluation {
  id: string;
  status: string;
  finalScore: number | null;
  recommendation: string | null;
  submittedAt: string | null;
  evaluator: any | null;
  subject: any | null;
}

export interface AppraisalPlan {
  allowRecommendation: boolean;
  allowedEvaluatorRoles: string[];
  approvalInstance: any | null;
  approvalStatus: string;
  autoRecommendation: boolean;
  comments: string | null;
  competencyWeight: number | null;
  createdAt: string;
  cycle: Cycle;
  defaultEvaluatorRole: string;
  goalWeight: number | null;
  id: string;
  managerRating: number | null;
  name: string;
  peerRating: number | null;
  performanceTemplate: PerformanceTemplate | null;
  periodEnd: string;
  periodStart: string;
  selfRating: number | null;
  splitEvaluation: boolean;
  type: string;
  updatedAt: string;
  useGoals: boolean;
  subjects: any[];
  evaluators: Evaluator[];
  planGoals: any[];
  planKpis: any[];
  recommendationRules: RecommendationRule[];
  evaluations: Evaluation[];
}

export interface AppraisalPlansResponse {
  data: AppraisalPlan[];
  meta: {
    totalRowCount: number;
  };
}