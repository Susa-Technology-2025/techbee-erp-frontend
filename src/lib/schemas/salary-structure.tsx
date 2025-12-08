import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";
import { organizationSchema } from "./organization-node";

export const salaryStructureSchema = z
  .object({
    id,

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    code: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Code",
          placeholder: "Enter code",
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),

    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter description",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "General",
          label: "Organization Node",
          placeholder: "Enter organization node",
          description: "Organization node the salary structure belongs to.",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            createSchema: organizationSchema,
            getEndpoint: "https://core.api.techbee.et/api/organizationNodes",
            getOptionsLabel: (opt) => opt.name + " " + opt.code,
            getOptionsValue: (opt) => opt.id,
          },
        },
        tableRelated: {
          header: "Organization Node",
          accessorKey: "organizationNodeId",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "SalaryStructure",
    apiEndPoint: "https://api.techbee.et/api/hr/salaryStructures",
    formName: "salaryStructure",
    allowDelete: true,
    sections: ["General"],
    createTitle: "Create Salary Structure",
    editTitle: "Edit Salary Structure",
  } as SchemaMeta);

export type SalaryStructureSchema = z.infer<typeof salaryStructureSchema>;
