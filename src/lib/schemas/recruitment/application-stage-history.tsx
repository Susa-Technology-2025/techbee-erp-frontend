import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { dateTime, id } from "@/lib/schemas/common-schemas";
import { pipelineStageSchema } from "./pipeline";
import { application } from "../nested-reusable-objects";

export const applicationStageHistorySchema = z
  .object({
    id: id,
    application,
    notes: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Notes",
        placeholder: "Enter notes",
        description: "Additional notes for the application stage history.",
        validationErrorMessage: "Notes are required.",
        required: true,
      },
      tableRelated: {
        header: "Notes",
        accessorKey: "notes",
      },
    } as FieldLevelMeta),
    stage: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Stage",
            placeholder: "Select stage",
            description: "The pipeline stage for this history record.",
            validationErrorMessage: "Stage is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/pipelineStages",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: pipelineStageSchema,
            },
          },
          tableRelated: {
            header: "Stage",
            accessorKey: "stage.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Stage",
          accessorKey: "stage.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Application Stage History",
    apiEndPoint: "https://api.techbee.et/api/hr/applicationStageHistories",
    formName: "applicationStageHistory",
    allowDelete: true,
    createTitle: "Create Application Stage History",
    sections: ["General"],
    editTitle: "Edit Application Stage History",
  } as SchemaMeta);
