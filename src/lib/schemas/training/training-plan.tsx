import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import { orgology } from "../nested-reusable-objects";
import { employeeSchema } from "../emp-for-contract";
import { roleSchema } from "../auth/roles";

export const TrainingPlanCreateSchema = z
  .object({
    id,
    approvalStatus: z
      .string()
      .default("PendingApproval")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Approval Status",
          placeholder: "Select approval status",
          validationErrorMessage: "Approval status is not valid.",
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              "Pending",
              "InProgress",
              "Completed",
              "Rejected",
              "Cancelled",
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
        tableRelated: {
          header: "Approval Status",
          accessorKey: "approvalStatus",
        },
      } as FieldLevelMeta),
    audienceDepartments: z.array(z.string()).meta({
      formRelated: {
        section: "Audience",
        inputType: "auto-complete",
        label: "Audience Departments",
        placeholder: "Select departments",
        description: "The departments targeted by this training.",
        validationErrorMessage: "At least one department is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
        },
      },
      tableRelated: {
        header: "Departments",
        accessorKey: "audienceDepartments",
      },
    } as FieldLevelMeta),
    audienceEmployeeIds: z.array(z.string()).meta({
      formRelated: {
        section: "Audience",
        inputType: "auto-complete",
        label: "Audience Employees",
        placeholder: "Select employees",
        description: "The employees targeted by this training.",
        validationErrorMessage: "At least one employee is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          getEndpoint: "https://api.techbee.et/api/hr/employees",
          getOptionsLabel: (value) => value.firstName + " " + value.fatherName,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: employeeSchema,
        },
      },
      tableRelated: {
        header: "Employees",
        accessorKey: "audienceEmployeeIds",
      },
    } as FieldLevelMeta),
    audienceRoles: z.array(z.string()).meta({
      formRelated: {
        section: "Audience",
        inputType: "auto-complete",
        label: "Audience Roles",
        placeholder: "Select roles",
        description: "The roles targeted by this training.",
        validationErrorMessage: "At least one role is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          getEndpoint: "https://auth.api.techbee.et/api/roles",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: roleSchema,
        },
      },
      tableRelated: {
        header: "Roles",
        accessorKey: "audienceRoles",
      },
    } as FieldLevelMeta),
    // departmentId: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       section: "General",
    //       inputType: "text-field",
    //       label: "Department ID",
    //       placeholder: "Enter department ID",
    //       description: "The department organizing the training.",
    //       validationErrorMessage: "Department ID must be a string.",
    //     },
    //     tableRelated: {
    //       header: "Department ID",
    //       accessorKey: "departmentId",
    //     },
    //   } as FieldLevelMeta),
    endDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Schedule",
          inputType: "date-time",
          label: "End Date",
          placeholder: "Select end date",
          description: "The end date of the training plan.",
          validationErrorMessage: "End date is required.",
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
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    estimatedBudget: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Estimated Budget",
          placeholder: "Enter estimated budget",
          description: "The estimated budget for the training.",
          validationErrorMessage: "Estimated budget must be a number.",
        },
        tableRelated: {
          header: "Est. Budget",
          accessorKey: "estimatedBudget",
        },
      } as FieldLevelMeta),
    estimatedParticipants: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Estimated Participants",
          placeholder: "Enter estimated number of participants",
          description: "The estimated number of participants.",
          validationErrorMessage: "Estimated participants must be a number.",
        },
        tableRelated: {
          header: "Est. Participants",
          accessorKey: "estimatedParticipants",
        },
      } as FieldLevelMeta),
    glCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "GL Code",
          placeholder: "Enter GL code",
          description: "The general ledger code for the training.",
          validationErrorMessage: "GL Code must be a string.",
        },
        tableRelated: {
          header: "GL Code",
          accessorKey: "glCode",
        },
      } as FieldLevelMeta),
    location: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Location",
          placeholder: "Enter location",
          description: "The physical location of the training.",
          validationErrorMessage: "Location must be a string.",
        },
        tableRelated: {
          header: "Location",
          accessorKey: "location",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter training plan name",
        description: "The name of the training plan.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    objective: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Objective",
          placeholder: "Enter training objective",
          description: "The objective of the training plan.",
          validationErrorMessage: "Objective must be a string.",
        },
        tableRelated: {
          header: "Objective",
          accessorKey: "objective",
        },
      } as FieldLevelMeta),
    organizationNodeId: orgology("General"),
    startDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Schedule",
          inputType: "date-time",
          label: "Start Date",
          placeholder: "Select start date",
          description: "The start date of the training plan.",
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
    trainingType: z
      .string()
      .min(1, "Training type is required.")
      .meta({
        formRelated: {
          section: "Details",
          inputType: "auto-complete",
          label: "Training Type",
          placeholder: "Select training type",
          validationErrorMessage: "Training type is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Internal", "External", "Online", "Workshop"],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
        tableRelated: {
          header: "Training Type",
          accessorKey: "trainingType",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Plans",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingPlans",
    formName: "trainingPlan",
    allowDelete: true,
    createTitle: "Create Training Plan",
    sections: ["General", "Audience", "Schedule", "Details"],
    editTitle: "Edit Training Plan",
  } as SchemaMeta);
