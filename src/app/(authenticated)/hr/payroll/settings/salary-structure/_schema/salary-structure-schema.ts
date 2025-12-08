import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { organizationSchema } from "@/lib/schemas/organization-node";

// Placeholder schema for the Organization Node entity which is used in auto-complete

export const salaryStructureSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required.")
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Name",
          placeholder: "Enter the structure name",
          description: "The full, display name of the structure.",
          validationErrorMessage: "Name is required.",
          required: true,
        },
        tableRelated: {
          header: "Name",
          accessorKey: "name",
        },
      } as FieldLevelMeta),

    // code: string
    code: z
      .string()
      .min(1, "Code is required.")
      .max(50, "Code cannot exceed 50 characters.")
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Code",
          placeholder: "Enter unique code (e.g., DEPT-HR)",
          description: "A short, unique identifier for the structure.",
          validationErrorMessage: "Code is required.",
          required: true,
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),

    // name: string (required based on the schema transformed: name*)

    // description: string
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Provide a detailed description",
          description: "A detailed explanation of the structure or entity.",
          validationErrorMessage: "Description is optional.",
          required: false,
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    // organizationNodeId: string (This is a foreign key, treated as an auto-complete ID)
    organizationNodeId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "Hierarchy",
        label: "Organization Node",
        placeholder: "Select parent organizational unit",
        description: "The parent node in the organization's hierarchy.",
        validationErrorMessage: "Organization Node is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes", // Placeholder endpoint
          getOptionsLabel: (value: any) => value.name,
          getOptionsValue: (value: any) => value.id,
          createSchema: organizationSchema,
          allowCreateNew: true,
        },
      },
      tableRelated: {
        // header: "Org. Node ID",
        // accessorKey: "organizationNodeId",
        // You might use a custom cell or accessor for organizationNode.name if joined
        // accessorKey: "organizationNode.name",
      },
    } as FieldLevelMeta),

    // Include common fields (id, createdAt, updatedAt)
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Salary Structures",
    apiEndPoint: "https://api.techbee.et/api/hr/salaryStructures",
    formName: "Salary Structure",
    allowDelete: true,
    createTitle: "Create New Structure",
    editTitle: "Edit Structure",
    sections: ["General", "Hierarchy"],
  } as SchemaMeta);
