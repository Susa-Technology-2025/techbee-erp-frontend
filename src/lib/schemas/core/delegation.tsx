import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "../types";
import { id, dateTime } from "../common-schemas";
import { preprocessedDate, dateCell } from "../time-parser";
import { approvalDocumentTypeSchema } from "./approval-doc-type";
import { userSchema } from "../users";

export const delegationSchema = z
  .object({
    id,
    approverUserId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Approver User ID",
        placeholder: "Enter approver user ID",
        description: "The user ID of the approver delegating authority.",
        validationErrorMessage: "Approver user ID is required.",
        required: true,
        section: "General",
        autoComplete: {
          async: true,
          allowCreateNew: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
      tableRelated: {
        header: "Approver User",
        accessorKey: "userId",
      },
    } as FieldLevelMeta),

    delegatedToUserId: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Delegated To User ID",
        placeholder: "Enter delegated user ID",
        description: "The user ID to whom the approval authority is delegated.",
        validationErrorMessage: "DelegatedToUserId is required.",
        required: true,
        autoComplete: {
          async: true,
          allowCreateNew: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
      tableRelated: {
        header: "Delegated To User ID",
        accessorKey: "delegatedToUserId",
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
              allowCreateNew: true,
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

    startDate: preprocessedDate.meta({
      formRelated: {
        section: "General",
        inputType: "date-time",
        label: "Start Date",
        placeholder: "Select start date",
        description: "The start date of the delegation period.",
        validationErrorMessage: "Start date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Start Date",
        accessorKey: "startDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),

    endDate: preprocessedDate.meta({
      formRelated: {
        section: "General",
        inputType: "date-time",
        label: "End Date",
        placeholder: "Select end date",
        description: "The end date of the delegation period.",
        validationErrorMessage: "End date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "End Date",
        accessorKey: "endDate",
        Cell: ({ cell }) => dateCell({ cell }),
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
          description: "Indicates if the delegation is currently active.",
          validationErrorMessage: "Active flag is required.",
          required: true,
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    remarks: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Remarks",
          placeholder: "Enter remarks",
          description: "Additional notes or remarks about the delegation.",
        },
        tableRelated: {
          header: "Remarks",
          accessorKey: "remarks",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Delegations",
    apiEndPoint: "https://api.techbee.et/api/core/approvalDelegations",
    formName: "delegation",
    createTitle: "Create Delegation",
    sections: ["General"],
    editTitle: "Edit Delegation",
  } as SchemaMeta);

export type DelegationSchema = z.infer<typeof delegationSchema>;
