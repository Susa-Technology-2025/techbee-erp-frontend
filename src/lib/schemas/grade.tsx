import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

// GradeCreateInput Schema
export const gradeSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Grade Name",
        placeholder: "Enter grade name (e.g., Level 1, Senior)",
        description: "The title or name of the organizational grade.",
        validationErrorMessage: "Grade name is required.",
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
          placeholder: "Enter grade code",
          description: "An optional unique code for the grade.",
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),
    minSalary: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Salary Range",
          inputType: "number-field",
          label: "Minimum Salary",
          placeholder: "Enter minimum salary",
          description: "The minimum salary for this grade.",
        },
        tableRelated: {
          header: "Min Salary",
          accessorKey: "minSalary",
        },
      } as FieldLevelMeta),
    maxSalary: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Salary Range",
          inputType: "number-field",
          label: "Maximum Salary",
          placeholder: "Enter maximum salary",
          description: "The maximum salary for this grade.",
        },
        tableRelated: {
          header: "Max Salary",
          accessorKey: "maxSalary",
        },
      } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(true)
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Active",
          description: "Determines if the grade is currently in use.",
          required: true,
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Grades",
    apiEndPoint: "https://api.techbee.et/api/hr/grades",
    formName: "grade",
    allowDelete: true,
    createTitle: "Create Grade",
    sections: ["General", "Salary Range"],
    editTitle: "Edit Grade",
  } as SchemaMeta);
