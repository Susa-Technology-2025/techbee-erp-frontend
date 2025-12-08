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
import { userSchema } from "../users";
import { candidateSchema } from "./candidate";

export const ReferralCreateSchema = z
  .object({
    id,
    candidate: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Candidate",
            placeholder: "Select a candidate",
            description: "The candidate being referred.",
            validationErrorMessage: "Candidate is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/candidates",
              getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: candidateSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
          validationErrorMessage: "Candidate is required.",
        },
        tableRelated: {
          header: "Candidate",
          accessorKey: "candidate.firstName",
        },
      } as FieldLevelMeta),

    referrerId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Referrer ",
        placeholder: "Enter referrer ",
        description: "The ID of the person who made the referral.",
        validationErrorMessage: "Referrer is required.",
        section: "General",
        required: true,
        autoComplete: {
          async: true,
          userId: true,
          allowCreateNew: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
      tableRelated: {
        header: "Referrer",
        accessorKey: "referrerId",
      },
    } as FieldLevelMeta),
    reward: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Reward",
        placeholder: "Enter reward details",
        description: "Details about the referral reward.",
        validationErrorMessage: "Reward information is required.",
        required: true,
      },
      tableRelated: {
        header: "Reward",
        accessorKey: "reward",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Referrals",
    apiEndPoint: "https://api.techbee.et/api/hr/referrals",
    formName: "referral",
    allowDelete: true,
    createTitle: "Create Referral",
    sections: ["General"],
    editTitle: "Edit Referral",
  } as SchemaMeta);
