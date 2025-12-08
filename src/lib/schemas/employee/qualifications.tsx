import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const QualificationCreateInputSchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "A unique code for the qualification.",
        validationErrorMessage: "Code is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(true)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Active",
          description: "Indicates if the qualification is active.",
          section: "General",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the qualification.",
        validationErrorMessage: "Name is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Qualifications",
    apiEndPoint: "https://api.techbee.et/api/hr/qualifications",
    formName: "qualification",
    allowDelete: true,
    createTitle: "Create Qualification",
    sections: ["General"],
    editTitle: "Edit Qualification",
  } as SchemaMeta);

const qualificationsConnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Qualifications",
      description: "Select Qualifcations.",
      section: "General",
      required: true,
      relationConnectKey: "employee",
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/qualifications",
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: QualificationCreateInputSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();

export const qualifications = z
  .object({ connect: qualificationsConnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",
      section: "General",
    },
  } as FieldLevelMeta);
