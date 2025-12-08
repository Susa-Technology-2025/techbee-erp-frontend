import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { id } from "./common-schemas";
import { employeeId } from "./nested-reusable-objects";

export const documentSchema = z
  .object({
    id,
    employee: employeeId("General"),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter document title",
        description: "The title of the document.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),

    url: z
      .string()

      .meta({
        formRelated: {
          section: "Attachment",
          inputType: "file",
          label: "File",
          placeholder: "Upload File document URL",
          description: "Please Upload File",
          validationErrorMessage: "file is required.",
          required: true,
          file: {
            allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
            min: 0,
            max: 5242880,
          },
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Documents",
    apiEndPoint: "https://api.techbee.et/api/hr/documents",
    formName: "document",
    createTitle: "Create Document",
    allowDelete: true,
    sections: ["General", "Attachment"],
    editTitle: "Edit Document",
  } as SchemaMeta);

export type DocumentSchema = z.infer<typeof documentSchema>;
