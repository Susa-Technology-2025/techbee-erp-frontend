import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "../types";
import { id } from "../common-schemas";

export const approvalDocumentTypeSchema = z
  .object({
    id,

    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter document type code",
        description: "Unique code for the approval document type.",
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
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter description",
          description: "Detailed description of the approval document type.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    moduleField: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Module Field",
          placeholder: "Enter module field",
          description: "Associated module field for the document type.",
        },
        tableRelated: {
          header: "Module Field",
          accessorKey: "moduleField",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the approval document type.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
  })
  .meta({
    tableName: "Approval Document Types",
    apiEndPoint: "https://api.techbee.et/api/core/approvalDocumentTypes",
    formName: "approvalDocumentType",
    createTitle: "Create Approval Document Type",
    sections: ["General"],
    editTitle: "Edit Approval Document Type",
  } as SchemaMeta);

export type ApprovalDocumentTypeSchema = z.infer<
  typeof approvalDocumentTypeSchema
>;
