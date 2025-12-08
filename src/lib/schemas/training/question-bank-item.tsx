import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const QuestionBankItemCreateSchema = z
  .object({
    id,
    category: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Category",
        placeholder: "Select category",
        validationErrorMessage: "Category is required.",
        required: true,
      },
      tableRelated: {
        header: "Category",
        accessorKey: "category",
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
          description: "Whether the question is active.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
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
    tableName: "Question Bank",
    apiEndPoint: "https://api.techbee.et/api/hr/questionBankItems",
    formName: "questionBankItem",
    allowDelete: true,
    createTitle: "Create Question Bank Item",
    sections: ["General"],
    editTitle: "Edit Question Bank Item",
  } as SchemaMeta);
