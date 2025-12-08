import { z } from "zod";
import type { FieldLevelMeta } from "@/lib/schemas/types";
const JobFormSchema = z.object({}).optional().nullable();

export const MissingJobPostingFieldsWithMeta = z.object({
  aboutCompany: z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "markdown",
        label: "About Company",
        placeholder: "Enter details about the company",
        description:
          "Information about the company to display on the job posting.",
        section: "Description",
        required: false,
      },
      tableRelated: {
        header: "About Company",
        accessorKey: "aboutCompany",
      },
    } as FieldLevelMeta),

  benefits: z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "markdown",
        label: "Benefits",
        placeholder: "List job benefits",
        description: "A detailed list of benefits offered with the job.",
        section: "Description",
        required: false,
      },
    } as FieldLevelMeta),

  developmentOpportunities: z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "text-area",
        label: "Development Opportunities",
        placeholder: "Describe career growth opportunities",
        description: "Details on growth and training opportunities.",
        section: "Description",
        required: false,
      },
    } as FieldLevelMeta),

  howToApply: z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "markdown",
        label: "How To Apply",
        placeholder: "Enter application instructions",
        description: "Instructions for candidates on how to apply.",
        section: "Application",
        required: false,
      },
    } as FieldLevelMeta),

  interviewProcessOverview: z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "text-area",
        label: "Interview Process Overview",
        placeholder: "Describe the interview stages",
        description: "A brief summary of the steps in the interview process.",
        section: "Application",
        required: false,
      },
    } as FieldLevelMeta),

  isSalaryVisible: z
    .boolean()
    .default(false)
    .meta({
      formRelated: {
        inputType: "boolean-field",
        label: "Is Salary Visible",
        description:
          "Whether the salary range should be displayed on the posting.",
        section: "General",
      },
      tableRelated: {
        header: "Salary Visible",
        accessorKey: "isSalaryVisible",
      },
    } as FieldLevelMeta),

  jobForm: JobFormSchema.meta({
    formRelated: {
      inputType: "object",
      label: "Job Form Content",
      section: "Description",
      description: "Structured job form content (separate from template).",
    },
  } as FieldLevelMeta),

  probationPeriod: z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "text-field",
        label: "Probation Period",
        placeholder: "e.g., 6 months",
        description: "The duration of the probation period.",
        section: "General",
      },
      tableRelated: {
        header: "Probation",
        accessorKey: "probationPeriod",
      },
    } as FieldLevelMeta),
});
