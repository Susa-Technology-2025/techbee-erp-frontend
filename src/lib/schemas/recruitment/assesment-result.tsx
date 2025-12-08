import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDateTime } from "@/lib/schemas/time-parser";
import { application } from "./reusable";
import { userSchema } from "../users";

export const AssessmentResultCreateInputSchema = z
  .object({
    application,
    maxScore: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Max Score",
          placeholder: "Enter max score",
          description: "The maximum possible score for the assessment.",
          validationErrorMessage: "Max score must be a number.",
        },
        tableRelated: {
          header: "Max Score",
          accessorKey: "maxScore",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Assesment Result Creator",
        placeholder: "reviewer",
        description: "The user associated with the assesment.",
        validationErrorMessage: "reviewer is required.",
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
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    remarks: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Remarks",
          placeholder: "Enter remarks",
          description: "Any additional remarks about the assessment result.",
          validationErrorMessage: "Remarks must be a string.",
        },
        tableRelated: {
          header: "Remarks",
          accessorKey: "remarks",
        },
      } as FieldLevelMeta),
    score: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Score",
          placeholder: "Enter score",
          description: "The score obtained by the candidate.",
          validationErrorMessage: "Score must be a number.",
        },
        tableRelated: {
          header: "Score",
          accessorKey: "score",
        },
      } as FieldLevelMeta),
    takenAt: preprocessedDateTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Taken At",
          placeholder: "Select date and time",
          description: "The date and time the assessment was taken.",
          section: "General",
          required: true,
          date: {
            type: "date-and-time",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Taken At",
          accessorKey: "takenAt",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Assessment Results",
    apiEndPoint: "https://api.techbee.et/api/hr/assessmentResults",
    formName: "assessmentResult",
    allowDelete: true,
    createTitle: "Create Assessment Result",
    sections: ["General"],
    editTitle: "Edit Assessment Result",
  } as SchemaMeta);
