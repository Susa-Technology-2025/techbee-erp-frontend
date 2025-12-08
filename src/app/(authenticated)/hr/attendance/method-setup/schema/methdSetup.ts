// Second and Final Output: Zod Schema with Meta Data

import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const attendanceMethodSettingSchema = z
  .object({
    id,
    allowAuto: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Allow Auto Check-in",
          description: "Allow automatic check-in based on location.",
        },
        tableRelated: {
          header: "Allow Auto",
          accessorKey: "allowAuto",
        },
      } as FieldLevelMeta),
    allowIntegration: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Allow Integration",
          description: "Allow attendance through third-party integrations.",
        },
        tableRelated: {
          header: "Allow Integration",
          accessorKey: "allowIntegration",
        },
      } as FieldLevelMeta),
    allowKiosk: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Allow Kiosk",
          description: "Allow attendance through a dedicated kiosk.",
        },
        tableRelated: {
          header: "Allow Kiosk",
          accessorKey: "allowKiosk",
        },
      } as FieldLevelMeta),
    allowManual: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Allow Manual Entry",
          description: "Allow manual attendance entry by an administrator.",
        },
        tableRelated: {
          header: "Allow Manual",
          accessorKey: "allowManual",
        },
      } as FieldLevelMeta),
    autoCheckEnabled: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Auto Check Enabled",
          description: "Enable automatic check-in.",
        },
        tableRelated: {
          header: "Auto Check Enabled",
          accessorKey: "autoCheckEnabled",
        },
      } as FieldLevelMeta),
    organizationNodeId: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Organization Node ID",
          placeholder: "Enter organization node ID",
          description: "ID of the associated organization node.",
          validationErrorMessage: "Organization Node ID is required.",
          required: false,
        },
        tableRelated: {
          header: "Organization Node ID",
          accessorKey: "organizationNodeId",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Attendance Method Setting",
    apiEndPoint: "https://hr.api.techbee.et/api/attendanceMethodSettings",
    formName: "attendanceMethodSetting",
    allowDelete: true,
    createTitle: "Create Attendance Method Setting",
    sections: ["General"],
    editTitle: "Edit Attendance Method Setting",
  } as SchemaMeta);
