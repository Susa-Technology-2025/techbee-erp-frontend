import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const recommendationRuleCreateInputSchema = z
  .object({
    maxScore: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Max Score",
        placeholder: "Enter max score",
        description: "The maximum score for this rule to apply.",
        validationErrorMessage: "Max score is required.",
        required: true,
      },
      tableRelated: {
        header: "Max Score",
        accessorKey: "maxScore",
      },
    } as FieldLevelMeta),
    minScore: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Min Score",
        placeholder: "Enter min score",
        description: "The minimum score for this rule to apply.",
        validationErrorMessage: "Min score is required.",
        required: true,
      },
      tableRelated: {
        header: "Min Score",
        accessorKey: "minScore",
      },
    } as FieldLevelMeta),
    note: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Note",
          placeholder: "Add a note",
          description: "An optional note for the recommendation rule.",
        },
        tableRelated: {
          header: "Note",
          accessorKey: "note",
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
            description: "The appraisal plan this rule belongs to.",
            validationErrorMessage: "Appraisal plan is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/appraisalPlans",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
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
          header: "Appraisal Plan",
          accessorKey: "plan.name",
        },
      } as FieldLevelMeta),
    recommendation: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Recommendation",
        placeholder: "Select recommendation",
        description: "The type of recommendation.",
        validationErrorMessage: "Recommendation is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            "Promote",
            "Demote",
            "Confirm",
            // "Extend",
            "Terminate",
            "Training",
            "Retain",
            // "Succession",
            "Compensation",
            "NotApplicable",
          ],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Recommendation",
        accessorKey: "recommendation",
      },
    } as FieldLevelMeta),
    // ...dateTime,
  })
  .meta({
    tableName: "Recommendation Rule",
    apiEndPoint: "https://api.techbee.et/api/hr/recommendationRules",
    formName: "recommendationRule",
    allowDelete: true,
    createTitle: "Create Recommendation Rule",
    sections: ["General"],
    editTitle: "Edit Recommendation Rule",
  } as SchemaMeta);
