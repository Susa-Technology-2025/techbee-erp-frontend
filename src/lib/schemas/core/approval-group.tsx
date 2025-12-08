import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "../types";
import { id } from "../common-schemas";
import { userSchema } from "../users";
import { approvalFlowSchema } from "./approval-policy";

export const approvalGroupSchema = z
  .object({
    id,

    policy: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Policy",
            placeholder: "Select Policy",
            description: "The Policy associated with this group.",
            validationErrorMessage: "Policy is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint:
                "https://core.api.techbee.et/api/approvalWorkflowPolicies",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: approvalFlowSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Policy",
            accessorKey: "policy.name",
          },
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Policy",
          accessorKey: "policy.name",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(true)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Active",
          description: "Indicates if the approval group is active.",
          validationErrorMessage: "Active flag is required.",
          required: true,
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    memberUserIds: z.array(z.string()).meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Group Memebers",
        placeholder: "Enter members",
        description: "users associated to the group.",
        validationErrorMessage: "members required.",
        section: "General",
        required: true,
        autoComplete: {
          async: true,
          allowCreateNew: true,
          multiple: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
      // tableRelated: {
      //   header: "User IDs",
      //   accessorKey: "userId",

      // },
    } as FieldLevelMeta),

    mode: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Mode",
        description: "Approval mode for the group.",
        validationErrorMessage: "Mode is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Serial", "Parallel"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Mode",
        accessorKey: "mode",
      },
    } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter group name",
        description: "The name of the approval group.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    stageOrder: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Stage Order",
        placeholder: "Enter stage order",
        description: "The order of this approval group in the approval stage.",
        validationErrorMessage: "Stage order is required.",
        required: true,
      },
      tableRelated: {
        header: "Stage Order",
        accessorKey: "stageOrder",
      },
    } as FieldLevelMeta),
  })
  .meta({
    tableName: "Approval Groups",
    apiEndPoint: "https://api.techbee.et/api/core/approvalGroups",
    formName: "approvalGroup",
    createTitle: "Create Approval Group",
    sections: ["General"],
    editTitle: "Edit Approval Group",
  } as SchemaMeta);

export type ApprovalGroupSchema = z.infer<typeof approvalGroupSchema>;
