import { z } from "zod";

const employeeSurveyRefSchema = z.object({
  id: z.string().min(1, "Employee Survey ID is required."),
});

const employeeRefSchema = z.object({
  id: z.string().min(1, "Employee ID is required."),
});

export const surveyResponseSchema = z.object({
  id: z.string().optional(),
  employeeSurvey: employeeSurveyRefSchema,
  employee: employeeRefSchema,
  response: z.record(z.string(), z.string()),
  submittedAt: z.string().datetime().optional(),
});

export type SurveyResponse = z.infer<typeof surveyResponseSchema>;

export const createSurveyResponseSchema = surveyResponseSchema.omit({
  id: true,
});
export type CreateSurveyResponse = z.infer<typeof createSurveyResponseSchema>;

export const updateSurveyResponseSchema = surveyResponseSchema;
export type UpdateSurveyResponse = z.infer<typeof updateSurveyResponseSchema>;
