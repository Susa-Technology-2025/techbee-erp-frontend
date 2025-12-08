import { z } from "zod";

export const questionSchema = z.object({
  id: z.string().optional(),
  code: z.string(),
  section: z.string().default("ungrouped"),
  question: z.string().min(1, "Question is required"),
  required: z.boolean().optional().nullable().default(false),
  weighted: z.boolean().default(false),
  weight: z.number({ message: "weight is required" }).optional().nullable(),
  answerType: z.enum([
    "text",
    "number",
    "date",
    "time",
    "email",
    "date-time",
    "multiple-choice",
    "true-false",
    "file",
  ]),
  multipleChoices: z.array(z.string()).optional().nullable(),
  allowMultipleChoice: z.boolean().optional().nullable(),
  min: z.number().optional().nullable(),
  max: z.number().optional().nullable(),
  defaultAnswer: z
    .union([z.string(), z.number(), z.boolean(), z.null()])
    .optional(),
  answerValidationMessage: z.string().optional(),
  fileTypes: z.array(z.string()).optional().nullable(),
  conditions: z
    .array(
      z.object({
        action: z.enum([
          "show",
          "hide",
          "enable",
          "disable",
          "require",
          "jumpTo",
        ]),
        questionId: z.string(),
        operator: z.enum([
          "equals",
          "notEquals",
          "contains",
          "greaterThan",
          "lessThan",
          "isEmpty",
          "isNotEmpty",
        ]),
        value: z.any().optional(),
      })
    )
    .optional(),
});

export const questionsSchema = z.array(questionSchema);

export type Question = z.infer<typeof questionSchema>;
export type Questions = z.infer<typeof questionsSchema>;

export const answerTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "date-time", label: "Date and Time" },
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "true-false", label: "True/False" },
  { value: "file", label: "File" },
];
