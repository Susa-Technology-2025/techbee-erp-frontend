import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import { performanceCycleSchema } from "./settings";
import { performanceTemplateCreateInputSchema } from "./performance-template";
import { evaluators, subjects } from "./reviewers-id";

export const appraisalPlanSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the appraisal plan.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    approvalStatus: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          section: "no-section",
          inputType: "table-only",
          label: "Approval Status",
          placeholder: "Enter approval status",
          description: "The current approval status of the appraisal plan.",
          validationErrorMessage: "Approval status is required.",
          required: true,
        },
        tableRelated: {
          header: "Approval Status",
          accessorKey: "approvalStatus",
        },
      } as FieldLevelMeta),
    type: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Type",
        placeholder: "Select type",
        description: "The type of the appraisal plan.",
        validationErrorMessage: "Type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            "Standard",
            "Probation",
            // "Review360",
            "Promotion",
            "Custom",
          ],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),
    allowRecommendation: z
      .boolean()
      .default(false)

      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "boolean-field",
          label: "Allow Recommendation",
          description:
            "Indicates if a recommendation is allowed for the appraisal.",
        },
        tableRelated: {
          header: "Allow Recommendation",
          accessorKey: "allowRecommendation",
        },
      } as FieldLevelMeta),
    autoRecommendation: z
      .boolean()
      .default(false)

      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "boolean-field",
          label: "Auto Recommendation",
          description: "Enables automatic recommendation.",
          conditional: {
            dependsOn: "allowRecommendation",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Auto Recommendation",
          accessorKey: "autoRecommendation",
        },
      } as FieldLevelMeta),
    cycle: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Cycle",
            placeholder: "Select cycle",
            description: "The appraisal cycle.",
            validationErrorMessage: "Cycle is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/performanceCycles",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: performanceCycleSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Cycle",
          accessorKey: "cycle.name",
        },
      } as FieldLevelMeta),
    periodStart: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        section: "Period",
        label: "Period Start",
        placeholder: "Select start date",
        description: "The start date of the appraisal period.",
        validationErrorMessage: "Period start date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period Start",
        accessorKey: "periodStart",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    periodEnd: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        section: "Period",
        label: "Period End",
        placeholder: "Select end date",
        description: "The end date of the appraisal period.",
        validationErrorMessage: "Period end date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period End",
        accessorKey: "periodEnd",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    splitEvaluation: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "boolean-field",
          label: "Split Evaluation",
          description: "Indicates if the evaluation should be split.",
        },
        tableRelated: {
          header: "Split Evaluation",
          accessorKey: "splitEvaluation",
        },
      } as FieldLevelMeta),
    allowedEvaluatorRoles: z
      .array(z.string())
      .default([])
      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "table-only",
          label: "Evaluator Roles",
          placeholder: "Select roles",
          description: "evaluator roles.",
          validationErrorMessage: "evaluator roles required.",
          required: true,
          autoComplete: {
            multiple: true,
            async: false,
            options: ["Self", "Manager", "Peer"],
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
            allowCreateNew: false,
          },
        },
        tableRelated: {
          header: "Allowed Roles",
          accessorKey: "allowedEvaluatorRoles",
        },
      } as FieldLevelMeta),

    useGoals: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Weights",
          inputType: "boolean-field",
          label: "Use Goals",
          description: "Indicates if goals should be used in the appraisal.",
        },
        tableRelated: {
          header: "Use Goals",
          accessorKey: "useGoals",
        },
      } as FieldLevelMeta),
    goalWeight: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Weights",
          inputType: "number-field",
          label: "Goal Weight",
          placeholder: "Enter goal weight",
          description: "Weight assigned to goals in the appraisal.",
          conditional: {
            dependsOn: "useGoals",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Goal Weight",
          accessorKey: "goalWeight",
        },
      } as FieldLevelMeta),
    competencyWeight: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Weights",
          inputType: "number-field",
          label: "Competency Weight",
          placeholder: "Enter competency weight",
          description: "Weight assigned to competencies in the appraisal.",
          conditional: {
            dependsOn: "useGoals",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Competency Weight",
          accessorKey: "competencyWeight",
        },
      } as FieldLevelMeta),
    performanceTemplate: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Performance Template",
            placeholder: "Select template",
            description: "The performance template used.",
            validationErrorMessage: "Performance template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/performanceTemplates",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: performanceTemplateCreateInputSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Performance Template",
          accessorKey: "performanceTemplate.name",
        },
      } as FieldLevelMeta),
    evaluators,
    subjects,

    defaultEvaluatorRole: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "auto-complete",
          label: "Default Evaluator Role",
          placeholder: "Select a role",
          description: "The default role for evaluators.",
          validationErrorMessage: "Default evaluator role is required.",
          required: true,
          conditional: {
            dependsOn: "splitEvaluation",
            showIf: false,
          },
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Self", "Manager", "Peer"],
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
            allowCreateNew: false,
          },
        },
        tableRelated: {
          header: "Default Role",
          accessorKey: "defaultEvaluatorRole",
        },
      } as FieldLevelMeta),
    selfRating: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "number-field",
          label: "Self Rating",
          placeholder: "Enter self rating",
          description: "Rating given by the employee to themselves.",
          conditional: {
            dependsOn: "splitEvaluation",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Self Rating",
          accessorKey: "selfRating",
        },
      } as FieldLevelMeta),
    managerRating: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "number-field",
          label: "Manager Rating",
          placeholder: "Enter manager rating",
          description: "Rating given by the manager.",
          conditional: {
            dependsOn: "splitEvaluation",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Manager Rating",
          accessorKey: "managerRating",
        },
      } as FieldLevelMeta),
    peerRating: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Evaluation",
          inputType: "number-field",
          label: "Peer Rating",
          placeholder: "Enter peer rating",
          description: "Rating given by peers.",
          conditional: {
            dependsOn: "splitEvaluation",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Peer Rating",
          accessorKey: "peerRating",
        },
      } as FieldLevelMeta),

    comments: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Comments",
          placeholder: "Add comments here",
          description: "Additional comments for the appraisal plan.",
        },
        tableRelated: {
          header: "Comments",
          accessorKey: "comments",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Appraisal Plan",
    apiEndPoint: "https://api.techbee.et/api/hr/appraisalPlans",
    formName: "appraisalPlan",
    allowDelete: true,
    createTitle: "Create Appraisal Plan",
    sections: [
      "General",
      "Evaluation",
      "Details",
      "Weights",
      "Relations",
      "Period",
    ],
    editTitle: "Edit Appraisal Plan",
  } as SchemaMeta);
