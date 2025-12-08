import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { employeeSchema } from "../employees";
import { orgology } from "../nested-reusable-objects";

export const objectiveSchema = z
  .object({
    id,
    approvalStatus: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "no-section",
          label: "Approval Status",
          placeholder: "Select an approval status",
          description: "The status of the objective's approval.",
          validationErrorMessage: "Approval status is required.",
          disabled: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              "Draft",
              "PendingApproval",
              "Approved",
              "Rejected",
              "InformationRequested",
              "Reassigned",
              "Withdrawn",
              "Cancelled",
              "Delete",
              "Closed",
            ],
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
            allowCreateNew: false,
          },
        },
        tableRelated: {
          header: "Approval Status",
          accessorKey: "approvalStatus",
        },
      } as FieldLevelMeta),
    category: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Category",
        placeholder: "Select a category",
        description: "The category of the objective.",
        validationErrorMessage: "Category is required.",
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
        header: "Category",
        accessorKey: "category",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "A unique code for the objective.",
        validationErrorMessage: "Code is required.",
        required: true,
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
          description: "A detailed description of the objective.",
          validationErrorMessage: "Description is required.",
          required: true,
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    endDate: z.date().meta({
      formRelated: {
        inputType: "date-time",
        label: "End Date",
        placeholder: "Select end date",
        description: "The date the objective is expected to be completed.",
        validationErrorMessage: "End date is required.",
        section: "General",
        required: true,
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
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the objective.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    organizationNodeId: orgology("General"),
    owner: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Owner",
            placeholder: "Select an owner",
            description: "The owner of the objective.",
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
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Owner",
          accessorKey: "owner.name",
        },
      } as FieldLevelMeta),
    startDate: z.date().meta({
      formRelated: {
        inputType: "date-time",
        label: "Start Date",
        placeholder: "Select start date",
        description: "The date the objective is expected to start.",
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
    status: z
      .string()
      .default("Active")
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "General",
          label: "Status",
          placeholder: "Select a status",
          description: "The status of the objective.",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Active", "Inactive"],
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
    weight: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Weight",
        placeholder: "Enter weight",
        description: "The weight of the objective.",
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
    tableName: "Objectives",
    apiEndPoint: "https://api.techbee.et/api/hr/objectives",
    formName: "objective",
    allowDelete: true,
    createTitle: "Create Objective",
    editTitle: "Edit Objective",
    sections: ["General"],
  } as SchemaMeta);
