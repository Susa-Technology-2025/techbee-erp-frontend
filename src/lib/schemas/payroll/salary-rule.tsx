import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import { createExpressionSchema } from "@/lib/schemas/reusable/expressions";
import { orgology } from "@/lib/schemas/nested-reusable-objects";
import { salaryRuleCategorySchema } from "./salary-rule-categories";

const expressionMeta = {
  formRelated: {
    inputType: "expression-field",
    label: "Calculation Expression",
    placeholder: "Enter the mathematical expression",
    description: "Use allowed variables to define the expression.",
    validationErrorMessage:
      "A valid expression is required. Click the search icon to see allowed variables.",
    section: "Conditional Expression",
    required: true,
    expression: {
      allowedVariablesEndpoint:
        "https://hr.api.techbee.et/api/salaryRules/availableDictionary",
      getVariables: (data) => data.map((item) => item.key),
    },
  },
  tableRelated: {
    header: "Expression",
    accessorKey: "expression",
  },
} as FieldLevelMeta;

const formulaMeta = {
  formRelated: {
    section: "Calculation Details",
    inputType: "expression-field",
    label: "Formula",
    placeholder: "Enter formula",
    description: "The formula for calculation.",
    validationErrorMessage: "Formula is required.",
    conditional: {
      dependsOn: "calculationType",
      showIf: "Formula",
    },
    expression: {
      allowedVariablesEndpoint:
        "https://hr.api.techbee.et/api/salaryRules/availableDictionary",
      getVariables: (data) => data.map((item) => item.key),
    },
  },
  tableRelated: {
    header: "Formula",
    accessorKey: "formula",
  },
} as FieldLevelMeta;

export const salaryRuleSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General Information",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the salary rule.",
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
          section: "General Information",
          inputType: "text-field",
          label: "Code",
          placeholder: "Enter code",
          description: "Unique code for the salary rule.",
          validationErrorMessage: "Code is required.",
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),

    externalCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-field",
          label: "External Code",
          placeholder: "Enter external code",
          description: "External code for the salary rule.",
          validationErrorMessage: "External code is required.",
        },
        tableRelated: {
          header: "External Code",
          accessorKey: "externalCode",
        },
      } as FieldLevelMeta),

    isDeduction: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          validationErrorMessage: "Required",
          label: "Is Deduction",
          description: "Indicates if the rule is a deduction.",
        },
        tableRelated: {
          header: "Is Deduction",
          accessorKey: "isDeduction",
        },
      } as FieldLevelMeta),
    affectsNet: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          validationErrorMessage: "Required",
          label: "Affects Net",
          description: "Indicates if the rule affects net salary.",
        },
        tableRelated: {
          header: "Affects Net",
          accessorKey: "affectsNet",
        },
      } as FieldLevelMeta),
    isTaxBase: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          validationErrorMessage: "Required",
          label: "Is Tax base",
          description: "Indicates if the rule is a tax base.",
        },
        tableRelated: {
          header: "Is Tax Base",
          accessorKey: "isTaxBase",
        },
      } as FieldLevelMeta),

    isTaxable: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          validationErrorMessage: "Required",
          label: "Is Taxable",
          description: "Indicates if the rule is a taxable salary rule.",
        },
        tableRelated: {
          header: "Is Taxable",
          accessorKey: "isTaxable",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          label: "Is Active",
          description: "Indicates if the salary rule is active.",
          required: true,
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    sequence: z.number().meta({
      formRelated: {
        section: "General Information",
        inputType: "number-field",
        label: "Sequence",
        placeholder: "Enter sequence number",
        description: "The sequence number for the salary rule.",
        validationErrorMessage: "Sequence is required.",
        required: true,
      },
      tableRelated: {
        header: "Sequence",
        accessorKey: "sequence",
      },
    } as FieldLevelMeta),

    activeFrom: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Validity & Scope",
          inputType: "date-time",
          label: "Active from",
          placeholder: "Select active start date",
          description: "The date from which the rule is active.",
          validationErrorMessage: "Active from date is required.",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Active From",
          accessorKey: "activeFrom",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    activeTo: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Validity & Scope",
          inputType: "date-time",
          label: "Active To",
          placeholder: "Select active end date",
          description: "The date until the rule is active.",
          validationErrorMessage: "Active to date is required.",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Active To",
          accessorKey: "activeTo",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),

    category: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Validity & Scope",
            label: "Category",
            placeholder: "Select category",
            description: "The salary rule category.",
            validationErrorMessage: "Category is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/salaryRuleCategories",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: salaryRuleCategorySchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
          validationErrorMessage: "Category is Required",
        },
        tableRelated: {
          header: "Category",
          accessorKey: "category.name",
        },
      } as FieldLevelMeta),

    organizationNodeId: orgology("Validity & Scope"),

    calculationType: z
      .enum([
        "Fixed",
        "PercentageOfRule",
        "PercentageOfCategory",
        "Formula",
        "SplitEqually",
      ])
      .meta({
        formRelated: {
          section: "Calculation Details",
          inputType: "auto-complete",
          label: "Calculation Type",
          placeholder: "Select calculation type",
          description: "The method used to calculate the salary rule.",
          validationErrorMessage: "Calculation type is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              { name: "Fixed", label: "Fixed" },
              { name: "PercentageOfRule", label: "Percentage Of Rule" },
              { name: "PercentageOfCategory", label: "Percentage Of Category" },
              { name: "Formula", label: "Formula" },
            ],
            getOptionsLabel: (option) => option.label,
            getOptionsValue: (option) => option.name,

            allowCreateNew: false,
          },
        },
        tableRelated: {
          header: "Calculation Type",
          accessorKey: "calculationType",
        },
      } as FieldLevelMeta),

    fixedAmount: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Calculation Details",
          inputType: "number-field",
          label: "Fixed Amount",
          placeholder: "Enter fixed amount",
          description: "The fixed amount for the rule.",
          validationErrorMessage: "Fixed amount is required.",
          conditional: {
            dependsOn: "calculationType",
            showIf: "Fixed",
          },
        },
        tableRelated: {
          header: "Fixed Amount",
          accessorKey: "fixedAmount",
        },
      } as FieldLevelMeta),

    percentageOfCategory: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Calculation Details",
              label: "Percentage of Category",
              placeholder: "Select category",
              description: "Category to base percentage on.",
              validationErrorMessage: "Percentage of category is required.",
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/salaryRuleCategories",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                allowCreateNew: true,
              },
              conditional: {
                dependsOn: "calculationType",
                showIf: "PercentageOfCategory",
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
          header: "Percentage of Category",
          accessorKey: "percentageOfCategory.name",
        },
      } as FieldLevelMeta),

    percentageOfRule: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Calculation Details",
              label: "Percentage of Rule",
              placeholder: "Select rule",
              description: "Rule to base percentage on.",
              validationErrorMessage: "Percentage of rule is required.",
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/salaryRules",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
              },
              conditional: {
                dependsOn: "calculationType",
                showIf: "PercentageOfRule",
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
          header: "Percentage of Rule",
          accessorKey: "percentageOfRule.name",
        },
      } as FieldLevelMeta),

    formula: createExpressionSchema(formulaMeta),

    conditionExpression: createExpressionSchema(expressionMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Salary Rule",
    apiEndPoint: "https://api.techbee.et/api/hr/salaryRules",
    formName: "salaryRule",
    allowDelete: true,
    createTitle: "Create Salary Rule",
    sections: [
      "General Information",
      "Validity & Scope",
      "Calculation Details",
      "Conditional Expression",
    ],
    editTitle: "Edit Salary Rule",
  } as SchemaMeta);
