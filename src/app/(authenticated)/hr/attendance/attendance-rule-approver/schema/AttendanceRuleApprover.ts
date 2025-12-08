// Second and Final Output: Zod Schema with Meta Data

import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const attendanceRuleApproverSchema = z
  .object({
    approverOrgNodeId: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Approver Organization Node",
          placeholder: "Select approver organization node",
          description: "The organization node of the approver.",
          validationErrorMessage: "Approver organization node is required.",
          required: false,
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint: "https://hr.api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
            allowCreateNew: true,
          },
        },
        tableRelated: {
          header: "Approver Org Node ID",
          accessorKey: "approverOrgNodeId",
        },
      } as FieldLevelMeta),
    approverRoleCode: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Approver Role Code",
          placeholder: "Select approver role",
          description: "The role code of the approver.",
          validationErrorMessage: "Approver role code is required.",
          required: false,
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint: "https://hr.api.techbee.et/api/core/roles",
            getOptionsLabel: (value) => value.code,
            getOptionsValue: (value) => value.id,
            allowCreateNew: true,
          },
        },
        tableRelated: {
          header: "Approver Role Code",
          accessorKey: "approverRoleCode",
        },
      } as FieldLevelMeta),
    approverType: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Approver Type",
        placeholder: "Select approver type",
        description: "The type of the attendance rule approver.",
        validationErrorMessage: "Approver type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["User", "Role", "OrgNode", "Dynamic"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Approver Type",
        accessorKey: "approverType",
      },
    } as FieldLevelMeta),
    approverUserId: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Approver User",
          placeholder: "Select approver user",
          description: "The user ID of the approver.",
          validationErrorMessage: "Approver user is required.",
          required: false,
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint: "https://hr.api.techbee.et/api/core/users",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
            allowCreateNew: true,
          },
        },
        tableRelated: {
          header: "Approver User ID",
          accessorKey: "approverUserId",
        },
      } as FieldLevelMeta),
    dynamicResolver: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Dynamic Resolver",
          placeholder: "Enter dynamic resolver",
          description: "Resolver for dynamic approver types.",
          validationErrorMessage: "Dynamic resolver is required.",
          required: false,
        },
        tableRelated: {
          header: "Dynamic Resolver",
          accessorKey: "dynamicResolver",
        },
      } as FieldLevelMeta),
    rule: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Attendance Rule",
            placeholder: "Select attendance rule",
            description: "The attendance rule this approver belongs to.",
            validationErrorMessage: "Attendance rule is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://hr.api.techbee.et/api/attendanceRules",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Attendance Rule",
            accessorKey: "rule.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Rule",
          accessorKey: "rule.name",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Attendance Rule Approvers",
    apiEndPoint: "https://hr.api.techbee.et/api/attendanceRuleApprovers",
    formName: "attendanceRuleApprover",
    allowDelete: true,
    createTitle: "Create Attendance Rule Approver",
    sections: ["General"],
    editTitle: "Edit Attendance Rule Approver",
  } as SchemaMeta);
