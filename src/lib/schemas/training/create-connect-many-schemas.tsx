import z from "zod";
import { FieldLevelMeta, SchemaMeta } from "../types";
import { dateTime, id } from "../common-schemas";
import { employeeId, orgology, userId } from "../nested-reusable-objects";

import { organizationSchema } from "../organization-node";
import { dateCell, preprocessedDate } from "../time-parser";
import { tnaSurveyTemplateSchema } from "./tna-template";
import { appraisalPlanSubjectSchema } from "../performance/plan-subject";
export const trainingRequestSchema = z
  .object({
    id,
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Request Title",
        placeholder: "Enter request title",
        description: "The name of the training request.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    source: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Source",
        placeholder: "Select source of request",
        description:
          "The origin of the training need (Performance, TNA, Manual).",
        validationErrorMessage: "Source is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { id: "Performance", name: "Performance" },
            { id: "Tna", name: "TNA" },
            { id: "Manual", name: "Manual" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Source",
        accessorKey: "source",
      },
    } as FieldLevelMeta),
    targetOrganizationNodeIds: z.array(z.string()).meta({
      formRelated: {
        inputType: "auto-complete",
        section: "Targeting",
        label: "Target Nodes",
        placeholder: "Select nodes",
        description: "Target organization nodes.",
        validationErrorMessage: "At least one node is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: organizationSchema,
        },
      },
    } as FieldLevelMeta),
    estimatedBudget: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Estimated Budget",
          placeholder: "Enter estimated budget",
          description: "The estimated financial cost for the training.",
        },
        tableRelated: {
          header: "Budget",
          accessorKey: "estimatedBudget",
        },
      } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter request description",
          description: "Detailed description of the training need.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    skillGap: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Skill Gap",
          placeholder: "Describe the skill gap",
          description: "The specific skill gap this training aims to address.",
        },
        tableRelated: {
          header: "Skill Gap",
          accessorKey: "skillGap",
        },
      } as FieldLevelMeta),
    category: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Category",
              placeholder: "Select request category",
              description: "The category of the training request.",
              validationErrorMessage: "Category is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/trainingRequestCategories",
                getOptionsLabel: (value) => value.title,
                getOptionsValue: (value) => value.id,
                // createSchema: trainingRequestCategorySchema,
                // allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Category",
              accessorKey: "category.title",
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Category",
          accessorKey: "category.title",
        },
      } as FieldLevelMeta),
    bundle: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Training Bundle",
              placeholder: "Select training bundle",
              description: "The bundle this request is part of (if any).",
              validationErrorMessage: "Invalid bundle selection.",
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/trainingRequestBundles",
                getOptionsLabel: (value) => value.title,
                getOptionsValue: (value) => value.id,
                // createSchema: trainingRequestBundleSchema,
                // allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Bundle",
              accessorKey: "bundle.title",
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Bundle",
          accessorKey: "bundle.title",
        },
      } as FieldLevelMeta),
    createdByUserId: userId({
      section: "General",
      required: true,
      label: "Created By",
    }),
    ...dateTime,
  })
  .meta({
    tableName: "Training Requests",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequests",
    formName: "trainingRequest",
    allowDelete: true,
    createTitle: "Create Training Request",
    sections: ["General", "Details", "Targeting", "Relations"],
    editTitle: "Edit Training Request",
  } as SchemaMeta);
export const trainingRequestTargetEmployeeSchema = z
  .object({
    id,
    employee: employeeId("General"),
    request: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Training Request",
            placeholder: "Select training request",
            description: "The associated training request.",
            validationErrorMessage: "Training request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: trainingRequestSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request Title",
            accessorKey: "request.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Request",
          accessorKey: "request.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Request Target Employees",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequestTargetEmployees",
    formName: "trainingRequestTargetEmployee",
    allowDelete: true,
    createTitle: "Add Target Employee",
    sections: ["General"],
    editTitle: "Edit Target Employee Link",
  } as SchemaMeta);

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
        id: z.string().meta({
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
              createSchema: undefined,
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

const questionsConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Questions",
      description: "Select Questions.",
      section: "General",
      required: true,
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/trainingNeedQuestions",
        getOptionsLabel: (value) => value.question,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: trainingNeedQuestionSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();

export const questions = z
  .object({ connect: questionsConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",

      section: "General",
    },
  } as FieldLevelMeta);

export const requestsConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Requests",
      description: "Select Requests.",
      section: "General",
      required: true,
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
        getOptionsLabel: (value) => value.title,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: trainingRequestSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();

export const requests = z
  .object({ connect: requestsConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",

      section: "General",
    },
  } as FieldLevelMeta);
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
              // createSchema: tnaSurveyTemplateSchema,
              // allowCreateNew: true,
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
export const trainingRequestTnaSchema = z
  .object({
    id,
    request: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Request",
            placeholder: "Select training request",
            description: "The associated training request.",
            validationErrorMessage: "Training request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request Title",
            accessorKey: "request.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Request",
          accessorKey: "request.title",
        },
      } as FieldLevelMeta),
    survey: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "TNA Survey",
            placeholder: "Select TNA survey",
            description: "The associated training need survey.",
            validationErrorMessage: "TNA survey is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingNeedSurveys",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: trainingNeedSurveySchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Survey name",
            accessorKey: "survey.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "TNA Survey",
          accessorKey: "survey.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Request TNA Links",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequestTnas",
    formName: "trainingRequestTna",
    allowDelete: true,
    createTitle: "Link TNA Survey to Request",
    sections: ["Relations"],
    editTitle: "Edit TNA Link",
  } as SchemaMeta);
export const tnaConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "surveys",
      description: "Select surveys.",
      section: "General",
      required: true,
      conditional: {
        dependsOn: "source",
        showIf: "Tna",
      },
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/trainingRequestTnas",
        getOptionsLabel: (value) => value.survey?.name,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: trainingRequestTnaSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();

export const employeeConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Target Employees",
      description: "Select targets.",
      section: "General",
      conditional: {
        dependsOn: "source",
        showIf: "Manual",
      },
      required: true,
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint:
          "https://api.techbee.et/api/hr/trainingRequestTargetEmployees",
        getOptionsLabel: (value) =>
          value.employee?.firstName + " " + value.employee?.fatherName,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: trainingRequestTargetEmployeeSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();
export const tnaLinks = z
  .object({ connect: tnaConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",

      section: "General",
    },
  } as FieldLevelMeta);
export const targetEmployeeLinks = z
  .object({ connect: employeeConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",

      section: "General",
    },
  } as FieldLevelMeta);
export const trainingRequestAppraisalEvaluationSchema = z
  .object({
    id,
    subject: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Appraisal subjects",
            placeholder: "Select appraisal subjects",
            description: "The appraisal subject linked to the request.",
            validationErrorMessage: "Appraisal subject is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint:
                "https://api.techbee.et/api/hr/appraisalPlanSubjects",
              getOptionsLabel: (value) =>
                value.employee?.firstName + " " + value.employee?.fatherName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: appraisalPlanSubjectSchema,
            },
          },
          tableRelated: {
            header: "Evaluation Title",
            accessorKey: "evaluation.employee?.firstName",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Appraisal Evaluation",
          accessorKey: "evaluation.plan?.title",
        },
      } as FieldLevelMeta),
    request: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Request",
            placeholder: "Select training request",
            description: "The associated training request.",
            validationErrorMessage: "Training request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request Title",
            accessorKey: "request.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Request",
          accessorKey: "request.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Request Evaluation Links",
    apiEndPoint:
      "https://api.techbee.et/api/hr/trainingRequestAppraisalSubjects",
    formName: "trainingRequestAppraisalEvaluation",
    allowDelete: true,
    createTitle: "Link Evaluation to Request",
    sections: ["Relations"],
    editTitle: "Edit Evaluation Link",
  } as SchemaMeta);
const subjectsConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Subjects",
      description: "Select employees who will be evaluated.",
      section: "General",
      required: true,
      relationConnectKey: "employee",
      conditional: {
        dependsOn: "source",
        showIf: "Performance",
      },
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint:
          "https://api.techbee.et/api/hr/trainingRequestAppraisalSubjects",
        getOptionsLabel: (value) =>
          value.subject?.employee?.firstName +
          " " +
          value.subject?.employee?.fatherName,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: trainingRequestAppraisalEvaluationSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();

export const subjects = z
  .object({ connect: subjectsConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",
      relationConnectKey: "employee",

      section: "General",
    },
  } as FieldLevelMeta);
