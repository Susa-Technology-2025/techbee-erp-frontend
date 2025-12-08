import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  dateCell,
  preprocessedDate,
  preprocessedDateTime,
  preprocessedTime,
} from "@/lib/schemas/time-parser"; // Always included for date types
import { complianceSchema } from "./compliance";
import { complianceTaskSchema } from "./compliance-task";
import { complianceAuditSchema } from "./compliance-audit";
// Assuming a schema exists for related entities to enable 'Create New' in autocomplete
// const complianceSchema = z.any();
// const complianceAuditSchema = z.any();
// const complianceTaskSchema = z.any();

// --- Field Definitions for Relations ---

// Inner schema for compliance relation (single required object)
const complianceUniqueInputSchema = z.object({
  id: id.meta({
    formRelated: {
      inputType: "auto-complete",
      section: "General",
      label: "Parent Compliance",
      placeholder: "Select the Parent Compliance",
      description: "The main compliance record this requirement belongs to.",
      validationErrorMessage: "Parent Compliance is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/compliances", // Hypothetical endpoint
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
        createSchema: () => complianceSchema,
        allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Compliance ID",
      accessorKey: "id",
      // Hide the raw ID from the table
      enableColumnFilter: false,
      enableSorting: false,
      enableHiding: true,
    },
  } as FieldLevelMeta),
});

// Inner schema for tasks relation (array of unique objects)
const complianceTaskUniqueInputSchema = z.object({
  id: z.string().meta({
    formRelated: {
      inputType: "auto-complete",
      section: "Related Entities",
      label: "Task ID",
      placeholder: "Select a Task",
      description: "The ID of a related compliance task.",
      validationErrorMessage: "Task ID is required for connection.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/core/complianceTasks", // Hypothetical endpoint
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
        // createSchema: () => complianceTaskSchema,
        // allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Task ID",
      accessorKey: "id",
      enableHiding: true, // Hide from main table
    },
  } as FieldLevelMeta),
});

// Inner schema for audits relation (array of unique objects)
const complianceAuditUniqueInputSchema = z.object({
  id: z.string().meta({
    formRelated: {
      inputType: "auto-complete",
      section: "Related Entities",
      label: "Audit ID",
      placeholder: "Select an Audit",
      description: "The ID of a related compliance audit.",
      validationErrorMessage: "Audit ID is required for connection.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/complianceAudits", // Hypothetical endpoint
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
        // createSchema: () => complianceAuditSchema,
        // allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Audit ID",
      accessorKey: "id",
      enableHiding: true, // Hide from main table
    },
  } as FieldLevelMeta),
});

// --- Main Schema ---

export const complianceRequirementSchema = z
  .object({
    // id, // Assuming 'id' comes from common-schemas if it exists on the record
    // ...dateTime,

    code: z
      .string()
      .min(1, "Code cannot be empty.")
      .max(255)
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Requirement Code",
          placeholder: "Enter unique code",
          description: "A unique identifier for this compliance requirement.",
          validationErrorMessage: "Code is required.",
          required: true,
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),

    name: z
      .string()
      .min(1, "Name cannot be empty.")
      .max(255)
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Requirement Name",
          placeholder: "Enter name",
          description: "The official name of the compliance requirement.",
          validationErrorMessage: "Name is required.",
          required: true,
        },
        tableRelated: {
          header: "Name",
          accessorKey: "name",
        },
      } as FieldLevelMeta),

    // Object Relation (Required)
    compliance: complianceUniqueInputSchema.meta({
      formRelated: {
        inputType: "object",
        section: "General",
      },
      tableRelated: {
        header: "Parent Compliance",
        // Accessor to show the related compliance's name in the table
        accessorKey: "compliance.name",
      },
    } as FieldLevelMeta),

    entityType: z
      .string()
      .min(1, "Entity Type cannot be empty.")
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Entity Type",
          placeholder: "e.g., Employee, Asset, Department",
          description: "The type of entity this requirement applies to.",
          validationErrorMessage: "Entity Type is required.",
          required: true,
        },
        tableRelated: {
          header: "Entity Type",
          accessorKey: "entityType",
        },
      } as FieldLevelMeta),

    fieldKey: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Field Key",
          placeholder: "Enter field key (optional)",
          description:
            "An optional key for mapping this requirement to a specific field in the entity schema.",
          validationErrorMessage: "Field Key should be a valid string.",
        },
        tableRelated: {
          header: "Field Key",
          accessorKey: "fieldKey",
          enableHiding: true,
        },
      } as FieldLevelMeta),

    description: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Description",
          placeholder: "Provide a detailed description",
          description:
            "A detailed explanation of the compliance requirement and its purpose.",
          validationErrorMessage: "Description is optional.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
          size: 300,
        },
      } as FieldLevelMeta),

    // One-to-Many Relation (Array of Objects)
    tasks: z
      .array(complianceTaskUniqueInputSchema)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "array",
          section: "Related Entities",
          label: "Related Tasks",
          description: "Connect related compliance tasks.",
          validationErrorMessage: "This field is optional.",
        },
        tableRelated: {
          header: "Tasks",
          accessorKey: "tasks",
          Cell: ({ cell }) =>
            cell.getValue() ? (cell.getValue() as any[]).length : 0,
        },
      } as FieldLevelMeta),

    // One-to-Many Relation (Array of Objects)
    audits: z
      .array(complianceAuditUniqueInputSchema)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "array",
          section: "Related Entities",
          label: "Related Audits",
          description: "Connect related compliance audits.",
          validationErrorMessage: "This field is optional.",
        },
        tableRelated: {
          header: "Audits",
          accessorKey: "audits",
          Cell: ({ cell }) =>
            cell.getValue() ? (cell.getValue() as any[]).length : 0,
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Compliance Requirements",
    apiEndPoint: "https://hr.api.techbee.et/api/complianceRequirements", // Hypothetical API endpoint
    formName: "complianceRequirement",
    allowDelete: true,
    createTitle: "Create New Compliance Requirement",
    sections: ["General", "Details"],
    editTitle: "Edit Compliance Requirement",
  } as SchemaMeta);

export type ComplianceRequirementSchema = z.infer<
  typeof complianceRequirementSchema
>;
