import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  dateCell,
  timeCell,
  preprocessedDate,
  preprocessedDateTime,
  preprocessedTime,
} from "@/lib/schemas/time-parser";
import { orgology, userId } from "./nested-reusable-objects";
export const notificationDocumentTypeReferenceSchema = z.object({
  id: z.string().meta({
    formRelated: {
      inputType: "auto-complete",
      section: "General",
      label: "Document Type",
      placeholder: "Select a document type",
      description: "The document type associated with this policy/event.",
      validationErrorMessage: "Document type is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint:
          "https://api.techbee.et/api/core/notificationDocumentTypes",
        getOptionsLabel: (value: { name: string }) => value.name,
        getOptionsValue: (value: { id: string }) => value.id,
      },
    },
  } as FieldLevelMeta),
});
export const notificationPolicyReferenceSchema = z.object({
  id: z.string().meta({
    formRelated: {
      inputType: "auto-complete",
      section: "General",
      label: "Notification Policy",
      placeholder: "Select a parent policy",
      description: "The notification policy this recipient/config belongs to.",
      validationErrorMessage: "Policy is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://api.techbee.et/api/core/notificationPolicies",
        getOptionsLabel: (value: { name: string }) => value.name,
        getOptionsValue: (value: { id: string }) => value.id,
        allowCreateNew: false,
      },
    },
  } as FieldLevelMeta),
});
export const notificationDocumentTypeSchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Document Code",
        placeholder: "Enter document code (e.g., 'LEAVE_REQ')",
        description: "A unique code for the document type.",
        validationErrorMessage: "Document Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Document Name",
        placeholder: "Enter document name (e.g., 'Leave Request')",
        description: "A readable name for the document type.",
        validationErrorMessage: "Document Name is required.",
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
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Describe the document type",
          description:
            "Detailed description of what this document type represents.",
          validationErrorMessage: "Invalid description.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    moduleField: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Module Field",
          placeholder: "Enter related module identifier",
          description:
            "The module this document type belongs to (e.g., 'HR', 'Finance').",
          validationErrorMessage: "Invalid module field.",
        },
        tableRelated: {
          header: "Module",
          accessorKey: "moduleField",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Notification Document Types",
    apiEndPoint: "https://api.techbee.et/api/core/notificationDocumentTypes",
    formName: "notificationDocumentType",
    allowDelete: true,
    createTitle: "Create Notification Document Type",
    sections: ["General"],
    editTitle: "Edit Notification Document Type",
  } as SchemaMeta);
export const notificationEventCatalogSchema = z
  .object({
    id,
    eventKey: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Event Key",
        placeholder: "Enter unique event key (e.g., 'ORDER_CREATED')",
        description: "A unique technical key for the event.",
        validationErrorMessage: "Event Key is required.",
        required: true,
      },
      tableRelated: {
        header: "Event Key",
        accessorKey: "eventKey",
      },
    } as FieldLevelMeta),
    label: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Event Label",
        placeholder:
          "Enter human-readable label (e.g., 'Order Successfully Created')",
        description: "A descriptive label for the event.",
        validationErrorMessage: "Event Label is required.",
        required: true,
      },
      tableRelated: {
        header: "Label",
        accessorKey: "label",
      },
    } as FieldLevelMeta),
    documentTypeCode: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Document Type Code",
        placeholder: "Select a document type code",
        description: "The document type code associated with this event.",
        validationErrorMessage: "Document Type Code is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint:
            "https://api.techbee.et/api/core/notificationDocumentTypes",
          getOptionsLabel: (value: { code: string }) => value.code,
          getOptionsValue: (value: { code: string }) => value.code,
          allowCreateNew: true,
          createSchema: notificationDocumentTypeSchema,
        },
      },
      tableRelated: {
        header: "Doc Type Code",
        accessorKey: "documentTypeCode",
      },
    } as FieldLevelMeta),
    moduleField: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Module Field",
        placeholder: "Enter module identifier (e.g., 'SALES')",
        description: "The core module this event originates from.",
        validationErrorMessage: "Module Field is required.",
        required: true,
      },
      tableRelated: {
        header: "Module",
        accessorKey: "moduleField",
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
          description:
            "Whether the event is currently active and can be triggered.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Describe the event",
          description:
            "Detailed description of when and why this event is triggered.",
          validationErrorMessage: "Invalid description.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Notification Event Catalog",
    apiEndPoint: "https://api.techbee.et/api/core/notificationEventCatalogs",
    formName: "notificationEventCatalog",
    allowDelete: true,
    createTitle: "Create Notification Event",
    sections: ["General"],
    editTitle: "Edit Notification Event",
  } as SchemaMeta);
export const notificationPolicySchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Policy Code",
        placeholder: "Enter policy code",
        description: "A unique code for the notification policy.",
        validationErrorMessage: "Policy Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Policy Name",
        placeholder: "Enter policy name",
        description: "A descriptive name for the notification policy.",
        validationErrorMessage: "Policy Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    priority: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Priority",
        placeholder: "Enter priority number",
        description: "A higher number indicates higher priority.",
        validationErrorMessage: "Priority is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Priority",
        accessorKey: "priority",
      },
    } as FieldLevelMeta),
    eventKey: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Event Key",
        placeholder: "Enter event key",
        description: "The unique key of the event this policy listens to.",
        validationErrorMessage: "Event Key is required.",
        required: true,
      },
      tableRelated: {
        header: "Event Key",
        accessorKey: "eventKey",
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
          description:
            "Whether the policy is currently active and processing events.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    channels: z.array(z.string()).meta({
      formRelated: {
        section: "Channels & Trigger",
        inputType: "chips",
        label: "Channels",
        placeholder: "Select notification channels",
        description:
          "The channels to send notifications through. Possible values: InApp, Email, Sms, Push, Webhook, System.",
        validationErrorMessage: "At least one channel is required.",
        required: true,
      },
      tableRelated: {
        header: "Channels",
        accessorKey: "channels",
      },
    } as FieldLevelMeta),
    triggerType: z.string().meta({
      formRelated: {
        section: "Channels & Trigger",
        inputType: "text-field",
        label: "Trigger Type",
        placeholder: "Select trigger type",
        description:
          "The mechanism that triggers the notification. Possible values: Event, Scheduled, Manual.",
        validationErrorMessage: "Trigger Type is required.",
        required: true,
      },
      tableRelated: {
        header: "Trigger Type",
        accessorKey: "triggerType",
      },
    } as FieldLevelMeta),
    documentType: notificationDocumentTypeReferenceSchema
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Document Type",
          accessorKey: "documentType.id",
        },
      } as FieldLevelMeta),
    conditionExpression: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Conditional Expression",
          label: "Condition Expression",
          placeholder: "Enter a condition expression (e.g., 'amount > 1000')",
          description:
            "A JEXL or similar expression to conditionally trigger the policy.",
          validationErrorMessage: "Invalid condition expression.",
        },
        tableRelated: {
          header: "Condition Expression",
          accessorKey: "conditionExpression",
        },
      } as FieldLevelMeta),

    appliesToOrgNodeId: orgology("Recipients"),
    ...dateTime,
  })
  .meta({
    tableName: "Notification Policies",
    apiEndPoint: "https://api.techbee.et/api/core/notificationPolicies",
    formName: "notificationPolicy",
    allowDelete: true,
    createTitle: "Create Notification Policy",
    sections: [
      "General",
      "Channels & Trigger",
      "Conditional Expression",
      "Recipients",
    ],
    editTitle: "Edit Notification Policy",
  } as SchemaMeta);
export const notificationChannelConfigSchema = z
  .object({
    id,
    policy: notificationPolicyReferenceSchema
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Policy",
          accessorKey: "policy.id",
        },
      } as FieldLevelMeta),
    channel: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Channel Type",
        placeholder: "Select notification channel",
        description:
          "The type of channel. Possible values: InApp, Email, Sms, Push, Webhook, System.",
        validationErrorMessage: "Channel is required.",
        required: true,
      },
      tableRelated: {
        header: "Channel",
        accessorKey: "channel",
      },
    } as FieldLevelMeta),
    isEnabled: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Enabled",
          description:
            "Whether this specific channel config is enabled for the policy.",
        },
        tableRelated: {
          header: "Enabled",
          accessorKey: "isEnabled",
        },
      } as FieldLevelMeta),
    sendDelaySeconds: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timing & Throttling",
          inputType: "number-field",
          label: "Send Delay (Seconds)",
          placeholder: "Enter delay in seconds",
          description:
            "The time to wait before sending the notification (optional).",
          validationErrorMessage: "Delay must be a number.",
        },
        tableRelated: {
          header: "Delay (s)",
          accessorKey: "sendDelaySeconds",
        },
      } as FieldLevelMeta),
    templateCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Template & Throttling",
          inputType: "text-field",
          label: "Template Code",
          placeholder: "Enter template code",
          description: "The code of the template to use for this channel.",
          validationErrorMessage: "Invalid template code.",
        },
        tableRelated: {
          header: "Template",
          accessorKey: "templateCode",
        },
      } as FieldLevelMeta),
    throttleKey: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Template & Throttling",
          inputType: "text-field",
          label: "Throttle Key",
          placeholder: "Enter throttling key",
          description:
            "A key used to group and limit notifications (e.g., 'per_user').",
          validationErrorMessage: "Invalid throttle key.",
        },
        tableRelated: {
          header: "Throttle Key",
          accessorKey: "throttleKey",
        },
      } as FieldLevelMeta),
    throttleLimit: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timing & Throttling",
          inputType: "number-field",
          label: "Throttle Limit",
          placeholder: "Enter maximum notifications",
          description:
            "Maximum number of notifications allowed within the throttle window.",
          validationErrorMessage: "Throttle limit must be a number.",
        },
        tableRelated: {
          header: "Limit",
          accessorKey: "throttleLimit",
        },
      } as FieldLevelMeta),
    throttleWindowSec: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timing & Throttling",
          inputType: "number-field",
          label: "Throttle Window (Seconds)",
          placeholder: "Enter window in seconds",
          description:
            "The duration over which the throttle limit is enforced.",
          validationErrorMessage: "Throttle window must be a number.",
        },
        tableRelated: {
          header: "Window (s)",
          accessorKey: "throttleWindowSec",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Notification Channel Configurations",
    apiEndPoint: "https://api.techbee.et/api/core/notificationChannelConfigs",
    formName: "notificationChannelConfig",
    allowDelete: true,
    createTitle: "Create Channel Configuration",
    sections: ["General", "Template & Throttling", "Timing & Throttling"],
    editTitle: "Edit Channel Configuration",
  } as SchemaMeta);
export const notificationRecipientSchema = z
  .object({
    id,
    policy: notificationPolicyReferenceSchema
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
    recipientType: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Recipient Type",
        placeholder: "Select recipient type",
        description:
          "The type of recipient. Possible values: Individual, Role, OrgNode, External, Dynamic.",
        validationErrorMessage: "Recipient Type is required.",
        required: true,
        autoComplete: {
          options: ["Individual", "Role", "OrgNode", "External", "Dynamic"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "recipientType",
      },
    } as FieldLevelMeta),
    userId: userId({ required: false, section: "Details", label: "User" }),
    roleCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Role Code",
          placeholder: "Enter role code",
          description: "The code of the role if recipient type is 'Role'.",
          validationErrorMessage: "Invalid Role Code.",
        },
        tableRelated: {
          header: "Role Code",
          accessorKey: "roleCode",
        },
      } as FieldLevelMeta),
    orgNodeId: orgology("Details"),
    externalAddress: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "External Address",
          placeholder: "Enter external email/phone",
          description:
            "An external address (email, phone number) if recipient type is 'External'.",
          validationErrorMessage: "Invalid External Address.",
        },
        tableRelated: {
          header: "External Address",
          accessorKey: "externalAddress",
        },
      } as FieldLevelMeta),
    dynamicResolver: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Dynamic Resolver",
          placeholder: "Enter dynamic resolver expression",
          description:
            "An expression to dynamically resolve recipients if type is 'Dynamic'.",
          validationErrorMessage: "Invalid Dynamic Resolver expression.",
        },
        tableRelated: {
          header: "Dynamic Resolver",
          accessorKey: "dynamicResolver",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Notification Recipients",
    apiEndPoint: "https://api.techbee.et/api/core/notificationRecipients",
    formName: "notificationRecipient",
    allowDelete: true,
    createTitle: "Create Notification Recipient",
    sections: ["General", "Details"],
    editTitle: "Edit Notification Recipient",
  } as SchemaMeta);
