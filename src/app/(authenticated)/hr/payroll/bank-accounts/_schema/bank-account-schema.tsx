import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { bankSchema } from "@/lib/schemas/bank";
import { bankBranchSchema } from "@/lib/schemas/bank-branch";

// Placeholder schemas for relations
// In a real application, these would be imported from their respective files.

export const bankAccountSchema = z
  .object({
    // Account Number - Required String
    accountNumber: z.string().meta({
      formRelated: {
        section: "Account Details",
        inputType: "text-field",
        label: "Account Number",
        placeholder: "Enter account number",
        description: "The employee's bank account number.",
        validationErrorMessage: "Account number is required.",
        required: true,
      },
      tableRelated: {
        header: "Account No.",
        accessorKey: "accountNumber",
      },
    } as FieldLevelMeta),

    // Account Type - Required String
    accountType: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Account Details",
          inputType: "text-field",
          label: "Account Type",
          placeholder: "e.g., Savings, Checking",
          description: "The type of bank account.",
          validationErrorMessage: "Account type is required.",
          required: true,
        },
        tableRelated: {
          header: "Type",
          accessorKey: "accountType",
        },
      } as FieldLevelMeta),

    // Bank - WhereUniqueInput -> Auto-complete (Single)
    bank: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Account Details",
              label: "Bank",
              placeholder: "Select bank",
              description: "The bank where the account is held.",
              validationErrorMessage: "Bank is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/banks", // Placeholder API endpoint
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                createSchema: bankSchema, // Assuming BankSchema is defined/imported
                allowCreateNew: true,
              },
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
          header: "Bank",
          accessorKey: "bank.name", // Assuming the bank object has a 'name' field
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),

    // Branch - WhereUniqueInput -> Auto-complete (Single)
    branch: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Account Details",
              label: "Branch",
              placeholder: "Select branch",
              description: "The branch where the account is domiciled.",
              validationErrorMessage: "Branch is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/bankBranches", // Placeholder API endpoint
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                createSchema: bankBranchSchema, // Assuming BankBranchSchema is defined/imported
                allowCreateNew: true,
              },
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
          header: "Branch",
          accessorKey: "branch.name", // Assuming the branch object has a 'name' field
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),

    // Employee - WhereUniqueInput -> Auto-complete (Single)
    // NOTE: This is often omitted or handled implicitly on the backend for nested forms,
    // but kept here as per the cleaned schema structure.
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Related Entity",
            label: "Employee",
            placeholder: "Select employee",
            description: "The employee who owns this account.",
            validationErrorMessage: "Employee is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/employees", // Placeholder API endpoint
              getOptionsLabel: (value) =>
                `${value?.firstName || ""} ${value?.fatherName || ""} ${
                  value?.grandFatherName || ""
                }`,
              getOptionsValue: (value) => value.id,
              //   createSchema: EmployeeSchema, // Assuming EmployeeSchema is defined/imported
              allowCreateNew: false, // Employees typically shouldn't be created from a bank form
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
          hidden: true, // Often hidden in a nested form context
        },
        tableRelated: {
          header: "Employee",
          accessorFn(originalRow) {
            return `${originalRow?.employee?.firstName || ""} ${
              originalRow?.employee?.fatherName || ""
            } ${originalRow?.employee?.grandFatherName || ""}`;
          },
        },
      } as FieldLevelMeta),

    // isPrimary - Boolean
    isPrimary: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Account Details",
          inputType: "boolean-field",
          label: "Primary Account",
          description: "Mark as the main account for payroll/transactions.",
        },
        tableRelated: {
          header: "Primary",
          accessorKey: "isPrimary",
        },
      } as FieldLevelMeta),

    // swiftCode - Optional String
    swiftCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "International",
          inputType: "text-field",
          label: "SWIFT Code",
          placeholder: "Enter SWIFT code (optional)",
          description: "Required for international transactions.",
          validationErrorMessage: "Invalid SWIFT code format.",
        },
        tableRelated: {
          header: "SWIFT",
          accessorKey: "swiftCode",
        },
      } as FieldLevelMeta),

    // Include common fields (id and timestamps)
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Employee Bank Accounts",
    apiEndPoint: "https://api.techbee.et/api/hr/employeebankaccounts", // Placeholder API endpoint
    formName: "bankAccountForm",
    allowDelete: true,
    createTitle: "Create Bank Account",
    sections: ["Account Details", "Related Entity", "International"],
    editTitle: "Edit Bank Account",
  } as SchemaMeta);
