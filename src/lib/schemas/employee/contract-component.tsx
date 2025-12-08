import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDate, dateCell } from "@/lib/schemas/time-parser";
import { contractSchema } from "@/lib/schemas/contracts";
import { salaryRuleSchema } from "@/lib/schemas/payroll/salary-rule";
export const contractComponentSchema = z
  .object({
    id,
    amount: z.number().meta({
      formRelated: {
        section: "Details",
        inputType: "number-field",
        label: "Amount",
        placeholder: "Enter amount",
        description: "The component's amount.",
        validationErrorMessage: "Amount is required.",
        required: true,
      },
      tableRelated: {
        header: "Amount",
        accessorKey: "amount",
      },
    } as FieldLevelMeta),
    contract: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Details",
            label: "Contract",
            placeholder: "Select contract",
            description: "The contract this component belongs to.",
            validationErrorMessage: "Contract is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/contracts",
              getOptionsLabel: (value) =>
                value.employee?.firstName + " " + value.employee?.fatherName,
              getOptionsValue: (value) => value.id,
              createSchema: contractSchema,
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
          header: "Contract",
          accessorKey: "contract.name",
          Cell: ({ row }: any) => {
            return `${row.original.contract?.employee?.firstName} ${row.original.contract?.employee?.fatherName}`;
          },
        },
      } as FieldLevelMeta),
    effectiveFrom: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Effective from",
          placeholder: "Select effective start date",
          description: "The date from where this component is effective.",
          validationErrorMessage: "Invalid date.",
          section: "Details",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Effective From",
          accessorKey: "effectiveFrom",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    effectiveTo: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Effective To",
          placeholder: "Select effective end date",
          description: "The date until this component is effective.",
          validationErrorMessage: "Invalid date.",
          section: "Details",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Effective To",
          accessorKey: "effectiveTo",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          section: "Details",
          inputType: "boolean-field",
          label: "Is Active",
          description: "Marks if the component is currently active.",
          validationErrorMessage: "Is Active is required.",
          required: true,
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "Details",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter component name",
        description: "The name of the contract component.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    salaryRule: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Details",
            label: "Salary Rule",
            placeholder: "Select salary rule",
            description: "The associated salary calculation rule.",
            validationErrorMessage: "Salary Rule is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/salaryRules",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: salaryRuleSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Salary Rule ID",
            accessorKey: "salaryRule.id",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Salary Rule",
          accessorKey: "salaryRule.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Contract Components",
    apiEndPoint: "https://api.techbee.et/api/hr/contractComponents",
    formName: "contractComponent",
    allowDelete: true,
    createTitle: "Create Contract Component",
    sections: ["Details"],
    editTitle: "Edit Contract Component",
  } as SchemaMeta);
