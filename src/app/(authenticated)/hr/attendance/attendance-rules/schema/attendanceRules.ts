// Second and Final Output: Zod Schema with Meta Data

import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const attendanceRuleSchema = z
  .object({
    approveByManager: z
      .boolean()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "chips", // Assuming a boolean array is handled as chips
          label: "Approve By Manager",
          placeholder: "Select approval options",
          description: "Whether attendance needs manager approval.",
          validationErrorMessage: "Approval options are required.",
          required: false,
        },
        tableRelated: {
          header: "Approve By Manager",
          accessorKey: "approveByManager",
        },
      } as FieldLevelMeta),
    extraApprovalRequired: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Extra Approval Required",
          description: "Whether extra approval is required for attendance.",
        },
        tableRelated: {
          header: "Extra Approval Required",
          accessorKey: "extraApprovalRequired",
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
          description: "Status of the attendance rule.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter rule name",
        description: "Name of the attendance rule.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    organizationNodeId: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Organization Node",
          placeholder: "Select organization node",
          description: "The organization node the rule applies to.",
          validationErrorMessage: "Organization Node is required.",
          required: false,
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
            allowCreateNew: true,
          },
        },
        tableRelated: {
          header: "Organization Node ID",
          accessorKey: "organizationNodeId",
        },
      } as FieldLevelMeta),
    toleranceLoginMinutes: z
      .number()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Tolerance Login Minutes",
          placeholder: "Enter tolerance for login",
          description: "Tolerance in minutes for late login.",
          validationErrorMessage: "Tolerance login minutes must be a number.",
          required: false,
        },
        tableRelated: {
          header: "Tolerance Login Minutes",
          accessorKey: "toleranceLoginMinutes",
        },
      } as FieldLevelMeta),
    toleranceLogoutMinutes: z
      .number()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Tolerance Logout Minutes",
          placeholder: "Enter tolerance for logout",
          description: "Tolerance in minutes for early logout.",
          validationErrorMessage: "Tolerance logout minutes must be a number.",
          required: false,
        },
        tableRelated: {
          header: "Tolerance Logout Minutes",
          accessorKey: "toleranceLogoutMinutes",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Attendance Rules",
    apiEndPoint: "https://hr.api.techbee.et/api/attendanceRules",
    formName: "attendanceRule",
    allowDelete: true,
    createTitle: "Create Attendance Rule",
    sections: ["General"],
    editTitle: "Edit Attendance Rule",
  } as SchemaMeta);
