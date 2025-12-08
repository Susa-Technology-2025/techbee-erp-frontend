import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { objectiveSchema } from "./objectives";
import { employeeId } from "../nested-reusable-objects";
import { kpiSchema } from "./kpi";

export const goalSchema = z
  .object({
    id,
    description: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Description",
        placeholder: "Enter description",
        description: "A detailed description of the goal.",
        validationErrorMessage: "Description is required.",
        required: true,
      },
      tableRelated: {
        header: "Description",
        accessorKey: "description",
      },
    } as FieldLevelMeta),
    dueDate: z.date().meta({
      formRelated: {
        inputType: "date-time",
        label: "Due Date",
        placeholder: "Select due date",
        description: "The date the goal is expected to be completed.",
        validationErrorMessage: "Due date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Due Date",
        accessorKey: "dueDate",
      },
    } as FieldLevelMeta),
    employee: employeeId("General"),
    kpi: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "General",
              label: "KPI",
              placeholder: "Select a KPI",
              description: "The KPI associated with this goal.",
              validationErrorMessage: "KPI is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/kpis",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                allowCreateNew: true,
                createSchema: kpiSchema,
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
          header: "KPI",
          accessorKey: "kpi.name",
        },
      } as FieldLevelMeta),
    objective: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Objective",
            placeholder: "Select an objective",
            description: "The objective associated with this goal.",
            validationErrorMessage: "Objective is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/objectives",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: objectiveSchema,
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
          header: "Objective",
          accessorKey: "objective.name",
        },
      } as FieldLevelMeta),
    progressPercent: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Progress Percent",
        placeholder: "Enter progress percentage",
        description: "The progress percentage of the goal.",
        validationErrorMessage: "Progress percentage is required.",
        required: true,
      },
      tableRelated: {
        header: "Progress Percent",
        accessorKey: "progressPercent",
      },
    } as FieldLevelMeta),
    startDate: z.date().meta({
      formRelated: {
        inputType: "date-time",
        label: "Start Date",
        placeholder: "Select start date",
        description: "The date the goal is expected to start.",
        validationErrorMessage: "Start date is required.",
        section: "General",
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
      },
    } as FieldLevelMeta),
    status: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Status",
        placeholder: "Select a status",
        description: "The status of the goal.",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Pending", "InProgress", "Completed", "Cancelled"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter title",
        description: "The title of the goal.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    type: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Type",
        placeholder: "Select a type",
        description: "The type of the goal.",
        validationErrorMessage: "Type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Strategic", "Operational", "Developmental"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),
    weight: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Weight",
        placeholder: "Enter weight",
        description: "The weight of the goal.",
        validationErrorMessage: "Weight is required.",
        required: true,
      },
      tableRelated: {
        header: "Weight",
        accessorKey: "weight",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Goals",
    apiEndPoint: "https://api.techbee.et/api/hr/goals",
    formName: "goal",
    allowDelete: true,
    createTitle: "Create Goal",
    editTitle: "Edit Goal",
    sections: ["General"],
  } as SchemaMeta);
