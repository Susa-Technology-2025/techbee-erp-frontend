import z from "zod";
import { employeeSchema } from "../emp-for-contract";
import { FieldLevelMeta } from "../types";
import { appraisalPlanSubjectSchema } from "./plan-subject";
import { appraisalPlanEvaluatorSchema } from "./plan-evaluator";

const evaluatorsConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Evaluators",
      description: "Select employees who will perform the evaluation.",
      section: "General",
      relationConnectKey: "evaluator",
      required: true,
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/appraisalPlanEvaluators",
        getOptionsLabel: (value) =>
          value.evaluator?.firstName +
          " " +
          value.evaluator?.fatherName +
          "/" +
          value.evaluator?.type,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: appraisalPlanEvaluatorSchema,
      },
    },
  })
  .optional()
  .nullable();

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
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/appraisalPlanSubjects",
        getOptionsLabel: (value) =>
          value.employee?.firstName + " " + value.employee?.fatherName,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: appraisalPlanSubjectSchema,
      },
    },
  })
  .optional()
  .nullable();

export const evaluators = z
  .object({ connect: evaluatorsConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",
      relationConnectKey: "evaluator",

      section: "General",
    },
  } as FieldLevelMeta);

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
