import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { JobPostingCreateInput } from "./job-posting";

export const pipelineStageSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter stage name",
        description: "The name of the pipeline stage.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    status: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Status",
        placeholder: "Select status",
        description: "The current status of the application.",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { label: "New", value: "New" },
            { label: "Qualified", value: "Qualified" },
            { label: "Interview", value: "Interview" },
            { label: "Offer", value: "Offer" },
            { label: "ContractSigned", value: "ContractSigned" },
            { label: "Rejected", value: "Rejected" },
            { label: "OnHold", value: "OnHold" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),
    posting: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "General",
              label: "Job Posting",
              placeholder: "Select a job requisition",
              description: "The job posting associated with this stage.",
              validationErrorMessage: "Job posting is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/jobPostings",
                getOptionsLabel: (value) => value.requisition?.title,
                getOptionsValue: (value) => value.id,
                allowCreateNew: true,
                createSchema: JobPostingCreateInput,
              },
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
          header: "Posting",
          accessorKey: "posting.requisition?.title",
        },
      } as FieldLevelMeta),
    isTerminal: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Terminal",
          description: "Indicates if this is the final stage of the pipeline.",
        },
        tableRelated: {
          header: "Is Terminal",
          accessorKey: "isTerminal",
        },
      } as FieldLevelMeta),

    sequence: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Sequence",
        placeholder: "Enter sequence number",
        description: "The order of the stage in the pipeline.",
        validationErrorMessage: "Sequence is required.",
        required: true,
      },
      tableRelated: {
        header: "Sequence",
        accessorKey: "sequence",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Pipeline Stage",
    apiEndPoint: "https://api.techbee.et/api/hr/pipelineStages",
    formName: "pipelineStage",
    allowDelete: true,
    createTitle: "Create Pipeline Stage",
    sections: ["General"],
    editTitle: "Edit Pipeline Stage",
  } as SchemaMeta);
