import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";

export const titleSchema = z
  .object({
    id,
    ...dateTime,
    code: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter title code",
        description: "Internal code for the title.",
        validationErrorMessage: "Code is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter title name",
        description: "The name of the title.",
        validationErrorMessage: "Name is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(true)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Active",
          description: "Whether the title is active.",
          validationErrorMessage: "Active status is required.",
          section: "General",
          required: true,
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Titles",
    apiEndPoint: "https://api.techbee.et/api/hr/titles",
    formName: "title",
    sections: ["General"],
    allowDelete: true,
    createTitle: "Create Title",
    editTitle: "Edit Title",
  } as SchemaMeta);

export type TitleSchema = z.infer<typeof titleSchema>;
