import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { pipelineStageSchema } from "./pipeline";
import { JobRequisitionCreateInputSchema } from "./job-req";
import { candidateSchema } from "./candidate";
import ApplicationDetailsDialog from "./applicant-detail-modal";

export const ApplicationCreateInput = z
  .object({
    id,
    // background: z
    //   .object({
    //     id: z.string().meta({
    //       formRelated: {
    //         inputType: "auto-complete",
    //         section: "General",
    //         label: "Background Check",
    //         placeholder: "Select background check",
    //         description:
    //           "The background check associated with this application.",
    //         validationErrorMessage: "Background check is required.",
    //         required: true,
    //         autoComplete: {
    //           multiple: false,
    //           async: true,
    //           getEndpoint: "https://api.techbee.et/api/core/backgroundChecks",
    //           getOptionsLabel: (value) => value.id,
    //           getOptionsValue: (value) => value.id,
    //           allowCreateNew: true,
    //         },
    //       },
    //       tableRelated: {
    //         header: "Background Check",
    //         accessorKey: "background.id",
    //       },
    //     } as FieldLevelMeta),
    //   })
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "object",
    //     },
    //     tableRelated: {
    //       header: "Background Check",
    //       accessorKey: "background.id",
    //     },
    //   } as FieldLevelMeta),
    candidate: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Candidate",
            placeholder: "Select candidate",
            description: "The candidate for this application.",
            validationErrorMessage: "Candidate is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/candidates",
              getOptionsLabel: (value) =>
                value.firstName + " " + value.fatherName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: candidateSchema,
            },
          },
          tableRelated: {
            header: "Candidate",
            accessorKey: "candidate.id",
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
          header: "Candidate",
          accessorKey: "candidate.id",
          Cell: ({ row }) =>
            row.original?.candidate?.firstName +
            " " +
            row.original?.candidate?.fatherName,
        },
      } as FieldLevelMeta),
    // currentStage: z
    //   .object({
    //     id: z.string().meta({
    //       formRelated: {
    //         inputType: "auto-complete",
    //         section: "General",
    //         label: "Current Stage",
    //         placeholder: "Select current stage",
    //         description: "The current stage in the hiring pipeline.",
    //         validationErrorMessage: "Current stage is required.",
    //         required: true,
    //         autoComplete: {
    //           multiple: false,
    //           async: true,
    //           getEndpoint: "https://api.techbee.et/api/hr/pipelineStages",
    //           getOptionsLabel: (value) => value.name,
    //           getOptionsValue: (value) => value.id,
    //           allowCreateNew: true,
    //           createSchema: pipelineStageSchema,
    //         },
    //       },
    //     } as FieldLevelMeta),
    //   })
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "object",
    //     },
    //     tableRelated: {
    //       header: "Current Stage",
    //       accessorKey: "currentStage.name",
    //     },
    //   } as FieldLevelMeta),
    // offer: z
    //   .object({
    //     id: z.string().meta({
    //       formRelated: {
    //         inputType: "auto-complete",
    //         section: "General",
    //         label: "Offer",
    //         placeholder: "Select offer",
    //         description: "The offer associated with this application.",
    //         validationErrorMessage: "Offer is required.",
    //         required: true,
    //         autoComplete: {
    //           multiple: false,
    //           async: true,
    //           getEndpoint: "https://api.techbee.et/api/core/offers",
    //           getOptionsLabel: (value) => value.id,
    //           getOptionsValue: (value) => value.id,
    //           allowCreateNew: true,
    //         },
    //       },
    //       tableRelated: {
    //         header: "Offer",
    //         accessorKey: "offer.id",
    //       },
    //     } as FieldLevelMeta),
    //   })
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "object",
    //     },
    //     tableRelated: {
    //       header: "Offer",
    //       accessorKey: "offer.id",
    //     },
    //   } as FieldLevelMeta),
    // refuseReason: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "auto-complete",
    //       section: "General",
    //       label: "Refuse Reason",
    //       placeholder: "Select refuse reason",
    //       description: "Reason for rejecting the application.",
    //       validationErrorMessage: "Refuse reason is required.",
    //       required: false,
    //       autoComplete: {
    //         multiple: false,
    //         async: false,
    //         options: [
    //           { label: "Job Filled", value: "JobFilled" },
    //           { label: "Not Qualified", value: "NotQualified" },
    //           { label: "Budget Constraints", value: "BudgetConstraints" },
    //           { label: "Other", value: "Other" },
    //         ],
    //         allowCreateNew: false,
    //         getOptionsLabel: (value) => value.label,
    //         getOptionsValue: (value) => value.value,
    //       },
    //     },
    //     tableRelated: {
    //       header: "Refuse Reason",
    //       accessorKey: "refuseReason",
    //     },
    //   } as FieldLevelMeta),
    requisition: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Job Requisition",
            placeholder: "Select job requisition",
            description: "The job requisition for this application.",
            validationErrorMessage: "Job requisition is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/jobRequisitions",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: JobRequisitionCreateInputSchema,
            },
          },
          tableRelated: {
            header: "Job Requisition",
            accessorKey: "requisition.title",
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
          header: "Job Requisition",
          accessorKey: "requisition.id",
          Cell: ({ row }) => row.original?.requisition?.title,
        },
      } as FieldLevelMeta),

    // ...dateTime,
  })
  .meta({
    tableName: "Applications",
    apiEndPoint: "https://api.techbee.et/api/hr/applications",
    formName: "applicationForm",
    allowDelete: true,
    createTitle: "Create Application",
    sections: ["General"],
    editTitle: "Edit Application",
    DetailModal: ApplicationDetailsDialog,
  } as SchemaMeta);
