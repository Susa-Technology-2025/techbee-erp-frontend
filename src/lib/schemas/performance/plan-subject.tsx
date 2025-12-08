import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id } from "@/lib/schemas/common-schemas";
import { employeeId } from "../nested-reusable-objects";
import { EvaluationsDialogue } from "./subjects-evaluation";

export const appraisalPlanSubjectSchema = z
  .object({
    id,

    finalRecommendation: z
      .string()
      .optional() // It's often good practice to make text areas optional/nullable if they might be empty initially
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Final Recommendation",
          placeholder: "Enter final recommendation and comments...",
          description:
            "Overall recommendation and concluding remarks on the employee's performance appraisal.",
          validationErrorMessage: "Recommendation must be a string.",
        },
        tableRelated: {
          header: "Recommendation",
          accessorKey: "finalRecommendation",
          // You might not want to display the full text in the table, so you could omit this or use a custom cell renderer.
          // For now, I'll include it.
        },
      } as FieldLevelMeta),

    employee: employeeId("General"),

    finalScore: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "table-only",
          label: "Score",
          placeholder: "Enter final score",
          description:
            "The final computed or agreed score for the employee's appraisal.",
          validationErrorMessage: "Score must be a number.",
        },
        tableRelated: {
          header: "Score",
          accessorKey: "score",
        },
      } as FieldLevelMeta),

    status: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          section: "General",
          inputType: "table-only",
          label: "Status",
          placeholder: "Select status",
          description: "The current status of the appraisal subject.",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              "Draft",
              "PendingApproval",
              "Approved",
              "Rejected",
              "InformationRequested",
              "Reassigned",
              "Withdrawn",
              "Cancelled",
              "Delete",
              "Closed",
            ],
            getOptionsLabel: (value: string) => value,
            getOptionsValue: (value: string) => value,
            allowCreateNew: false,
          },
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Appraisal Plan Subjects",
    apiEndPoint: "https://api.techbee.et/api/hr/appraisalPlanSubjects",
    formName: "appraisalPlanSubject",
    allowDelete: true,
    createTitle: "Create Appraisal Subject",
    sections: ["General"],
    DetailModal: EvaluationsDialogue,
    editTitle: "Edit Appraisal Subject",
  } as SchemaMeta);
