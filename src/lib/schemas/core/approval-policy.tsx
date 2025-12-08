import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "../types";
import { id } from "../common-schemas";
import { approvalDocumentTypeSchema } from "./approval-doc-type";
import { orgology } from "../nested-reusable-objects";

export const approvalFlowSchema = z
  .object({
    id,

    appliesToOrgNodeId: orgology("General"),

    approvalLogic: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Approval Logic",
        description: "Logic for approval decision.",
        validationErrorMessage: "Approval logic is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["All", "Any", "AtLeastN"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Approval Logic",
        accessorKey: "approvalLogic",
      },
    } as FieldLevelMeta),

    // approverIdentifier: z
    //   .string()
    //   .nullable()
    //   .optional()
    //   .meta({
    //     formRelated: {
    //       section: "General",
    //       inputType: "text-field",
    //       label: "Approver Identifier",
    //       placeholder: "Enter approver identifier",
    //       description: "Identifier for the approver.",
    //     },
    //     tableRelated: {
    //       header: "Approver Identifier",
    //       accessorKey: "approverIdentifier",
    //     },
    //   } as FieldLevelMeta),

    approverType: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Approver Type",
        description: "Type of approver.",
        validationErrorMessage: "Approver type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Individual", "Role", "Group", "Dynamic"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Approver Type",
        accessorKey: "approverType",
      },
    } as FieldLevelMeta),

    autoApproval: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Auto Approval",
          description: "Enable automatic approval.",
        },
        tableRelated: {
          header: "Auto Approval",
          accessorKey: "autoApproval",
        },
      } as FieldLevelMeta),

    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "Unique code for the approval flow.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

    // conditionExpression: z
    //   .string()
    //   .nullable()
    //   .optional()
    //   .meta({
    //     formRelated: {
    //       section: "General",
    //       inputType: "text-area",
    //       label: "Condition Expression",
    //       placeholder: "Enter condition expression",
    //       description: "Condition expression for this approval flow.",
    //     },
    //     tableRelated: {
    //       header: "Condition Expression",
    //       accessorKey: "conditionExpression",
    //     },
    //   } as FieldLevelMeta),

    conflictResolution: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Conflict Resolution",
        description: "Conflict resolution strategy.",
        validationErrorMessage: "Conflict resolution is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["HighestVersion", "MostSpecific", "FirstMatch"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Conflict Resolution",
        accessorKey: "conflictResolution",
      },
    } as FieldLevelMeta),

    delegationAllowed: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Delegation Allowed",
          description: "Allow delegation of approval.",
        },
        tableRelated: {
          header: "Delegation Allowed",
          accessorKey: "delegationAllowed",
        },
      } as FieldLevelMeta),

    documentType: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Document Type",
            placeholder: "Select document type",
            description: "The document type associated with this flow.",
            validationErrorMessage: "Document type is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint:
                "https://api.techbee.et/api/core/approvalDocumentTypes",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: approvalDocumentTypeSchema,
              allowCreateNew: false,
            },
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
          header: "documentType",
          accessorKey: "documentType.name",
        },
      } as FieldLevelMeta),
    flowType: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Flow Type",
        description: "Type of approval flow.",
        validationErrorMessage: "Flow type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Serial", "Parallel", "Hybrid"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Flow Type",
        accessorKey: "flowType",
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
          label: "Active",
          description: "Indicates if the approval flow is active.",
          validationErrorMessage: "Active flag is required.",
          required: true,
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    locked: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Locked",
          description: "Indicates if the approval flow is locked.",
        },
        tableRelated: {
          header: "Locked",
          accessorKey: "locked",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter flow name",
        description: "The name of the approval flow.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    notificationTypes: z.array(z.string()).meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Notification Types",
        description: "Notification methods for approval updates.",
        validationErrorMessage: "At least one notification type is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: false,
          options: ["InApp", "Email", "Sms"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Notification Types",
        accessorKey: "notificationTypes",
        Cell: ({ row }) => row.original.notificationTypes?.join(", ") ?? "",
      },
    } as FieldLevelMeta),

    priority: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Priority",
        placeholder: "Enter priority",
        description: "Priority of the approval flow.",
        validationErrorMessage: "Priority is required.",
        required: true,
      },
      tableRelated: {
        header: "Priority",
        accessorKey: "priority",
      },
    } as FieldLevelMeta),

    conditionalItem: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Conditional Expression",
          inputType: "auto-complete",
          label: "Conditional Item",
          placeholder: "Select conditional item",
          description: "The item to be evaluated.",
          autoComplete: {
            multiple: false,
            async: false,
            options: ["cost", "amount", "budget"],
            getOptionsLabel: (opt) => opt,
            getOptionsValue: (opt) => opt,
          },
        },
        tableRelated: {
          header: "Conditional Item",
          accessorKey: "conditionalItem",
        },
      } as FieldLevelMeta),

    conditionalOperator: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Conditional Expression",
          inputType: "auto-complete",
          label: "Conditional Operator",
          placeholder: "Select conditional operator",
          description: "The operator for the comparison.",
          autoComplete: {
            multiple: false,
            async: false,
            options: ["<", ">", "=", "!=", "<=", ">="],
            getOptionsLabel: (opt) => opt,
            getOptionsValue: (opt) => opt,
          },
        },
        tableRelated: {
          header: "Conditional Operator",
          accessorKey: "conditionalOperator",
        },
      } as FieldLevelMeta),

    conditionalValue: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Conditional Expression",
          inputType: "text-field",
          label: "Conditional Value",
          placeholder: "Enter conditional value",
          description: "The value to compare against.",
        },
        tableRelated: {
          header: "Conditional Value",
          accessorKey: "conditionalValue",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Approval Workflow policy",
    apiEndPoint: "https://core.api.techbee.et/api/approvalWorkflowPolicies",
    formName: "approvalFlow",
    createTitle: "Create Approval Flow policy",
    allowDelete: true,
    sections: ["General", "Conditional Expression"],
    editTitle: "Edit Approval Flow Policy",
  } as SchemaMeta);

export type ApprovalFlowSchema = z.infer<typeof approvalFlowSchema>;
