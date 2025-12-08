import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const SurveyTemplateCreateSchema = z
  .object({
    id,
    allowPartialDefault: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Allow Partial",
          description: "Allow partially completed surveys by default.",
        },
        tableRelated: {
          header: "Allow Partial",
          accessorKey: "allowPartialDefault",
        },
      } as FieldLevelMeta),
    autoCloseOnDeadlineDefault: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Auto Close on Deadline",
          description:
            "Automatically close surveys on their deadline by default.",
        },
        tableRelated: {
          header: "Auto Close",
          accessorKey: "autoCloseOnDeadlineDefault",
        },
      } as FieldLevelMeta),
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
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "markdown",
          label: "Description",
          placeholder: "Enter description",
          description: "Description of the survey template.",
          validationErrorMessage: "Description must be a valid string.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
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
          description: "Whether the survey template is active.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    isAnonymousDefault: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Anonymous",
          description: "Make surveys anonymous by default.",
        },
        tableRelated: {
          header: "Anonymous",
          accessorKey: "isAnonymousDefault",
        },
      } as FieldLevelMeta),
    passThreshold: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Pass Threshold",
          placeholder: "Enter pass threshold",
          description: "The score required to pass.",
          validationErrorMessage: "Pass threshold must be a valid number.",
        },
        tableRelated: {
          header: "Pass Threshold",
          accessorKey: "passThreshold",
        },
      } as FieldLevelMeta),
    scoringConfig: z
      .object({})
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
          section: "General",
          label: "Scoring Configuration",
          description: "Configuration for survey scoring.",
        },
        tableRelated: {
          header: "Scoring Config",
          accessorKey: "scoringConfig",
        },
      } as FieldLevelMeta),
    scoringMode: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Scoring Mode",
        placeholder: "Select scoring mode",
        validationErrorMessage: "Scoring mode is required.",
        required: true,
      },
      tableRelated: {
        header: "Scoring Mode",
        accessorKey: "scoringMode",
      },
    } as FieldLevelMeta),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter title",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Survey Templates",
    apiEndPoint: "https://api.techbee.et/api/hr/surveyTemplates",
    formName: "surveyTemplate",
    allowDelete: true,
    createTitle: "Create Survey Template",
    sections: ["General"],
    editTitle: "Edit Survey Template",
  } as SchemaMeta);
