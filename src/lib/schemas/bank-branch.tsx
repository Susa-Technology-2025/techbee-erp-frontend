import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";
import { bankSchema } from "./bank";

export const bankBranchSchema = z
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

    bank: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "General",
              label: "Bank",
              placeholder: "Select bank",
              description: "The bank this branch belongs to.",
              autoComplete: {
                multiple: false,
                async: true,
                allowCreateNew: true,
                createSchema: bankSchema,
                getEndpoint: "https://api.techbee.et/api/hr/banks",
                getOptionsLabel: (opt) => opt.name,
                getOptionsValue: (opt) => opt.id,
              },
            },
            tableRelated: {
              header: "Bank",
              accessorKey: "bank.name",
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Bank ",
          accessorKey: "bank.code",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "BankBranch",
    apiEndPoint: "https://api.techbee.et/api/hr/bankBranches",
    formName: "bankBranch",
    allowDelete: true,
    sections: ["General"],
    createTitle: "Create Bank Branch",
    editTitle: "Edit Bank Branch",
  } as SchemaMeta);

export type BankBranchSchema = z.infer<typeof bankBranchSchema>;
