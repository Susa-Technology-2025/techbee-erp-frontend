import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDateTime } from "@/lib/schemas/time-parser";
import { interviewSchema } from "./interview";
import { userSchema } from "../users";
import { interview } from "../nested-reusable-objects";

export const interviewFeedbackSchema = z
  .object({
    id,
    comments: z.string().meta({
      formRelated: {
        section: "Feedback Details",
        inputType: "text-area",
        label: "Comments",
        placeholder: "Enter comments about the interview",
        description: "Detailed comments about the candidate's performance.",
        validationErrorMessage: "Comments are required.",
        required: true,
      },
      tableRelated: {
        header: "Comments",
        accessorKey: "comments",
      },
    } as FieldLevelMeta),
    interview,
    recommendation: z.string().meta({
      formRelated: {
        section: "Feedback Details",
        inputType: "text-field",
        label: "Recommendation",
        placeholder: "Enter recommendation",
        description: "The final recommendation for the candidate.",
        validationErrorMessage: "Recommendation is required.",
        required: true,
      },
      tableRelated: {
        header: "Recommendation",
        accessorKey: "recommendation",
      },
    } as FieldLevelMeta),
    reviewerId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Reviewer",
          placeholder: "reviewer",
          description: "The reviewer associated with the feedback.",
          validationErrorMessage: "reviewer is required.",
          section: "Feedback Details",
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
          header: "Reviewer",
          accessorKey: "reviewerId",
        },
      } as FieldLevelMeta),
    score: z.number().meta({
      formRelated: {
        section: "Feedback Details",
        inputType: "number-field",
        label: "Score",
        placeholder: "Enter score",
        description: "The score given to the candidate.",
        validationErrorMessage: "Score is required.",
        required: true,
      },
      tableRelated: {
        header: "Score",
        accessorKey: "score",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Interview Feedback",
    apiEndPoint: "https://api.techbee.et/api/hr/interviewFeedbacks",
    formName: "interviewFeedback",
    allowDelete: true,
    createTitle: "Create Interview Feedback",
    editTitle: "Edit Interview Feedback",
    sections: ["Feedback Details", "Interview Information"],
  } as SchemaMeta);
