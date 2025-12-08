import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDate, dateCell } from "@/lib/schemas/time-parser";
import { userSchema } from "../users";
import { pipelineStages } from "./nested-connect";
const JobAdSchema = z.object({}).optional().nullable();

export const JobPostingCreateInput = z
  .object({
    // --- General Section ---
    requisition: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Job Requisition",
            placeholder: "Select a job requisition",
            description: "The unique job requisition.",
            validationErrorMessage: "Job requisition is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/jobRequisitions",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: false,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Job",
          accessorKey: "requisition.title",
        },
      } as FieldLevelMeta),
    recruiterUserId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Recruiter",
        placeholder: "Enter Recruiter",
        description: "The Recruiter responsible.",
        validationErrorMessage: "Recruiter is required.",
        section: "General",
        required: true,
        autoComplete: {
          async: true,
          userId: true,
          allowCreateNew: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
    } as FieldLevelMeta),
    postingChannels: z
      .array(
        z.enum([
          "InternalPortal",
          "Website",
          "LinkedIn",
          "EthioJobs",
          "Referral",
        ])
      )
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Posting Channels",
          placeholder: "Select posting channels",
          description: "Channels where the job will be posted.",
          validationErrorMessage: "At least one posting channel is required.",
          section: "General",
          required: true,
          autoComplete: {
            multiple: true,
            async: false,
            options: [
              "InternalPortal",
              "Website",
              "LinkedIn",
              "EthioJobs",
              "Referral",
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
      } as FieldLevelMeta),
    closingDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Closing Date",
          placeholder: "Select closing date",
          description: "The date when the job posting will be closed.",
          validationErrorMessage: "Closing date is required.",
          section: "General",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Closing Date",
          accessorKey: "closingDate",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(true)
      .meta({
        formRelated: {
          inputType: "table-only",
          label: "Is Active",
          description: "Status of the job posting.",
          section: "General",
        },
        // tableRelated: {
        //   header: "Is Active",
        //   accessorKey: "isActive",
        // },
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

    // --- Description Section ---
    jobFormTemplateId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Job Form Template",
        placeholder: "Select Job Form Template",
        description: "Template for the job form.",
        section: "Description",
        required: true,
        autoComplete: {
          async: true,
          userId: true,
          getOptionsLabel: (opt) => opt.title,
          getOptionsValue: (opt) => opt.id,
          getEndpoint: "https://api.techbee.et/api/hr/templates",
        },
      },
    } as FieldLevelMeta),

    aboutCompany: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
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
          inputType: "text-area",
          label: "Benefits",
          placeholder: "List job benefits",
          description: "A detailed list of benefits offered with the job.",
          section: "Description",
          required: false,
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
          section: "Description",
        },
        tableRelated: {
          header: "Probation",
          accessorKey: "probationPeriod",
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
          placeholder: "Describe career opportunities",
          description: "Details on growth and training opportunities.",
          section: "Description",
          required: false,
        },
      } as FieldLevelMeta),

    // --- Application Section ---
    howToApply: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
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
    description: z.string().meta({
      formRelated: {
        inputType: "markdown",
        label: "Job Description",
        placeholder: "Enter job description",
        description: "Detailed description of the job.",
        validationErrorMessage: "Description is required.",
        section: "Description",
        required: true,
        templateEndpoint: "https://api.techbee.et/api/hr/templates",
      },
      tableRelated: {
        header: "Description",
        accessorKey: "description",
      },
    } as FieldLevelMeta),
    pipelineStages,
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Job Postings",
    apiEndPoint: "https://api.techbee.et/api/hr/jobPostings",
    formName: "jobPosting",
    allowDelete: true,
    createTitle: "Create Job Posting",
    sections: ["General", "Description"],
    editTitle: "Edit Job Posting",
  } as SchemaMeta);
