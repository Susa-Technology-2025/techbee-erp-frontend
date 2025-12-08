import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { orgology } from "@/lib/schemas/nested-reusable-objects";

export const salaryRuleCategorySchema = z
  .object({
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the salary rule category.",
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
          description: "Unique code for the salary rule category.",
          validationErrorMessage: "Code is required.",
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
          description: "A brief description of the category.",
          validationErrorMessage: "Description is required.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    organizationNodeId: orgology("General"),
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Salary Rule Category",
    apiEndPoint: "https://api.techbee.et/api/hr/salaryRuleCategories",
    formName: "salaryRuleCategory",
    allowDelete: true,
    createTitle: "Create Salary Rule Category",
    sections: ["General"],
    editTitle: "Edit Salary Rule Category",
  } as SchemaMeta);
