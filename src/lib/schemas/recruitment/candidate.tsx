import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const candidateSchema = z
  .object({
    id,
    firstName: z.string().meta({
      formRelated: {
        section: "Personal Information",
        inputType: "text-field",
        label: "First Name",
        placeholder: "Enter first name",
        description: "The candidate's first name.",
        validationErrorMessage: "First name is required.",
        required: true,
      },
      tableRelated: {
        header: "First Name",
        accessorKey: "firstName",
      },
    } as FieldLevelMeta),
    lastName: z.string().meta({
      formRelated: {
        section: "Personal Information",
        inputType: "text-field",
        label: "Last Name",
        placeholder: "Enter last name",
        description: "The candidate's last name.",
        validationErrorMessage: "Last name is required.",
        required: true,
      },
      tableRelated: {
        header: "Last Name",
        accessorKey: "lastName",
      },
    } as FieldLevelMeta),
    consentGiven: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Personal Information",
          inputType: "boolean-field",
          label: "Consent Given",
          description: "Indicates if the candidate has given consent.",
          validationErrorMessage: "Consent is required.",
        },
        tableRelated: {
          header: "Consent Given",
          accessorKey: "consentGiven",
        },
      } as FieldLevelMeta),
    email: z
      .email()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Contact Information",
          inputType: "text-field",
          label: "Email",
          placeholder: "Enter email address",
          description: "The candidate's email address.",
          validationErrorMessage: "Invalid email format.",
        },
        tableRelated: {
          header: "Email",
          accessorKey: "email",
        },
      } as FieldLevelMeta),
    phone: z.string().meta({
      formRelated: {
        section: "Contact Information",
        inputType: "text-field",
        label: "Phone",
        placeholder: "Enter phone number",
        description: "The candidate's phone number.",
        validationErrorMessage: "Invalid phone number.",
      },
      tableRelated: {
        header: "Phone",
        accessorKey: "phone",
      },
    } as FieldLevelMeta),
    source: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Source",
          placeholder: "Enter source",
          description: "How the candidate was found.",
          validationErrorMessage: "Source is required.",
        },
        tableRelated: {
          header: "Source",
          accessorKey: "source",
        },
      } as FieldLevelMeta),
    tags: z.array(z.string()).meta({
      formRelated: {
        section: "Details",
        inputType: "chips",
        label: "Tags",
        placeholder: "Enter tags",
        description: "Relevant tags for the candidate.",
        validationErrorMessage: "Tags are required.",
        required: true,
      },
      tableRelated: {
        header: "Tags",
        accessorKey: "tags",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Candidate",
    apiEndPoint: "https://api.techbee.et/api/hr/candidates",
    formName: "candidate",
    allowDelete: true,
    createTitle: "Create Candidate",
    sections: ["Personal Information", "Contact Information", "Details"],
    editTitle: "Edit Candidate",
  } as SchemaMeta);
