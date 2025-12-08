import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser"; // Required for date handling

export const pensionPolicySchema = z
  .object({
    // effectiveFrom: Date (Transformed from string)
    effectiveFrom: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        section: "General",
        label: "Effective From",
        placeholder: "Select effective start date",
        description: "The date this rate configuration becomes active.",
        validationErrorMessage: "Effective date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Effective From",
        accessorKey: "effectiveFrom",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),

    // employeeRate: number
    employeeRate: z
      .number()
      .min(0, "Rate cannot be negative.")
      .max(100, "Rate cannot exceed 100.")
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Employee Rate (%)",
          placeholder: "Enter employee contribution rate",
          description: "The percentage rate contributed by the employee.",
          validationErrorMessage: "Employee rate is required (0-100).",
          required: true,
        },
        tableRelated: {
          header: "Emp. Rate (%)",
          accessorKey: "employeeRate",
          Cell: ({ cell }) => `${cell.getValue()}%`,
        },
      } as FieldLevelMeta),

    // employerRate: number
    employerRate: z
      .number()
      .min(0, "Rate cannot be negative.")
      .max(100, "Rate cannot exceed 100.")
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Employer Rate (%)",
          placeholder: "Enter employer contribution rate",
          description: "The percentage rate contributed by the employer.",
          validationErrorMessage: "Employer rate is required (0-100).",
          required: true,
        },
        tableRelated: {
          header: "Er. Rate (%)",
          accessorKey: "employerRate",
          Cell: ({ cell }) => `${cell.getValue()}%`,
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
          description:
            "Indicates if this rate configuration is currently in use.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    // Include common fields (id, createdAt, updatedAt)
    // ...id,
    // ...dateTime,
  })
  .meta({
    tableName: "Pension Policies",
    apiEndPoint: "https://api.techbee.et/api/hr/pensionPolicies", // Placeholder endpoint
    formName: "contributionRateForm",
    allowDelete: true,
    createTitle: "Create Pension Policy",
    editTitle: "Edit Pension Policy",
    sections: ["General"],
  } as SchemaMeta);
