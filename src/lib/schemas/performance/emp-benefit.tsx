import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDate } from "@/lib/schemas/time-parser";
import { employeeSchema } from "../emp-for-contract";
import { employeeId } from "../nested-reusable-objects";
import { benefitplanSchema } from "@/app/(authenticated)/hr/_schemas/benefit-plans";

export const employeeBenefitSchema = z
  .object({
    id,
    benefitPlan: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Benefit Plan",
            placeholder: "Select benefit plan",
            description:
              "The benefit plan associated with the employee benefit.",
            validationErrorMessage: "Benefit plan is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/benefitPlans",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: benefitplanSchema,
            },
          },
          tableRelated: {
            header: "Benefit Plan",
            accessorKey: "benefitPlan.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Benefit Plan",
          accessorKey: "benefitPlan.name",
        },
      } as FieldLevelMeta),

    coverageAmount: z.number().meta({
      formRelated: {
        inputType: "number-field",
        section: "General",
        label: "Coverage Amount",
        placeholder: "Enter coverage amount",
        description: "The monetary amount of the benefit coverage.",
        validationErrorMessage: "Coverage amount is required.",
        required: true,
      },
      tableRelated: {
        header: "Coverage Amount",
        accessorKey: "coverageAmount",
      },
    } as FieldLevelMeta),

    employee: employeeId("General"),

    enrollmentDate: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Enrollment Date",
        placeholder: "Select enrollment date",
        description: "The date the employee enrolled in the benefit.",
        validationErrorMessage: "Enrollment date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Enrollment Date",
        accessorKey: "enrollmentDate",
      },
    } as FieldLevelMeta),

    notes: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          section: "General",
          label: "Notes",
          placeholder: "Add notes",
          description: "Additional notes about the employee benefit.",
          validationErrorMessage: "Notes are required.",
          required: false,
        },
        tableRelated: {
          header: "Notes",
          accessorKey: "notes",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Employee Benefits",
    apiEndPoint: "https://api.techbee.et/api/hr/employeeBenefits",
    formName: "employeeBenefit",
    allowDelete: true,
    createTitle: "Create Employee Benefit",
    sections: ["General"],
    editTitle: "Edit Employee Benefit",
  } as SchemaMeta);
