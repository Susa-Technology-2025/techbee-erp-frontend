import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { candidateSchema } from "./candidate";
import { userSchema } from "../users";

export const CandidateNoteSchema = z
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
            description: "The candidate the note is about.",
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
            accessorKey: "candidate.name",
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
    authorUserId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Author",
        placeholder: "Enter user",
        description: "The author responsible.",
        validationErrorMessage: "author is required.",
        section: "General",
        required: true,
        autoComplete: {
          async: true,
          userId: true,
          allowCreateNew: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://auth.api.techbee.et/api/users",
        },
      },
      tableRelated: {
        header: "Author",
        accessorKey: "authorUserId",
      },
    } as FieldLevelMeta),
    content: z.string().meta({
      formRelated: {
        section: "Content",
        inputType: "markdown",
        label: "Content",
        placeholder: "Enter note content",
        description: "The main content of the note.",
        validationErrorMessage: "Content is required.",
        required: true,
      },
      tableRelated: {
        header: "Content",
        accessorKey: "content",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Candidate Notes",
    apiEndPoint: "https://api.techbee.et/api/hr/candidateNotes",
    formName: "candidateNote",
    allowDelete: true,
    createTitle: "Create Candidate Note",
    editTitle: "Edit Candidate Note",
    sections: ["General", "Content"],
  } as SchemaMeta);
