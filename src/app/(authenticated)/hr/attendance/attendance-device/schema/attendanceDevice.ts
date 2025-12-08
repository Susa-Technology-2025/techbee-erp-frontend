import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { z } from "zod";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  preprocessedDate,
  preprocessedDateTime,
  preprocessedTime,
  dateCell,
  timeCell,
} from "@/lib/schemas/time-parser";
import { orgology } from "@/lib/schemas/nested-reusable-objects";

export const AttendanceDeviceSchema = z
  .object({
    apiKey: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "API Key",
        placeholder: "Enter API key",
        description: "API key for device authentication.",
        validationErrorMessage: "API key is required.",
        required: true,
      },
      tableRelated: {
        header: "API Key",
        accessorKey: "apiKey",
      },
    } as FieldLevelMeta),

    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter device code",
        description: "Unique code for the attendance device.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

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
          description: "Set the device to active or inactive.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    location: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Location",
        placeholder: "Enter location",
        description: "Physical location of the device.",
        validationErrorMessage: "Location is required.",
        required: true,
      },
      tableRelated: {
        header: "Location",
        accessorKey: "location",
      },
    } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter device name",
        description: "Name of the attendance device.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    organizationNodeId: orgology("General"),

    type: z.enum(["Kiosk", "Biometric", "Integration"]).meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Type",
        placeholder: "Select device type",
        description: "The type of attendance device.",
        validationErrorMessage: "Device type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          allowCreateNew: false,
          options: [
            { value: "Kiosk", label: "Kiosk" },
            { value: "Biometric", label: "Biometric" },
            { value: "Integration", label: "Integration" },
          ],
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),
  })
  .meta({
    tableName: "Attendance Devices",
    apiEndPoint: "https://api.techbee.et/api/hr/attendanceDevices",
    formName: "attendanceDevice",
    allowDelete: true,
    createTitle: "Create Attendance Device",
    sections: ["General"],
    editTitle: "Edit Attendance Device",
  } as SchemaMeta);
