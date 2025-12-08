import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDate, dateCell } from "@/lib/schemas/time-parser";
import { employeeId, orgology, userId } from "../nested-reusable-objects";
import { questions } from "./create-connect-many-schemas";

// 1. TnaSurveyTemplateCreateInput Schema
export const tnaSurveyTemplateSchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Template Code",
        placeholder: "Enter a unique code",
        description: "Unique identifier for the survey template.",
        validationErrorMessage: "Template code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    questions,
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter template title",
        description: "Name of the survey template.",
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
    tableName: "TNA Survey Templates",
    apiEndPoint: "https://api.techbee.et/api/hr/tnaSurveyTemplates",
    formName: "tnaSurveyTemplate",
    allowDelete: true,
    createTitle: "Create TNA Survey Template",
    sections: ["General"],
    editTitle: "Edit TNA Survey Template",
  } as SchemaMeta);
// 3. TrainingNeedSurveyCreateInput Schema
export const trainingNeedSurveySchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Survey Code",
        placeholder: "Enter a unique code",
        description: "Unique identifier for the survey Survey.",
        validationErrorMessage: "Survey code is required.",
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
        label: "Survey name",
        placeholder: "Enter a unique name",
        description: "Unique identifier for the survey Survey.",
        validationErrorMessage: "Survey name is required.",
        required: true,
      },
      tableRelated: {
        header: "name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    deadline: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Deadline",
          placeholder: "Select survey deadline",
          description: "The date by which the survey must be completed.",
          validationErrorMessage: "Invalid deadline date.",
          section: "General",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Deadline",
          accessorKey: "deadline",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    organizationNodeId: orgology("General"),
    template: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Survey Template",
            placeholder: "Select survey template",
            description: "The template used to create this survey.",
            validationErrorMessage: "Template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/tnaSurveyTemplates",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: tnaSurveyTemplateSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Template",
            accessorKey: "template.title",
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
    createdByUserId: userId({
      section: "Relations",
      label: "Created By",
      required: true,
    }),
    ...dateTime,
  })
  .meta({
    tableName: "TNA Surveys",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingNeedSurveys",
    formName: "trainingNeedSurvey",
    allowDelete: true,
    createTitle: "Create Training Need Survey",
    sections: ["General", "Relations"],
    editTitle: "Edit Training Need Survey",
  } as SchemaMeta);
// 2. TrainingNeedAnswerCreateInput Schema
export const trainingNeedAnswerSchema = z
  .object({
    id,
    // answers: z.object({}).meta({
    //   formRelated: {
    //     section: "Answer Data",
    //     inputType: "object",
    //     label: "Answers Data",
    //     description: "The raw data for the survey answers.",
    //     validationErrorMessage: "Answers data is required.",
    //     required: true,
    //   },
    //   tableRelated: {
    //     header: "Answers Data",
    //     accessorKey: "answers",
    //   },
    // } as FieldLevelMeta),
    employee: employeeId("General"),
    survey: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Survey",
            placeholder: "Select training need survey",
            description: "The survey to which these answers belong.",
            validationErrorMessage: "Survey is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingNeedSurveys",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: trainingNeedSurveySchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Survey",
            accessorKey: "survey.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Survey",
          accessorKey: "survey.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "TNA Answers",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingNeedAnswers",
    formName: "trainingNeedAnswer",
    allowDelete: true,
    createTitle: "Create Training Need Answer",
    sections: ["General"],
    editTitle: "Edit Training Need Answer",
  } as SchemaMeta);

// 4. TrainingNeedQuestionCreateInput Schema
export const trainingNeedQuestionSchema = z
  .object({
    id,
    answerType: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete", // Changed to auto-complete
        label: "Answer Type",
        placeholder: "Select answer type",
        description: "The expected type of answer (Number or Text).",
        validationErrorMessage: "Answer type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false, // Not async, as options are hardcoded
          options: [
            { id: "Number", name: "Number" },
            { id: "Text", name: "Text" },
          ], // Hardcoded options from the enum
          allowCreateNew: false, // No creation for fixed enums
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Answer Type",
        accessorKey: "answerType",
      },
    } as FieldLevelMeta),
    question: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Question",
        placeholder: "Enter the survey question",
        description: "The actual text of the training need question.",
        validationErrorMessage: "Question is required.",
        required: true,
      },
      tableRelated: {
        header: "Question",
        accessorKey: "question",
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
          description: "Is an answer to this question mandatory?",
        },
        tableRelated: {
          header: "Required",
          accessorKey: "required",
        },
      } as FieldLevelMeta),
    section: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Section",
          placeholder: "Enter section name",
          description: "The section of the survey this question belongs to.",
          validationErrorMessage: "Invalid section name.",
        },
        tableRelated: {
          header: "Section",
          accessorKey: "section",
        },
      } as FieldLevelMeta),
    template: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Survey Template",
              placeholder: "Select survey template",
              description: "The template this question belongs to.",
              validationErrorMessage: "Template is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/tnaSurveyTemplates",
                getOptionsLabel: (value) => value.title,
                getOptionsValue: (value) => value.id,
                createSchema: tnaSurveyTemplateSchema,
                allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Template",
              accessorKey: "template.title",
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Template",
          accessorKey: "template.title",
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),
    ...dateTime,
  })
  .meta({
    tableName: "TNA Questions",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingNeedQuestions",
    formName: "trainingNeedQuestion",
    allowDelete: true,
    createTitle: "Create Training Need Question",
    sections: ["General", "Relations"],
    editTitle: "Edit Training Need Question",
  } as SchemaMeta);
