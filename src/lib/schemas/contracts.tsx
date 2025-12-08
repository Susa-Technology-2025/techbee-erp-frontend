import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";
import { employeeSchema } from "./emp-for-contract";
import { salaryStructureSchema } from "./salary-structure";
import { Box, Chip, Typography } from "@mui/material";
import { preprocessedDate, dateCell } from "./time-parser";
import { employeeId } from "./nested-reusable-objects";

export const contractSchema = z
  .object({
    id,

    baseSalary: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Base Salary",
        placeholder: "Enter base salary",
        description: "The base salary for the contract.",
        validationErrorMessage: "Base salary is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Base Salary",
        accessorKey: "baseSalary",
      },
    } as FieldLevelMeta),

    employee: employeeId("General"),

    endDate: preprocessedDate
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "End Date",
          section: "General",
          placeholder: "Select end date",
          description: "The contract's end date.",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "End Date",
          accessorKey: "endDate",
        },
      } as FieldLevelMeta),

    salaryStructure: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              section: "General",
              inputType: "auto-complete",
              label: "Salary Structure",
              placeholder: "Select salary structure",
              description: "The salary structure for the contract.",
              validationErrorMessage: "Salary structure is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                options: undefined,
                allowCreateNew: true,
                createSchema: salaryStructureSchema,
                getEndpoint: "https://api.techbee.et/api/hr/salaryStructures",
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
          header: "Salary Structure",
          accessorKey: "salaryStructure.code",
        },
      } as FieldLevelMeta),

    startDate: preprocessedDate.meta({
      formRelated: {
        section: "General",
        inputType: "date-time",
        label: "Start Date",
        placeholder: "Select start date",
        description: "The contract's start date.",
        validationErrorMessage: "Start date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Start Date",
        accessorKey: "startDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),

    status: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Status",
        description: "The status of the contract.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Draft", "Active", "OnHold", "Terminated"],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),

    terms: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-area",
          label: "Terms",
          section: "General",
          placeholder: "Enter contract terms",
          description: "Additional terms and conditions of the contract.",
        },
        tableRelated: {
          header: "Terms",
          accessorKey: "terms",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Contracts",
    apiEndPoint: "https://api.techbee.et/api/hr/contracts",
    allowDelete: true,
    formName: "contract",
    createTitle: "Create Contract",
    sections: ["General"],
    editTitle: "Edit Contract",
  } as SchemaMeta);

export type ContractSchema = z.infer<typeof contractSchema>;
