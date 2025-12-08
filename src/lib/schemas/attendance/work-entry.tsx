import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  preprocessedDateTime,
  dateCell,
  timeCell,
  preprocessedTime,
} from "@/lib/schemas/time-parser";
import { employeeId } from "../nested-reusable-objects";
export const workEntrySchema = z
  .object({
    id,
    attendanceSource: z
      .object({
        id: z.string().meta({} as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        tableRelated: {
          header: "Attendance Source",
          accessorKey: "attendanceSource.method",
        },
      } as FieldLevelMeta),
    date: preprocessedDateTime.meta({
      formRelated: {
        section: "Work Entry Details",
        inputType: "date-time",
        label: "Date",
        placeholder: "Select date and time",
        description: "The date and time of the work entry.",
        validationErrorMessage: "Date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Date",
        accessorKey: "date",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Work Entry Details",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter a description",
          description: "A detailed description of the work entry.",
          validationErrorMessage: "Description is optional.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    employee: employeeId("Relations"),
    hours: z.number().meta({
      formRelated: {
        section: "Work Entry Details",
        inputType: "number-field",
        label: "Hours",
        placeholder: "Enter hours worked",
        description: "The number of hours for this work entry.",
        validationErrorMessage: "Hours is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Hours",
        accessorKey: "hours",
      },
    } as FieldLevelMeta),
    retroForPeriod: z
      .object({})
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
          section: "Work Entry Details",
          label: "Retroactive for Period",
          description: "Details for retroactive work entries.",
          validationErrorMessage: "Retroactive period details are optional.",
        },
        tableRelated: {
          header: "Retroactive Period",
          accessorKey: "retroForPeriod",
        },
      } as FieldLevelMeta),
    status: z.enum(["Draft", "Validated", "Conflict"]).meta({
      formRelated: {
        section: "Work Entry Details",
        inputType: "auto-complete",
        label: "Status",
        placeholder: "Select status",
        description: "The status of the work entry.",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Draft", "Validated", "Conflict"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),
    timeOffType: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Time Off Type",
              placeholder: "Select time off type",
              description: "The type of time off for this work entry.",
              validationErrorMessage: "Time off type is optional.",
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://hr.api.techbee.et/api/timeOffTypes",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                allowCreateNew: true,
              },
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Time Off Type",
          accessorKey: "timeOffType.name",
        },
      } as FieldLevelMeta),
    type: z.enum(["Attendance", "Overtime", "Leave", "Retroactive"]).meta({
      formRelated: {
        section: "Work Entry Details",
        inputType: "auto-complete",
        label: "Type",
        placeholder: "Select type",
        description: "The type of work entry.",
        validationErrorMessage: "Type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Attendance", "Overtime", "Leave", "Retroactive"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),
    overtimeKind: z.enum(["Normal", "Weekend", "Holiday", "Night"]).meta({
      formRelated: {
        section: "Work Entry Details",
        inputType: "auto-complete",
        label: "Overtime Kind",
        placeholder: "Select overtime kind",
        description: "The type of overtime this policy segment defines.",
        validationErrorMessage: "Overtime kind is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { id: "Normal", name: "Normal" },
            { id: "Weekend", name: "Weekend" },
            { id: "Holiday", name: "Holiday" },
            { id: "Night", name: "Night" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Kind",
        accessorKey: "overtimeKind",
      },
    } as FieldLevelMeta),
    startTime: preprocessedTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Start Time",
          placeholder: "Select start time",
          description: "The time the overtime period begins.",
          validationErrorMessage: "Start Time is required.",
          section: "Work Entry Details",
          required: true,
          date: {
            type: "time-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Start Time",
          accessorKey: "startTime",
          Cell: ({ cell }) => timeCell({ cell }),
        },
      } as FieldLevelMeta),
    endTime: preprocessedTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "End Time",
          placeholder: "Select end time",
          description: "The time the overtime period ends.",
          validationErrorMessage: "End Time is required.",
          section: "Work Entry Details",
          required: true,
          date: {
            type: "time-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "End Time",
          accessorKey: "endTime",
          Cell: ({ cell }) => timeCell({ cell }),
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Work Entry",
    apiEndPoint: "https://hr.api.techbee.et/api/workEntries",
    formName: "workEntry",
    allowDelete: true,

    createTitle: "Create Work Entry",
    sections: ["Work Entry Details", "Relations"],
    editTitle: "Edit Work Entry",
  } as SchemaMeta);
