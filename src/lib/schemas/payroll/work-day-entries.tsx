import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDateTime, dateCell } from "@/lib/schemas/time-parser";
import { employeeId } from "../nested-reusable-objects";

export const WorkedDaysEntryCreateSchema = z
  .object({
    id,
    employee: employeeId("General"),
    notes: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Notes",
          placeholder: "Add any relevant notes...",
          description: "Optional notes about the worked days entry.",
          validationErrorMessage: "Notes must be a string.",
        },
        tableRelated: {
          header: "Notes",
          accessorKey: "notes",
        },
      } as FieldLevelMeta),

    periodStart: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Period Start",
        placeholder: "Select start date and time",
        description: "The start date and time of the worked period.",
        validationErrorMessage: "Period Start date/time is required.",
        section: "Period Details",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period Start",
        accessorKey: "periodStart",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    periodEnd: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Period End",
        placeholder: "Select end date and time",
        description: "The end date and time of the worked period.",
        validationErrorMessage: "Period End date/time is required.",
        section: "Period Details",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period End",
        accessorKey: "periodEnd",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    source: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Source",
        placeholder: "Select the source of the data",
        description: "The origin of the worked days data.",
        validationErrorMessage: "Source is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Manual", "Attendance", "Calculated"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Source",
        accessorKey: "source",
      },
    } as FieldLevelMeta),
    workedDays: z
      .number()
      .default(30)
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Worked Days",
          placeholder: "Enter number of worked days",
          description: "The total number of worked days in the period.",
          validationErrorMessage:
            "Worked Days is required and must be a number.",
          required: true,
        },
        tableRelated: {
          header: "Worked Days",
          accessorKey: "workedDays",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Worked Days Entry",
    apiEndPoint: "https://api.techbee.et/api/hr/workedDaysEntries",
    formName: "workedDaysEntry",
    allowDelete: true,
    createTitle: "Create Worked Days Entry",
    sections: ["General", "Period Details"],
    editTitle: "Edit Worked Days Entry",
  } as SchemaMeta);
