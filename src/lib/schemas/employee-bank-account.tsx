import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { id } from "./common-schemas";
import { employeeId } from "./nested-reusable-objects";
import { bankSchema } from "./bank";
import { bankBranchSchema } from "./bank-branch";

export const employeeBankAccountSchema = z
  .object({
    id,

    accountNumber: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Account Number",
        placeholder: "Enter account number",
        description: "The employee's bank account number.",
        validationErrorMessage: "Account number is required.",
        required: true,
      },
      tableRelated: {
        header: "Account Number",
        accessorKey: "accountNumber",
      },
    } as FieldLevelMeta),
    accountType: z.string().optional().nullable().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Account Type",
        description: "Type of the bank account.",
        validationErrorMessage: "Account type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Savings", "Checking", "Current", "Other"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Account Type",
        accessorKey: "accountType",
      },
    } as FieldLevelMeta),
    employee: employeeId("General"),
    bank: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Bank",
            placeholder: "Select bank",
            description: "The bank this employee belongs to.",
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
        } as FieldLevelMeta)
      .optional()
      .nullable(),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Bank ",
          accessorKey: "bank.code",
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),

    bankBrach: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            conditional: { dependsOn: "bank.id" },
            label: "Bank Branch",
            placeholder: "Select bank Branch",
            description: "The bank this branch belongs to.",
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: true,
              createSchema: bankBranchSchema,
              getEndpoint: "https://api.techbee.et/api/hr/bankBranches",
              dynamicGetEndPoint: (dependsOn) =>
                `https://api.techbee.et/api/hr/bankBranches?where[bank][id]=${dependsOn}`,
              getOptionsLabel: (opt) => opt.name,
              getOptionsValue: (opt) => opt.id,
            },
          },
          tableRelated: {
            header: "Bank",
            accessorKey: "bank.name",
          },
        } as FieldLevelMeta)
      .optional()
      .nullable(),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Bank ",
          accessorKey: "bank.code",
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),

    isPrimary: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Primary Account",
          description:
            "Indicates if this is the employee's primary bank account.",
          validationErrorMessage: "Primary account flag is required.",
          required: true,
        },
        tableRelated: {
          header: "Primary Account",
          accessorKey: "isPrimary",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Employee Bank Accounts",
    apiEndPoint: "https://api.techbee.et/api/hr/employeeBankAccounts",
    formName: "employeeBankAccount",
    createTitle: "Create Employee Bank Account",
    allowDelete: true,
    sections: ["General"],
    editTitle: "Edit Employee Bank Account",
  } as SchemaMeta);

export type EmployeeBankAccountSchema = z.infer<
  typeof employeeBankAccountSchema
>;
