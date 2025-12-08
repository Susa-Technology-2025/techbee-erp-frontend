import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDate } from "@/lib/schemas/time-parser";
import { appraisalPlanSchema } from "./appraisal-plan";
import { employeeSchema } from "../employees";
import AppraisalDialog from "./evaluation-detail";

export const appraisalEvaluationSchema = z
  .object({
    id,

    evaluator: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Evaluator Employee",
            placeholder: "Select evaluator",
            description: "The employee conducting the evaluation.",
            validationErrorMessage: "Evaluator is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/employees",
              getOptionsLabel: (value) =>
                value.firstName + " " + value.fatherName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: employeeSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
          description: "Details of the employee who is the evaluator.",
        },
        tableRelated: {
          header: "Evaluator",
          accessorKey: "evaluator.employee?firstName",
        },
      } as FieldLevelMeta),
    score: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "number-field",
          section: "General",
          label: "Final Score",
          placeholder: "Enter final score",
          validationErrorMessage: "Final score must be a number.",
          description: "The overall final numerical score of the appraisal.",
          hidden: true,
        },
        tableRelated: {
          header: "Final Score",
          accessorKey: "score",
        },
      } as FieldLevelMeta),
    plan: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Appraisal Plan",
            placeholder: "Select appraisal plan",
            validationErrorMessage: "Appraisal plan is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/appraisalPlans",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: appraisalPlanSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
          description: "The appraisal plan that this evaluation is a part of.",
        },
        tableRelated: {
          header: "Appraisal Plan",
          accessorKey: "plan.name",
        },
      } as FieldLevelMeta),

    status: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "General",
          label: "Status",
          disabled: true,
          placeholder: "Select status",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Draft", "Submitted", "Finalized", "Returned"],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
          description:
            "The current workflow status of the appraisal evaluation.",
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Appraisal Evaluations",
    apiEndPoint: "https://api.techbee.et/api/hr/appraisalEvaluations",
    formName: "appraisalEvaluation",
    allowDelete: true,
    createTitle: "Create Appraisal Evaluation",
    editTitle: "Edit Appraisal Evaluation",
    mergePoint: "answers",
    DetailModal: AppraisalDialog,
    viewOnly: true,

    sections: ["General"],
  } as SchemaMeta);
