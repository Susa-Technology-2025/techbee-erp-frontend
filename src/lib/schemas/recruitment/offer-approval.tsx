import { z } from "zod";

import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { dateTime, id } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDateTime } from "@/lib/schemas/time-parser";
import { userSchema } from "../users";
import { offerSchema } from "./offer";

export const OfferApprovalCreateSchema = z
  .object({
    id,
    approved: z
      .boolean()
      .default(false)
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Approved",
          description: "Indicates whether the offer is approved or not.",
        },
        tableRelated: {
          header: "Approved",
          accessorKey: "approved",
        },
      } as FieldLevelMeta),

    approverId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Approver",
        placeholder: "Approver",
        description: "The user associated.",
        validationErrorMessage: "Approver is required.",
        section: "General",
        required: true,
        autoComplete: {
          async: true,
          allowCreateNew: true,
          userId: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
      tableRelated: {
        header: "Approver",
        accessorKey: "approverId",
      },
    } as FieldLevelMeta),

    comment: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Comment",
        placeholder: "Enter comments",
        description: "Additional comments regarding the approval.",
        validationErrorMessage: "Comments are required.",
        required: true,
      },
      tableRelated: {
        header: "Comment",
        accessorKey: "comment",
      },
    } as FieldLevelMeta),

    decidedAt: preprocessedDateTime.meta({
      formRelated: {
        section: "General",
        inputType: "date-time",
        label: "Decided At",
        placeholder: "Select decision date and time",
        description: "The date and time the decision was made.",
        validationErrorMessage: "Decision date and time is required.",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Decided At",
        accessorKey: "decidedAt",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),

    offer: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Offer",
            placeholder: "Select an offer",
            description: "The offer to be approved.",
            validationErrorMessage: "Offer is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/offers",
              getOptionsLabel: (value) => value.application?.requisition?.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: offerSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Offer",
          accessorKey: "offer.id",
          Cell: ({ row }) => {
            return row.original.offer?.application?.requisition?.title;
          },
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Offer Approval",
    apiEndPoint: "https://api.techbee.et/api/hr/offerApprovals",
    formName: "offerApprovalCreate",
    allowDelete: true,
    createTitle: "Create Offer Approval",
    sections: ["General"],
    editTitle: "Edit Offer Approval",
  } as SchemaMeta);

export type OfferApprovalCreateInput = z.infer<
  typeof OfferApprovalCreateSchema
>;
