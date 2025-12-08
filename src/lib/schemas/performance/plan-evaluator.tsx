import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { employeeId } from "../nested-reusable-objects";

// Assuming a schema for Employee is available for the autoComplete createSchema
const employeeCreateSchema = z.object({
  id: z.string(),
  // Add actual employee creation fields here
});

// Assuming a schema for AppraisalPlan is available for the autoComplete createSchema
const appraisalPlanCreateSchema = z.object({
  id: z.string(),
  // Add actual appraisal plan creation fields here
});

export const appraisalPlanEvaluatorSchema = z
  .object({
    // Fields from the base schema (omitted in the input, but standard in full schemas)
    id,
    ...dateTime,

    // evaluator: { id: string } - WhereUniqueInput
    evaluator: employeeId("General"),

    // type: string - Enum
    type: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Evaluator Type",
        placeholder: "Select evaluator type",
        description: "The role of the evaluator in the appraisal process.",
        validationErrorMessage: "Type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Self", "Manager", "Peer", "HR", "Final"],
          getOptionsLabel: (value: string) => value,
          getOptionsValue: (value: string) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),

    // weight: number
    weight: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Weight",
          placeholder: "Enter evaluation weight",
          description:
            "The weight/percentage this evaluator's score contributes to the final score.",
          validationErrorMessage: "Weight must be a number.",
        },
        tableRelated: {
          header: "Weight",
          accessorKey: "weight",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Appraisal Plan Evaluators",
    apiEndPoint: "https://api.techbee.et/api/hr/appraisalPlanEvaluators", // Placeholder endpoint
    formName: "appraisalPlanEvaluator",
    allowDelete: true,
    createTitle: "Create Appraisal Evaluator",
    sections: ["General"],
    editTitle: "Edit Appraisal Evaluator",
  } as SchemaMeta);
