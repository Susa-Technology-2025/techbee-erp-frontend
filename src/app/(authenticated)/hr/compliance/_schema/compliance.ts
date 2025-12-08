import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { approvalDocumentTypeSchema } from "@/lib/schemas/core/approval-doc-type"; // Assuming this exists for the requirement object.
import {
  dateCell,
  preprocessedDate,
  preprocessedDateTime,
  preprocessedTime,
} from "@/lib/schemas/time-parser";
import { ComplianceDetailModal } from "../components/compliance-detail-modal";

// 1. Define the unique input object schema for related entities
const complianceRequirementUniqueInputSchema = z.object({
  id: id.meta({
    formRelated: {
      inputType: "auto-complete",
      section: "General",
      label: "Requirement ID",
      placeholder: "Select Requirement",
      description: "The ID of the related compliance requirement.",
      validationErrorMessage: "Requirement ID is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        // Hypothetical endpoint for fetching compliance requirements
        getEndpoint: "https://hr.api.techbee.et/api/complianceRequirements",
        getOptionsLabel: (value) => value.name, // Assuming the object has a name field
        getOptionsValue: (value) => value.id,
        // Assuming there is a schema for creating a requirement
        createSchema: approvalDocumentTypeSchema,
        allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Requirement ID",
      accessorKey: "id",
      // Hide this ID field in the table view
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnOrdering: false,
      enableHiding: true,
    },
  } as FieldLevelMeta),
});

// 2. Define the main compliance schema
export const complianceSchema = z
  .object({
    // Inherited from common schemas (optional but typically useful)
    // id,
    // ...dateTime,

    code: z
      .string()
      .min(1, "Code cannot be empty.")
      .max(255)
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Code",
          placeholder: "Enter compliance code",
          description: "A unique, short code for the compliance item.",
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
          label: "Name",
          placeholder: "Enter compliance name",
          description: "The official name of the compliance item.",
          validationErrorMessage: "Name is required.",
          required: true,
        },
        tableRelated: {
          header: "Name",
          accessorKey: "name",
        },
      } as FieldLevelMeta),

    description: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Provide a detailed description",
          description: "A detailed explanation of the compliance item.",
          validationErrorMessage:
            "Description is optional but should be valid text.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
          // Truncate long descriptions in the table
          size: 300,
        },
      } as FieldLevelMeta),

    type: z
      .enum(["Legal", "Safety", "Policy", "Certification", "Training", "Other"])
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Type",
          placeholder: "Select compliance type",
          description: "The category of the compliance item.",
          validationErrorMessage: "Compliance type is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false, // Not fetching from an API
            options: [
              "Legal",
              "Safety",
              "Policy",
              "Certification",
              "Training",
              "Other",
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
        tableRelated: {
          header: "Type",
          accessorKey: "type",
        },
      } as FieldLevelMeta),

    // WhereUniqueInput for audits - assumed to be an array of objects
    audits: z
      .array(
        z.object({
          id: z.string(),
        })
      )
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object", // Use object for array of relations
          hidden: true, // Typically, a create form doesn't connect existing audits
          //   section: "Related Entities",
          label: "Audits",
        },
        tableRelated: {
          header: "Audits",
          accessorKey: "audits",
          // You might use a custom cell to display the count of audits
          Cell: ({ cell }) =>
            cell.getValue() ? (cell.getValue() as any[]).length : 0,
        },
      } as FieldLevelMeta),

    // WhereUniqueInput for requirements - assumed to be an array of objects
    // Since this is a connection field, we treat it as an array of IDs for the form.
    requirements: z
      .array(complianceRequirementUniqueInputSchema)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "array", // Use 'array' to manage multiple related objects/IDs
          //   section: "Related Entities",
          label: "Compliance Requirements",
          description: "Connect existing compliance requirements.",
          validationErrorMessage: "This field is optional.",
        },
        tableRelated: {
          header: "Requirements",
          accessorKey: "requirements",
          // You might use a custom cell to display the count of requirements
          Cell: ({ cell }) =>
            cell.getValue() ? (cell.getValue() as any[]).length : 0,
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Compliance Records",
    apiEndPoint: "https://hr.api.techbee.et/api/compliances", // Hypothetical API endpoint
    formName: "compliance",
    allowDelete: true,
    createTitle: "Create New Compliance Record",
    sections: ["General"],
    editTitle: "Edit Compliance Record",
    DetailModal: ComplianceDetailModal,
  } as SchemaMeta);

export type ComplianceSchema = z.infer<typeof complianceSchema>;
