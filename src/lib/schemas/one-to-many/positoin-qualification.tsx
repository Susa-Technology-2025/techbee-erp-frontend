import z from "zod";
import { FieldLevelMeta } from "../types";
import { QualificationCreateInputSchema } from "../employee/qualifications";

const qualificationsConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "qualifications",
      description: "Select qualifications.",
      section: "General",
      relationConnectKey: "evaluator",
      required: true,
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/appraisalPlanEvaluators",
        getOptionsLabel: (value) =>
          value.evaluator?.firstName + " " + value.evaluator?.fatherName,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: QualificationCreateInputSchema,
      },
    },
  })
  .optional()
  .nullable();

export const qualifications = z
  .object({ connect: qualificationsConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",
      relationConnectKey: "evaluator",

      section: "General",
    },
  } as FieldLevelMeta);
