import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";
import { format, isValid, parse } from "date-fns";

// Preprocess strings into Date objects for MUI TimePicker
const parseTimeForPicker = (val: unknown): Date | null => {
  if (val instanceof Date && isValid(val)) return val;

  if (typeof val === "string") {
    // Try ISO string first
    let date = new Date(val);
    if (isValid(date)) return date;

    // Try parsing time-only string like "20:45"
    date = parse(val, "HH:mm", new Date());
    if (isValid(date)) return date;
  }

  return null;
};

// Preprocessed Zod date schema
const preprocessedDate = z.preprocess(parseTimeForPicker, z.date());

export const shiftSchema = z
  .object({
    id,

    code: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter shift code",
        description: "Internal code for the shift.",
        validationErrorMessage: "Code is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter shift name",
        description: "The name of the shift.",
        validationErrorMessage: "Name is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    startTime: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Start Time",
        placeholder: "Select shift start time",
        description: "Start time of the shift.",
        validationErrorMessage: "Start time is required.",
        section: "General",
        required: true,
        date: { type: "time-only", min: undefined, max: undefined },
      },
      tableRelated: {
        header: "Start Time",
        accessorKey: "startTime",
        Cell: ({ cell }: any) => {
          const date = parseTimeForPicker(cell.getValue());
          return date ? format(date, "h:mm a") : "";
        },
      },
    } as FieldLevelMeta),

    endTime: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "End Time",
        placeholder: "Select shift end time",
        description: "End time of the shift.",
        validationErrorMessage: "End time is required.",
        section: "General",
        required: true,
        date: { type: "time-only", min: undefined, max: undefined },
      },
      tableRelated: {
        header: "End Time",
        accessorKey: "endTime",
        Cell: ({ cell }: any) => {
          const date = parseTimeForPicker(cell.getValue());
          return date ? format(date, "h:mm a") : "";
        },
      },
    } as FieldLevelMeta),

    isDefault: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Default Shift",
          description: "Whether this shift is the default shift.",
          validationErrorMessage: "Default status is required.",
          section: "General",
          required: true,
        },
        tableRelated: {
          header: "Default",
          accessorKey: "isDefault",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Shifts",
    apiEndPoint: "https://api.techbee.et/api/hr/shifts",
    formName: "shift",
    sections: ["General"],
    allowDelete: true,
    createTitle: "Create Shift",
    editTitle: "Edit Shift",
  } as SchemaMeta);

export type ShiftSchema = z.infer<typeof shiftSchema>;
