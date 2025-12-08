import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  dateCell,
  preprocessedDate,
  preprocessedDateTime,
  preprocessedTime,
  timeCell,
} from "@/lib/schemas/time-parser";
import { complianceRequirementSchema } from "./compliance-requirement";
import { complianceSchema } from "./compliance";

// Assuming schemas exist for related entities for 'Create New' functionality
// const complianceSchema = z.any();
// const complianceRequirementSchema = z.any();

// --- Field Definitions for Relations ---

// Inner schema for Compliance relation (required single object)
const complianceUniqueInputSchema = z.object({
  id: id.meta({
    formRelated: {
      inputType: "auto-complete",
      section: "Audit Details",
      label: "Parent Compliance",
      placeholder: "Select the Parent Compliance",
      description: "The main compliance record this audit is associated with.",
      validationErrorMessage: "Parent Compliance is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/compliances", // Hypothetical endpoint
        getOptionsLabel: (value) => value.name, // Assuming the object has a name field
        getOptionsValue: (value) => value.id,
        // createSchema: complianceSchema,
        // allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Compliance ID",
      accessorKey: "id",
      enableHiding: true,
    },
  } as FieldLevelMeta),
});

// Inner schema for Compliance Requirement relation (optional single object)
const requirementUniqueInputSchema = z.object({
  id: id.meta({
    formRelated: {
      inputType: "auto-complete",
      section: "Audit Details",
      label: "Specific Requirement",
      placeholder: "Select the specific requirement (optional)",
      description:
        "The compliance requirement, if this is an audit of a single item.",
      validationErrorMessage: "Requirement ID is optional.",
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/complianceRequirements", // Hypothetical endpoint
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
        // createSchema: complianceRequirementSchema,
        // allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Requirement ID",
      accessorKey: "id",
      enableHiding: true,
    },
  } as FieldLevelMeta),
});

// --- Main Schema ---

export const complianceAuditSchema = z
  .object({
    // id, // Assuming 'id' comes from common-schemas if it exists on the record
    // ...dateTime,

    // Object Relations
    compliance: complianceUniqueInputSchema.meta({
      formRelated: {
        inputType: "object",
        section: "Audit Details",
      },
      tableRelated: {
        header: "Parent Compliance",
        accessorKey: "compliance.name", // Display name of the compliance
      },
    } as FieldLevelMeta),

    requirement: requirementUniqueInputSchema
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
          section: "Audit Details",
        },
        tableRelated: {
          header: "Specific Requirement",
          accessorKey: "requirement.name", // Display name of the requirement
          enableHiding: true,
        },
      } as FieldLevelMeta),

    // Scalar Fields (Strings)
    performedBy: z
      .string()
      .min(1, "Performer name cannot be empty.")
      .meta({
        formRelated: {
          section: "Audit Details",
          inputType: "auto-complete",
          label: "Performed By",
          placeholder: "Enter name or ID of the auditor/team",
          description: "The person or team who conducted the audit.",
          validationErrorMessage: "Performer is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint: "https://hr.api.techbee.et/api/employees", // Hypothetical endpoint
            getOptionsLabel: (value) =>
              `${value.firstName} ${value.fatherName}`,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Performed By",
          accessorKey: "performedBy",
        },
      } as FieldLevelMeta),

    organizationNodeId: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Audit Details",
          inputType: "auto-complete",
          label: "Org. Node ID",
          placeholder: "Enter Organization Unit ID",
          description:
            "The ID of the organizational unit (e.g., department, location) audited.",
          validationErrorMessage: "Organization Node ID is optional.",
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint: "https://core.api.techbee.et/api/organizationNodes", // Hypothetical endpoint
            getOptionsLabel: (opt) => opt.name + " " + opt.code,
            getOptionsValue: (opt) => opt.id,
          },
        },
        tableRelated: {
          header: "Org Unit",
          accessorKey: "organizationNodeId",
          enableHiding: true,
        },
      } as FieldLevelMeta),

    findings: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Results",
          inputType: "text-area",
          label: "Findings",
          placeholder: "Detail the audit findings.",
          description: "Detailed notes and observations from the audit.",
          validationErrorMessage: "Findings should be valid text.",
        },
        tableRelated: {
          header: "Findings",
          accessorKey: "findings",
          size: 300,
          enableHiding: true,
        },
      } as FieldLevelMeta),

    // Enum Field
    result: z.enum(["Passed", "IssuesFound", "Failed"]).meta({
      formRelated: {
        section: "Results",
        inputType: "auto-complete",
        label: "Audit Result",
        placeholder: "Select the final result",
        description: "The final conclusion of the audit.",
        validationErrorMessage: "Audit Result is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Passed", "IssuesFound", "Failed"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Result",
        accessorKey: "result",
      },
    } as FieldLevelMeta),

    // Scalar Fields (Numbers)
    totalChecked: z
      .number()
      .min(0, "Must be zero or greater.")
      .meta({
        formRelated: {
          section: "Results",
          inputType: "number-field",
          label: "Total Checked Items",
          placeholder: "Enter total number of items checked",
          description:
            "The total number of requirements, tasks, or items reviewed.",
          validationErrorMessage:
            "Total Checked is required and must be a number.",
          required: true,
        },
        tableRelated: {
          header: "Total Checked",
          accessorKey: "totalChecked",
        },
      } as FieldLevelMeta),

    nonCompliant: z
      .number()
      .min(0, "Must be zero or greater.")
      .meta({
        formRelated: {
          section: "Results",
          inputType: "number-field",
          label: "Non-Compliant Count",
          placeholder: "Enter number of non-compliant items",
          description: "The count of items that failed compliance checks.",
          validationErrorMessage:
            "Non-Compliant count is required and must be a number.",
          required: true,
        },
        tableRelated: {
          header: "Non-Compliant",
          accessorKey: "nonCompliant",
        },
      } as FieldLevelMeta),

    complianceRate: z
      .number()
      .min(0)
      .max(100)
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Results",
          inputType: "number-field",
          label: "Compliance Rate (%)",
          placeholder: "Enter compliance percentage (0-100)",
          description: "The calculated percentage of compliance.",
          validationErrorMessage:
            "Compliance Rate must be a number between 0 and 100.",
        },
        tableRelated: {
          header: "Rate (%)",
          accessorKey: "complianceRate",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Compliance Audits",
    apiEndPoint: "https://hr.api.techbee.et/api/complianceAudits", // Hypothetical API endpoint
    formName: "complianceAudit",
    allowDelete: true,
    createTitle: "Create New Compliance Audit",
    sections: ["Audit Details", "Results"],
    editTitle: "Edit Compliance Audit",
  } as SchemaMeta);

export type ComplianceAuditSchema = z.infer<typeof complianceAuditSchema>;
