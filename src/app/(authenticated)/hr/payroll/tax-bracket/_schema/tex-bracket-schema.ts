import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const TaxBracketSchema = z
  .object({
    // deduction: number
    deduction: z
      .number()
      .min(0, "Deduction cannot be negative.")
      .optional()
      .nullable()
      .default(0)
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Deduction Amount",
          placeholder: "Enter fixed deduction",
          description: "A fixed amount to be deducted, if applicable.",
          validationErrorMessage: "Deduction must be a valid number.",
          required: false,
        },
        tableRelated: {
          header: "Deduction",
          accessorKey: "deduction",
          // Format as currency if needed
          // Cell: ({ cell }) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cell.getValue() as number),
        },
      } as FieldLevelMeta),

    // isActive: boolean
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Active",
          description: "Determine if this rule is currently active.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    // maxSalary: number
    maxSalary: z
      .number()
      .min(0, "Maximum salary cannot be negative.")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Maximum Salary/Base",
          placeholder: "Enter maximum value (e.g., of a bracket)",
          description: "The upper limit for this rule's application.",
          validationErrorMessage: "Maximum salary must be a valid number.",
          required: false,
        },
        tableRelated: {
          header: "Max Base",
          accessorKey: "maxSalary",
        },
      } as FieldLevelMeta),

    // minSalary: number
    minSalary: z
      .number()
      .min(0, "Minimum salary cannot be negative.")
      .optional()
      .nullable()
      .default(0)
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Minimum Salary/Base",
          placeholder: "Enter minimum value (e.g., of a bracket)",
          description: "The lower limit for this rule's application.",
          validationErrorMessage: "Minimum salary must be a valid number.",
          required: true,
        },
        tableRelated: {
          header: "Min Base",
          accessorKey: "minSalary",
        },
      } as FieldLevelMeta),

    // rate: number
    rate: z
      .number()
      .min(0, "Rate cannot be negative.")
      .max(100, "Rate cannot exceed 100.")
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Rate (%)",
          placeholder: "Enter percentage rate (e.g., 5.5)",
          description:
            "The percentage rate applied (e.g., tax rate, contribution rate).",
          validationErrorMessage:
            "Rate is required and must be between 0 and 100.",
          required: true,
        },
        tableRelated: {
          header: "Rate (%)",
          accessorKey: "rate",
          Cell: ({ cell }) => `${cell.getValue()}%`,
        },
      } as FieldLevelMeta),

    // Include common fields (id, createdAt, updatedAt)
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Financial Rules/Brackets",
    apiEndPoint: "https://api.techbee.et/api/hr/taxBrackets", // Placeholder endpoint
    formName: "financialRuleForm",
    allowDelete: true,
    createTitle: "Create New Financial Rule",
    editTitle: "Edit Financial Rule",
    sections: ["General"],
  } as SchemaMeta);
