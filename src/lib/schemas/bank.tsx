import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";

export const bankSchema = z
  .object({
    id,

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    code: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Code",
          placeholder: "Enter code",
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(true)
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Active",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Bank",
    apiEndPoint: "https://api.techbee.et/api/hr/banks",
    formName: "bank",
    sections: ["General"],
    createTitle: "Create Bank",
    allowDelete: true,
    editTitle: "Edit Bank",
  } as SchemaMeta);

export type BankSchema = z.infer<typeof bankSchema>;
