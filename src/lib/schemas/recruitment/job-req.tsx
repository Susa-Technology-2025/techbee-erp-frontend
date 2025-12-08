import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { positionSchema } from "../position";
import { workScheduleSchema } from "../leave/settings";

export const JobRequisitionCreateInputSchema = z
  .object({
    budget: z
      .number()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Compensation",
          inputType: "number-field",
          label: "Budget",
          placeholder: "Enter job budget",
          description: "The allocated budget for the position.",
          validationErrorMessage: "Budget must be a positive number.",
          required: true,
        },
        tableRelated: {
          header: "Budget",
          accessorKey: "budget",
        },
      } as FieldLevelMeta),

    employmentTerm: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General Information",
        label: "Employment Term",
        placeholder: "Select employment term",
        description: "Permanent, Contract, or Temporary.",
        validationErrorMessage: "Employment term is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { id: "Permanent", name: "Permanent" },
            { id: "Contract", name: "Contract" },
            { id: "Temporary", name: "Temporary" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
        },
      },
      tableRelated: {
        header: "Employment Term",
        accessorKey: "employmentTerm",
      },
    } as FieldLevelMeta),

    jobSummary: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Description",
          inputType: "markdown",
          label: "Job Summary",
          placeholder: "Write a brief summary of the job...",
          description: "A high-level overview of the role.",
          validationErrorMessage: "Job summary is required.",
          required: true,
        },
      } as FieldLevelMeta),

    languageRequirements: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Requirements",
          inputType: "markdown",
          label: "Language Requirements",
          placeholder: "e.g., Fluent in English and Amharic...",
          description: "Specific language skills needed for the role.",
          validationErrorMessage: "Language requirements are required.",
          required: true,
        },
        tableRelated: {
          header: "Languages",
          accessorKey: "languageRequirements",
        },
      } as FieldLevelMeta),

    physicalRequirements: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Requirements",
          inputType: "markdown",
          label: "Physical Requirements",
          placeholder: "e.g., Ability to lift 50 lbs, travel extensively...",
          description: "Any physical demands of the job.",
          validationErrorMessage: "Physical requirements are required.",
          required: true,
        },
      } as FieldLevelMeta),

    position: z // 'position' is an object that contains 'id' and is NOT being kept required, so its base object is made optional/nullable
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General Information",
            label: "Position",
            placeholder: "Select the position/job title",
            description: "The official position name for this requisition.",
            validationErrorMessage: "Position is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/positions",
              getOptionsLabel: (value) => value.title,
              inputForStaticAsync: true,
              getOptionsValue: (value) => value.id,
              createSchema: positionSchema,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
      })
      .optional() // Made optional
      .nullable() // Made nullable
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Position",
          accessorKey: "position.title",
        },
      } as FieldLevelMeta),

    responsibilities: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Description",
          inputType: "markdown",
          label: "Responsibilities",
          placeholder: "List key responsibilities here (supports markdown)",
          description: "Detailed list of duties and responsibilities.",
          validationErrorMessage: "Responsibilities are required.",
          required: true,
        },
      } as FieldLevelMeta),

    status: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          inputType: "table-only",
          section: "General Information",
          label: "Requisition Status",
          placeholder: "Select status",
          description: "The current status of the job requisition.",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              { id: "Draft", name: "Draft" },
              { id: "Open", name: "Open" },
              { id: "Pending Approval", name: "Pending Approval" },
              { id: "Closed", name: "Closed" },
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),

    title: z.string().meta({
      formRelated: {
        section: "General Information",
        inputType: "text-field",
        label: "Job Title",
        placeholder: "Enter the job title",
        description: "The title to be advertised.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),

    travelRequirement: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Requirements",
          inputType: "markdown",
          label: "Travel Requirement",
          placeholder: "e.g., 20% domestic travel",
          description: "Indicates the level and nature of required travel.",
          validationErrorMessage: "Travel requirement is required.",
          required: true,
        },
      } as FieldLevelMeta),

    vacancyType: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General Information",
        label: "Vacancy Type",
        placeholder: "Select vacancy type",
        description: "External hire, Internal Transfer, or Promotion.",
        validationErrorMessage: "Vacancy type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { id: "External", name: "External" },
            { id: "InternalTransfer", name: "Internal Transfer" },
            { id: "Promotion", name: "Promotion" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
        },
      },
      tableRelated: {
        header: "Vacancy Type",
        accessorKey: "vacancyType",
      },
    } as FieldLevelMeta),

    workLocation: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Work Details",
          inputType: "text-field",
          label: "Work Location (General)",
          placeholder: "e.g., Addis Ababa, Remote, HQ",
          description: "Primary general work location.",
          validationErrorMessage: "Work location is required.",
          required: true,
        },
        tableRelated: {
          header: "Location",
          accessorKey: "workLocation",
        },
      } as FieldLevelMeta),

    workLocationDetail: z
      .string()
      .optional()
      .nullable()
      .meta({
        // Made optional and nullable
        formRelated: {
          section: "Work Details",
          inputType: "text-field",
          label: "Work Location (Detail)",
          placeholder: "Specific address or remote policy",
          description: "Detailed work address or remote work policy.",
          validationErrorMessage: "Work location detail is required.",
          required: true,
        },
        tableRelated: {
          header: "Location Detail",
          accessorKey: "workLocationDetail",
        },
      } as FieldLevelMeta),

    workSchedule: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Work Details",
            label: "Work Schedule",
            placeholder: "Select work schedule",
            description: "e.g., Full-Time, Part-Time, Shift Work.",
            validationErrorMessage: "Work schedule is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/workSchedules",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: workScheduleSchema,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
      })
      .optional() // Made optional
      .nullable() // Made nullable
      .meta({
        formRelated: {
          inputType: "object",
        },
      } as FieldLevelMeta),
    qualifications: z.array(z.string()).meta({
      formRelated: {
        section: "General Information",
        staticAsync: true,
        inputType: "chips",
        label: "Qualifications",
        placeholder: "Enter required qualifications",
        description: "List of qualifications required for the job.",
        validationErrorMessage: "At least one qualification is required.",
        required: true,
      },
    } as FieldLevelMeta),
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Job Requisitions",
    apiEndPoint: "https://api.techbee.et/api/hr/jobRequisitions",
    formName: "jobRequisitionForm",
    allowDelete: true,
    createTitle: "Create Job Requisition",
    sections: [
      "General Information",
      "Description",
      "Compensation",
      "Requirements",
      "Work Details",
    ],
    editTitle: "Edit Job Requisition",
  } as SchemaMeta);
