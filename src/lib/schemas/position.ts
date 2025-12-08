import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { organizationSchema } from "./organization-node";
import { qualifications } from "./employee/qualifications";
import { gradeSchema } from "./grade";
export const gradeID = ({
  required,
  section,
  label,
}: {
  required: boolean;
  section: string;
  label: string;
  tableHeader?: string;
  tableHeaderAccessorKey?: string;
}) =>
  z
    .object({
      id: z
        .string()
        .optional()
        .nullable()
        .meta({
          formRelated: {
            inputType: "auto-complete",
            label,
            placeholder: "Select employee grade",
            description: "Reference to the employee's grade.",
            validationErrorMessage: "Grade is required.",
            section,
            required,
            autoComplete: {
              multiple: false,
              async: true,
              options: undefined,
              allowCreateNew: true,
              createSchema: gradeSchema,
              getEndpoint: "https://api.techbee.et/api/hr/grades",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
            },
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
        header: "Grade",
        accessorKey: "grade.name",
      },
    } as FieldLevelMeta);

export const positionSchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "Unique code for the position.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

    title: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Title",
          placeholder: "Enter title",
          description: "Title of the position.",
          validationErrorMessage: "Title is required.",
          required: true,
        },
        tableRelated: {
          header: "Title",
          accessorKey: "title",
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
          description: "Description of the position.",
          validationErrorMessage: "Description is required.",
          required: true,
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    grade: gradeID({ section: "General", required: true, label: "Grade" }),
    level: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Level",
          placeholder: "Enter level",
          description: "The seniority level of the position.",
          validationErrorMessage: "Level is required.",
          required: true,
        },
        tableRelated: {
          header: "Level",
          accessorKey: "level",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(true)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "table-only",
          label: "Is Active",
          description: "Indicates if the position is currently active.",
          required: true,
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    isQualificationFixed: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Qualification Fixed",
          description:
            "Indicates if the qualifications for this position are fixed.",
          required: true,
        },
        tableRelated: {
          header: "Is Qualification Fixed",
          accessorKey: "isQualificationFixed",
        },
      } as FieldLevelMeta),

    organizationNodeId: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Organization Node",
        placeholder: "Select organization node",
        description: "The organization node this position belongs to.",
        validationErrorMessage: "Organization node is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://core.api.techbee.et/api/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: organizationSchema,
        },
      },
      tableRelated: {
        header: "Organization Node",
        accessorKey: "organizationNode.name",
      },
    } as FieldLevelMeta),
    qualifications,
    ...dateTime,
  })
  .meta({
    tableName: "Positions",
    apiEndPoint: "https://api.techbee.et/api/hr/positions",
    formName: "position",
    allowDelete: true,
    createTitle: "Create Position",
    sections: ["General"],
    editTitle: "Edit Position",
  } as SchemaMeta);
