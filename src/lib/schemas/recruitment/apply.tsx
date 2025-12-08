import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const applySchema = z
  .object({
    id,

    posting: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Candidate",
            label: "Posting",
            placeholder: "Select posting",
            description: "The job posting for the application.",
            validationErrorMessage: "Posting is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/jobPostings",
              getOptionsLabel: (value) => value.requisition?.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Posting",
          accessorKey: "requisition.position.title",
        },
      } as FieldLevelMeta),

    candidate: z
      .object({
        firstName: z.string().meta({
          formRelated: {
            inputType: "text-field",
            label: "First Name",
            placeholder: "Enter first name",
            description: "The candidate's first name.",
            validationErrorMessage: "First name is required.",
            section: "Candidate",
            required: true,
          },
          tableRelated: {
            header: "First Name",
            accessorKey: "candidate.firstName",
          },
        } as FieldLevelMeta),

        fatherName: z.string().meta({
          formRelated: {
            inputType: "text-field",
            label: "father Name",
            placeholder: "Enter father name",
            description: "The candidate's father name.",
            validationErrorMessage: "father name is required.",
            section: "Candidate",
            required: true,
          },
          tableRelated: {
            header: "Last Name",
            accessorKey: "candidate.fatherName",
          },
        } as FieldLevelMeta),

        email: z
          .email()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              label: "Email",
              placeholder: "Enter email",
              description: "The candidate's email address.",
              validationErrorMessage: "A valid email is required.",
              section: "Candidate",
              required: true,
            },
            tableRelated: {
              header: "Email",
              accessorKey: "candidate.email",
            },
          } as FieldLevelMeta),

        phone: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              label: "Phone Number",
              placeholder: "Enter phone number",
              description: "The candidate's phone number.",
              validationErrorMessage: "Phone number is required.",
              section: "Candidate",
              required: true,
            },
            tableRelated: {
              header: "Phone",
              accessorKey: "candidate.phone",
            },
          } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "candidate",
          accessorKey: "candidate.id",
          Cell: ({ row }) =>
            row.original.candidate?.firstName +
            " " +
            row.original.candidate?.lastName,
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Job Applications",
    apiEndPoint: "https://api.techbee.et/api/hr/applications/apply",
    formName: "applicationForm",
    allowDelete: true,
    createTitle: "Create Application",
    editTitle: "Edit Application",
    sections: ["Candidate"],
    mergePoint: "answers",
  } as SchemaMeta);
