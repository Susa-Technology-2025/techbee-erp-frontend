import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { dateTime, id } from "@/lib/schemas/common-schemas";
import { preprocessedDate } from "@/lib/schemas/time-parser";
import { dateCell } from "@/lib/schemas/time-parser";

export const PayrollPeriodSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General Information",
        label: "Name",
        placeholder: "Enter name",
        description: "Name of the payroll period.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          section: "General Information",
          label: "Description",
          placeholder: "Enter description",
          description: "A brief description of the payroll period.",
          validationErrorMessage: "Description is required.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    startDate: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        section: "General Information",
        label: "Start Date",
        placeholder: "Select start date",
        description: "The start date of the payroll period.",
        validationErrorMessage: "Start date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Start Date",
        accessorKey: "startDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    endDate: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        section: "General Information",
        label: "End Date",
        placeholder: "Select end date",
        description: "The end date of the payroll period.",
        validationErrorMessage: "End date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "End Date",
        accessorKey: "endDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    fiscalYearEc: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "number-field",
          section: "General Information",
          label: "Fiscal Year EC",
          placeholder: "Enter fiscal year (EC)",
          description: "The Ethiopian fiscal year.",
          validationErrorMessage: "Fiscal year is required.",
        },
        tableRelated: {
          header: "Fiscal Year (EC)",
          accessorKey: "fiscalYearEc",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Payroll Periods",
    apiEndPoint: "https://api.techbee.et/api/hr/payrollPeriods",
    formName: "payrollPeriod",
    allowDelete: true,
    createTitle: "Create Payroll Period",
    sections: ["General Information"],
    editTitle: "Edit Payroll Period",
  } as SchemaMeta);
