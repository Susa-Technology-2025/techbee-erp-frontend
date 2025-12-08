import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  preprocessedDate,
  preprocessedDateTime,
} from "@/lib/schemas/time-parser";
import { organizationSchema } from "../organization-node";
import { orgology } from "../nested-reusable-objects";

const orgID = (section: string) => orgology(section);

export const performanceCycleSchema = z
  .object({
    id,
    allowMultipleActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Allow Multiple Active Cycles",
          description: "Allows multiple active cycles at the same time.",
        },
        tableRelated: {
          header: "Allow Multiple Active",
          accessorKey: "allowMultipleActive",
        },
      } as FieldLevelMeta),

    autoLaunchAfterHire: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Auto Launch After Hire",
          description:
            "Automatically launches a new cycle after an employee is hired.",
        },
        tableRelated: {
          header: "Auto Launch After Hire",
          accessorKey: "autoLaunchAfterHire",
        },
      } as FieldLevelMeta),

    durationMonths: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "number-field",
          section: "General",
          label: "Duration (Months)",
          placeholder: "Enter duration in months",
          description: "The duration of the performance cycle in months.",
          validationErrorMessage: "Duration is required.",
          required: false,
        },
        tableRelated: {
          header: "Duration (Months)",
          accessorKey: "durationMonths",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Is Active",
          description:
            "Indicates if the performance cycle is currently active.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the performance cycle.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    organizationNodeId: orgID("General"),

    startAfterHireMonths: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "number-field",
          section: "General",
          label: "Start After Hire (Months)",
          placeholder: "Enter months",
          description: "Number of months after hire to start the cycle.",
          validationErrorMessage: "Start months is required.",
          required: false,
        },
        tableRelated: {
          header: "Start After Hire (Months)",
          accessorKey: "startAfterHireMonths",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Performance Cycles",
    apiEndPoint: "https://api.techbee.et/api/hr/performanceCycles",
    formName: "performanceCycle",
    allowDelete: true,
    createTitle: "Create Performance Cycle",
    sections: ["General"],
    editTitle: "Edit Performance Cycle",
  } as SchemaMeta);

// --- IncidentTypeCreateInput ---

export const incidentTypeSchema = z
  .object({
    id,
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          section: "General",
          label: "Description",
          placeholder: "Enter description",
          description: "A description of the incident type.",
          validationErrorMessage: "Description is required.",
          required: false,
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    impactAffectsScore: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Impact Affects Score",
          description:
            "Indicates if this incident type affects performance scores.",
        },
        tableRelated: {
          header: "Impact Affects Score",
          accessorKey: "impactAffectsScore",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Is Active",
          description: "Indicates if the incident type is active.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the incident type.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    organizationNodeId: orgID("General"),

    policyUrl: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          section: "General",
          label: "Policy URL",
          placeholder: "Enter policy URL",
          description: "URL to the related policy document.",
          validationErrorMessage: "Policy URL is required.",
          required: false,
        },
        tableRelated: {
          header: "Policy URL",
          accessorKey: "policyUrl",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Incident Types",
    apiEndPoint: "https://api.techbee.et/api/hr/incidentTypes",
    formName: "incidentType",
    allowDelete: true,
    createTitle: "Create Incident Type",
    sections: ["General"],
    editTitle: "Edit Incident Type",
  } as SchemaMeta);

// --- IncidentStatusCreateInput ---

export const incidentStatusSchema = z
  .object({
    id,
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Is Active",
          description: "Indicates if the status is active.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    isTerminal: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Is Terminal",
          description: "Indicates if this is a final (terminal) status.",
        },
        tableRelated: {
          header: "Is Terminal",
          accessorKey: "isTerminal",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the incident status.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    organizationNodeId: orgID("General"),
    ...dateTime,
  })
  .meta({
    tableName: "Incident Statuses",
    apiEndPoint: "https://api.techbee.et/api/hr/incidentStatuses",
    formName: "incidentStatus",
    allowDelete: true,
    createTitle: "Create Incident Status",
    sections: ["General"],
    editTitle: "Edit Incident Status",
  } as SchemaMeta);

// --- IncidentActionCreateInput ---

export const incidentActionSchema = z
  .object({
    id,
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Is Active",
          description: "Indicates if the action is active.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the incident action.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    organizationNodeId: orgID("General"),
    ...dateTime,
  })
  .meta({
    tableName: "Incident Actions",
    apiEndPoint: "https://api.techbee.et/api/hr/incidentActions",
    formName: "incidentAction",
    allowDelete: true,
    createTitle: "Create Incident Action",
    sections: ["General"],
    editTitle: "Edit Incident Action",
  } as SchemaMeta);

// --- BenefitPlanCreateInput ---

export const benefitPlanSchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Code",
        placeholder: "Enter plan code",
        description: "A unique code for the benefit plan.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          section: "General",
          label: "Description",
          placeholder: "Enter plan description",
          description: "A detailed description of the benefit plan.",
          validationErrorMessage: "Description must be a string.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          section: "General",
          label: "Is Active",
          description: "Indicates if the benefit plan is currently active.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Plan Name",
        placeholder: "Enter plan name",
        description: "The name of the benefit plan.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    provider: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          section: "General",
          label: "Provider",
          placeholder: "Enter provider name",
          description: "The provider of the benefit plan.",
          validationErrorMessage: "Provider must be a string.",
        },
        tableRelated: {
          header: "Provider",
          accessorKey: "provider",
        },
      } as FieldLevelMeta),
    typeField: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Type",
        placeholder: "Select benefit type",
        description: "The category or type of the benefit plan.",
        validationErrorMessage: "Benefit type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            "HealthInsurance",
            "RetirementPlan",
            "TravelAllowance",
            "Wellness",
            "Education",
            "Other",
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "typeField",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Benefit Plans",
    apiEndPoint: "https://api.techbee.et/api/hr/benefitPlans",
    formName: "benefitPlan",
    allowDelete: true,
    createTitle: "Create Benefit Plan",
    sections: ["General"],
    editTitle: "Edit Benefit Plan",
  } as SchemaMeta);
