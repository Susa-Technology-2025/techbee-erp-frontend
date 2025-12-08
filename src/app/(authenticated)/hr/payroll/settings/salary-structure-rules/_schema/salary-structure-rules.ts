import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { salaryRuleSchema } from "@/lib/schemas/payroll/salary-rule";
import { salaryStructureSchema } from "@/lib/schemas/salary-structure";

// Assuming a specific schema for SalaryRule and SalaryStructure exists for the createSchema property.
// For the purpose of this example, we'll use placeholder schemas.
// NOTE: Replace these with your actual imported schemas if they exist.
// const salaryRuleSchema = z.object({ id: z.string(), name: z.string() });
// const salaryStructureSchema = z.object({ id: z.string(), name: z.string() });

export const salaryStructureRuleSchema = z
  .object({
    // salaryRule: SalaryRuleWhereUniqueInput
    salaryRule: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Salary Rule",
            placeholder: "Select the salary rule",
            description:
              "The specific rule governing this salary configuration.",
            validationErrorMessage: "Salary Rule is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/salaryRules", // Placeholder endpoint
              getOptionsLabel: (value: any) => value.name,
              getOptionsValue: (value: any) => value.id,
              createSchema: salaryRuleSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Salary Rule ID",
            accessorKey: "salaryRule.id",
            // Assuming you might want to display the rule's name in a table
            // header: "Salary Rule",
            // accessorKey: "salaryRule.name",
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
          header: "Salary Rule",
          accessorKey: "salaryRule.name",
        },
      } as FieldLevelMeta),

    // salaryStructure: SalaryStructureWhereUniqueInput
    salaryStructure: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Salary Structure",
            placeholder: "Select the salary structure",
            description:
              "The associated salary structure for this configuration.",
            validationErrorMessage: "Salary Structure is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/salaryStructures", // Placeholder endpoint
              getOptionsLabel: (value: any) => value.name,
              getOptionsValue: (value: any) => value.id,
              createSchema: salaryStructureSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Salary Structure ID",
            accessorKey: "salaryStructure.id",
            // Assuming you might want to display the structure's name in a table
            // header: "Salary Structure",
            // accessorKey: "salaryStructure.name",
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
          header: "Salary Structure",
          accessorKey: "salaryStructure.name",
        },
      } as FieldLevelMeta),

    // sequence: number
    sequence: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Sequence",
        placeholder: "Enter sequence number",
        description:
          "Order in which this rule is processed (lower number is higher priority).",
        validationErrorMessage: "Sequence is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Sequence",
        accessorKey: "sequence",
      },
    } as FieldLevelMeta),

    // You can optionally include `id` and `dateTime` from common-schemas if this is an existing object being edited/viewed
    id,
    ...dateTime,
  })
  .meta({
    tableName: "Salary Structure Rules",
    apiEndPoint: "https://api.techbee.et/api/hr/salaryStructureRules",
    formName: "salary Structure Rule",
    allowDelete: true,
    createTitle: "Create Salary Structure Rule Configuration",
    editTitle: "Edit Salary Policy Configuration",
    sections: ["General"],
  } as SchemaMeta);
