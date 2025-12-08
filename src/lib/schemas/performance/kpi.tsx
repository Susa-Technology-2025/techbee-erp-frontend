// Second and Final Output
import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { employeeSchema } from "../employees";
import { orgology } from "../nested-reusable-objects";
import { objectiveSchema } from "./objectives";

export const kpiSchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "Unique code for the KPI.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "Name of the KPI.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    measurementFreq: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Measurement Frequency",
        placeholder: "Select measurement frequency",
        description: "Frequency for measuring the KPI.",
        validationErrorMessage: "Measurement frequency is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Weekly", "Monthly", "Quarterly"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Measurement Frequency",
        accessorKey: "measurementFreq",
      },
    } as FieldLevelMeta),

    measurementMethod: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Measurement Method",
        placeholder: "Select measurement method",
        description: "Method for measuring the KPI.",
        validationErrorMessage: "Measurement method is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Numeric", "Percent", "Qualitative"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Measurement Method",
        accessorKey: "measurementMethod",
      },
    } as FieldLevelMeta),

    targetValue: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Target Value",
          placeholder: "Enter target value",
          description: "The target value for the KPI.",
          validationErrorMessage: "Target value must be a number.",
        },
        tableRelated: {
          header: "Target Value",
          accessorKey: "targetValue",
        },
      } as FieldLevelMeta),

    weight: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Weight",
          placeholder: "Enter weight",
          description: "The weight of the KPI.",
          validationErrorMessage: "Weight must be a number.",
        },
        tableRelated: {
          header: "Weight",
          accessorKey: "weight",
        },
      } as FieldLevelMeta),

    organizationNodeId: orgology("General"),

    objective: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Objective",
            placeholder: "Select objective",
            description: "The associated objective.",
            validationErrorMessage: "Objective is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/objectives", // Example endpoint
              getOptionsLabel: (value) => value.name, // Assuming name exists on objective
              getOptionsValue: (value) => value.id,
              createSchema: objectiveSchema,
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
          header: "Objective",
          accessorKey: "objective.name",
        },
      } as FieldLevelMeta),

    owner: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Owner",
            placeholder: "Select owner",
            description: "The owner of the KPI.",
            validationErrorMessage: "Owner is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/employees",
              getOptionsLabel: (value) =>
                value.firstName + " " + value.fatherName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: employeeSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Owner",
          accessorKey: "owner.name",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "KPI",
    apiEndPoint: "https://api.techbee.et/api/hr/kpis",
    formName: "kpi",
    allowDelete: true,
    createTitle: "Create KPI",
    sections: ["General", "Relations"],
    editTitle: "Edit KPI",
  } as SchemaMeta);
