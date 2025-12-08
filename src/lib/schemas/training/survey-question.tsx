import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { SurveySectionCreateSchema } from "./survey-section";
import { QuestionBankItemCreateSchema } from "./question-bank-item";

export const SurveyQuestionCreateSchema = z
  .object({
    id,
    bankItem: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Question Bank Item",
            placeholder: "Select from question bank",
            description: "The question from the question bank.",
            validationErrorMessage: "Question bank item is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/questionBankItems",
              getOptionsLabel: (value) => value.text,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: QuestionBankItemCreateSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Question Bank Item",
          accessorKey: "bankItem.text",
        },
      } as FieldLevelMeta),
    questionNo: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Question Number",
        placeholder: "Enter question number",
        description: "The sequence number of the question.",
        validationErrorMessage:
          "Question number is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "No.",
        accessorKey: "questionNo",
      },
    } as FieldLevelMeta),
    required: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Required",
          description: "Whether the question must be answered.",
        },
        tableRelated: {
          header: "Required",
          accessorKey: "required",
        },
      } as FieldLevelMeta),
    section: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Survey Section",
            placeholder: "Select a survey section",
            description: "The section this question belongs to.",
            validationErrorMessage: "Survey section is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/surveySections",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: SurveySectionCreateSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Section",
          accessorKey: "section.title",
        },
      } as FieldLevelMeta),
    text: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Question Text",
        placeholder: "Enter the question text",
        validationErrorMessage: "Question text is required.",
        required: true,
      },
      tableRelated: {
        header: "Question",
        accessorKey: "text",
      },
    } as FieldLevelMeta),
    type: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Question Type",
        placeholder: "Select question type",
        validationErrorMessage: "Question type is required.",
        required: true,
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Survey Questions",
    apiEndPoint: "https://api.techbee.et/api/hr/surveyQuestions",
    formName: "surveyQuestion",
    allowDelete: true,
    createTitle: "Create Survey Question",
    sections: ["General"],
    editTitle: "Edit Survey Question",
  } as SchemaMeta);
