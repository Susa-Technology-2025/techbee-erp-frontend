import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id } from "@/lib/schemas/common-schemas";
import { candidateSchema } from "./candidate";

export const candidateDocumentSchema = z
  .object({
    id,
    candidate: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Candidate",
            placeholder: "Select candidate",
            description: "The candidate associated with this document.",
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
            accessorKey: "candidate.firstName",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Candidate",
          accessorKey: "candidate.id",
          Cell: ({ row }) =>
            row.original.candidate.firstName +
            " " +
            row.original.candidate.lastName,
        },
      } as FieldLevelMeta),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter title",
        description: "Title of the document.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    url: z.url().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "URL",
        placeholder: "Enter URL",
        description: "URL of the document.",
        validationErrorMessage: "A valid URL is required.",
        required: true,
      },
      tableRelated: {
        header: "URL",
        accessorKey: "url",
      },
    } as FieldLevelMeta),
  })
  .meta({
    tableName: "Candidate Document",
    apiEndPoint: "https://api.techbee.et/api/hr/candidateDocuments",
    formName: "candidateDocument",
    allowDelete: true,
    createTitle: "Create Candidate Document",
    sections: ["General"],
    editTitle: "Edit Candidate Document",
  } as SchemaMeta);
