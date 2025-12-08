import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { SurveyTemplateCreateSchema } from "./survey-template";

export const SurveySectionCreateSchema = z
  .object({
    id,
    sequence: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Sequence",
        placeholder: "Enter sequence number",
        description: "The order of the section within the survey template.",
        validationErrorMessage: "Sequence is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Sequence",
        accessorKey: "sequence",
      },
    } as FieldLevelMeta),
    template: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Survey Template",
            placeholder: "Select a survey template",
            description: "The survey template this section belongs to.",
            validationErrorMessage: "Survey template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/surveyTemplates",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: SurveyTemplateCreateSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Template",
          accessorKey: "template.title",
        },
      } as FieldLevelMeta),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter section title",
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
    tableName: "Survey Sections",
    apiEndPoint: "https://api.techbee.et/api/hr/surveySections",
    formName: "surveySection",
    allowDelete: true,
    createTitle: "Create Survey Section",
    sections: ["General"],
    editTitle: "Edit Survey Section",
  } as SchemaMeta);
