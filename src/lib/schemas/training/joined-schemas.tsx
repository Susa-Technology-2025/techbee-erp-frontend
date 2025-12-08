import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";

export const trainingPlanCreateInputSchema = z
  .object({
    id,
    name: z
      .string()
      .min(1, "Training plan name is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-field",
          label: "Training Plan Name",
          placeholder: "Enter training plan name",
          validationErrorMessage: "Training plan name is required.",
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
          section: "General Information",
          inputType: "text-area",
          label: "Objective",
          placeholder: "Enter training objective",
          validationErrorMessage: "Objective is not valid.",
        },
        tableRelated: {
          header: "Objective",
          accessorKey: "objective",
        },
      } as FieldLevelMeta),
    trainingType: z
      .string()
      .min(1, "Training type is required.")
      .meta({
        formRelated: {
          section: "General Information",
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
          description: "The estimated budget for the training plan.",
          validationErrorMessage: "Budget must be a number.",
        },
        tableRelated: {
          header: "Budget",
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
          validationErrorMessage: "Participants must be a number.",
        },
        tableRelated: {
          header: "Participants",
          accessorKey: "estimatedParticipants",
        },
      } as FieldLevelMeta),
    startDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "date-time",
          label: "Start Date",
          placeholder: "Select start date",
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
    endDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "date-time",
          label: "End Date",
          placeholder: "Select end date",
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
          validationErrorMessage: "Location is not valid.",
        },
        tableRelated: {
          header: "Location",
          accessorKey: "location",
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
          description: "General Ledger code for budgeting.",
          validationErrorMessage: "GL Code is not valid.",
        },
        tableRelated: {
          header: "GL Code",
          accessorKey: "glCode",
        },
      } as FieldLevelMeta),
    approvalStatus: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Approval",
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
    approvalInstanceId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Approval",
          inputType: "text-field",
          label: "Approval Instance ID",
          placeholder: "Enter Approval Instance ID",
          description: "The ID of the approval instance.",
          validationErrorMessage: "Approval Instance ID is not valid.",
        },
        tableRelated: {
          header: "Approval Instance ID",
          accessorKey: "approvalInstanceId",
        },
      } as FieldLevelMeta),
    audienceDepartments: z.array(z.string()).meta({
      formRelated: {
        section: "Audience",
        inputType: "auto-complete",
        label: "Audience Departments",
        placeholder: "Select departments",
        validationErrorMessage: "Departments are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
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
        validationErrorMessage: "Employees are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://api.techbee.et/api/hr/employees",
          getOptionsLabel: (value) => value.firstName + " " + value.fatherName,
          getOptionsValue: (value) => value.id,
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
        validationErrorMessage: "Roles are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://auth.api.techbee.et/api/roles",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
        },
      },
      tableRelated: {
        header: "Roles",
        accessorKey: "audienceRoles",
      },
    } as FieldLevelMeta),
    departmentId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Audience",
          inputType: "auto-complete",
          label: "Department",
          placeholder: "Select department",
          validationErrorMessage: "Department is not valid.",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Department",
          accessorKey: "department.name",
        },
      } as FieldLevelMeta),
    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Audience",
          inputType: "auto-complete",
          label: "Organization Node",
          placeholder: "Select organization node",
          validationErrorMessage: "Organization node is not valid.",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Organization Node",
          accessorKey: "organizationNode.name",
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
    editTitle: "Edit Training Plan",
    sections: [
      "General Information",
      "Timeframe",
      "Details",
      "Audience",
      "Approval",
    ],
  } as SchemaMeta);

//------------------------------------------------------------------------------------------------------------------------

export const trainerCreateInputSchema = z
  .object({
    id,
    name: z
      .string()
      .min(1, "Name is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-field",
          label: "Name",
          placeholder: "Enter trainer's name",
          validationErrorMessage: "Trainer's name is required.",
          required: true,
        },
        tableRelated: {
          header: "Name",
          accessorKey: "name",
        },
      } as FieldLevelMeta),
    type: z
      .string()
      .min(1, "Type is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "auto-complete",
          label: "Type",
          placeholder: "Select type",
          validationErrorMessage: "Type is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Internal", "External"],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
        tableRelated: {
          header: "Type",
          accessorKey: "type",
        },
      } as FieldLevelMeta),
    email: z
      .string()
      .email("Invalid email address.")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Contact Information",
          inputType: "text-field",
          label: "Email",
          placeholder: "Enter email",
          validationErrorMessage: "Invalid email address.",
        },
        tableRelated: {
          header: "Email",
          accessorKey: "email",
        },
      } as FieldLevelMeta),
    phone: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Contact Information",
          inputType: "text-field",
          label: "Phone",
          placeholder: "Enter phone number",
          validationErrorMessage: "Invalid phone number.",
        },
        tableRelated: {
          header: "Phone",
          accessorKey: "phone",
        },
      } as FieldLevelMeta),
    organization: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Organization",
          placeholder: "Enter organization name",
          validationErrorMessage: "Organization is not valid.",
        },
        tableRelated: {
          header: "Organization",
          accessorKey: "organization",
        },
      } as FieldLevelMeta),
    bio: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Bio",
          placeholder: "Enter a short biography",
          validationErrorMessage: "Biography is not valid.",
        },
        tableRelated: {
          header: "Bio",
          accessorKey: "bio",
        },
      } as FieldLevelMeta),
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Details",
            label: "Employee",
            placeholder: "Select employee",
            validationErrorMessage: "Employee is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: false,
              getEndpoint: "https://api.techbee.et/api/hr/employees",
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
          header: "Employee",
          accessorKey: "employee.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Trainers",
    apiEndPoint: "https://api.techbee.et/api/hr/trainers",
    formName: "trainer",
    allowDelete: true,
    createTitle: "Create Trainer",
    editTitle: "Edit Trainer",
    sections: ["General Information", "Contact Information", "Details"],
  } as SchemaMeta);

//------------------------------------------------------------------------------------------------------------------------

export const trainingSessionCreateInputSchema = z
  .object({
    id,
    name: z
      .string()
      .min(1, "Name is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-field",
          label: "Session Name",
          placeholder: "Enter session name",
          validationErrorMessage: "Session name is required.",
          required: true,
        },
        tableRelated: {
          header: "Name",
          accessorKey: "name",
        },
      } as FieldLevelMeta),
    trainingType: z
      .string()
      .min(1, "Training type is required.")
      .meta({
        formRelated: {
          section: "General Information",
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
    status: z
      .string()
      .min(1, "Status is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "auto-complete",
          label: "Status",
          placeholder: "Select status",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Scheduled", "Rescheduled", "Canceled", "Completed"],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),
    startDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "date-time",
          label: "Start Date",
          placeholder: "Select start date",
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
    endDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "date-time",
          label: "End Date",
          placeholder: "Select end date",
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
    durationHours: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "number-field",
          label: "Duration (Hours)",
          placeholder: "Enter duration in hours",
          description: "The duration of the training session in hours.",
          validationErrorMessage: "Duration must be a number.",
        },
        tableRelated: {
          header: "Duration",
          accessorKey: "durationHours",
        },
      } as FieldLevelMeta),
    venue: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Venue",
          placeholder: "Enter venue",
          validationErrorMessage: "Venue is not valid.",
        },
        tableRelated: {
          header: "Venue",
          accessorKey: "venue",
        },
      } as FieldLevelMeta),
    link: z

      .url("Invalid URL")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Link",
          placeholder: "Enter link",
          validationErrorMessage: "Invalid URL.",
        },
        tableRelated: {
          header: "Link",
          accessorKey: "link",
        },
      } as FieldLevelMeta),
    audienceDepartments: z.array(z.string()).meta({
      formRelated: {
        section: "Audience",
        inputType: "auto-complete",
        label: "Audience Departments",
        placeholder: "Select departments",
        validationErrorMessage: "Departments are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
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
        validationErrorMessage: "Employees are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://api.techbee.et/api/hr/employees",
          getOptionsLabel: (value) => value.firstName + " " + value.fatherName,
          getOptionsValue: (value) => value.id,
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
        validationErrorMessage: "Roles are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://auth.api.techbee.et/api/roles",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
        },
      },
      tableRelated: {
        header: "Roles",
        accessorKey: "audienceRoles",
      },
    } as FieldLevelMeta),
    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Audience",
          inputType: "auto-complete",
          label: "Organization Node",
          placeholder: "Select organization node",
          validationErrorMessage: "Organization node is not valid.",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Organization Node",
          accessorKey: "organizationNode.name",
        },
      } as FieldLevelMeta),
    program: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Program",
            placeholder: "Select training program",
            validationErrorMessage: "Training program is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: false,
              getEndpoint: "https://api.techbee.et/api/hr/trainingPrograms",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Program",
          accessorKey: "program.name",
        },
      } as FieldLevelMeta),
    trainer: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Trainer",
            placeholder: "Select trainer",
            validationErrorMessage: "Trainer is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: false,
              getEndpoint: "https://api.techbee.et/api/hr/trainers",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Trainer",
          accessorKey: "trainer.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Sessions",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingSessions",
    formName: "trainingSession",
    allowDelete: true,
    createTitle: "Create Training Session",
    editTitle: "Edit Training Session",
    sections: [
      "General Information",
      "Timeframe",
      "Details",
      "Audience",
      "Relations",
    ],
  } as SchemaMeta);

//------------------------------------------------------------------------------------------------------------------------

export const trainingProgramCreateInputSchema = z
  .object({
    id,
    name: z
      .string()
      .min(1, "Name is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-field",
          label: "Program Name",
          placeholder: "Enter program name",
          validationErrorMessage: "Program name is required.",
          required: true,
        },
        tableRelated: {
          header: "Name",
          accessorKey: "name",
        },
      } as FieldLevelMeta),
    trainingType: z
      .string()
      .min(1, "Training type is required.")
      .meta({
        formRelated: {
          section: "General Information",
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
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter program description",
          validationErrorMessage: "Description is not valid.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    startDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "date-time",
          label: "Start Date",
          placeholder: "Select start date",
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
    endDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Timeframe",
          inputType: "date-time",
          label: "End Date",
          placeholder: "Select end date",
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
    audienceDepartments: z.array(z.string()).meta({
      formRelated: {
        section: "Audience",
        inputType: "auto-complete",
        label: "Audience Departments",
        placeholder: "Select departments",
        validationErrorMessage: "Departments are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
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
        validationErrorMessage: "Employees are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://api.techbee.et/api/hr/employees",
          getOptionsLabel: (value) => value.firstName + " " + value.fatherName,
          getOptionsValue: (value) => value.id,
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
        validationErrorMessage: "Roles are required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          allowCreateNew: true,
          getEndpoint: "https://auth.api.techbee.et/api/roles",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
        },
      },
      tableRelated: {
        header: "Roles",
        accessorKey: "audienceRoles",
      },
    } as FieldLevelMeta),
    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Audience",
          inputType: "auto-complete",
          label: "Organization Node",
          placeholder: "Select organization node",
          validationErrorMessage: "Organization node is not valid.",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Organization Node",
          accessorKey: "organizationNodeId",
        },
      } as FieldLevelMeta),
    plan: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Plan",
            placeholder: "Select training plan",
            validationErrorMessage: "Training plan is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: false,
              getEndpoint: "https://api.techbee.et/api/hr/trainingPlans",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Plan",
          accessorKey: "plan.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Programs",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingPrograms",
    formName: "trainingProgram",
    allowDelete: true,
    createTitle: "Create Training Program",
    editTitle: "Edit Training Program",
    sections: ["General Information", "Timeframe", "Audience", "Relations"],
  } as SchemaMeta);

export const trainingEnrollmentCreateInputSchema = z
  .object({
    id,
    attended: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          label: "Attended",
          description: "Indicates if the employee attended the session.",
          validationErrorMessage: "Attended field is not valid.",
        },
        tableRelated: {
          header: "Attended",
          accessorKey: "attended",
        },
      } as FieldLevelMeta),
    completed: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "boolean-field",
          label: "Completed",
          description: "Indicates if the employee completed the training.",
          validationErrorMessage: "Completed field is not valid.",
        },
        tableRelated: {
          header: "Completed",
          accessorKey: "completed",
        },
      } as FieldLevelMeta),
    hoursAttended: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Hours Attended",
          placeholder: "Enter hours attended",
          description: "The number of hours the employee attended.",
          validationErrorMessage: "Hours attended must be a number.",
        },
        tableRelated: {
          header: "Hours Attended",
          accessorKey: "hoursAttended",
        },
      } as FieldLevelMeta),
    certificateUrl: z
      .string()
      .url("Invalid URL")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Certificate URL",
          placeholder: "Enter certificate URL",
          validationErrorMessage: "Invalid URL.",
        },
        tableRelated: {
          header: "Certificate URL",
          accessorKey: "certificateUrl",
        },
      } as FieldLevelMeta),
    employee: z
      .object({
        id: z
          .string()
          .min(1, "Employee is required.")
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Employee",
              placeholder: "Select employee",
              validationErrorMessage: "Employee is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                allowCreateNew: false,
                getEndpoint: "https://api.techbee.et/api/hr/employees",
                getOptionsLabel: (value) =>
                  value.firstName + " " + value.fatherName,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.name",
        },
      } as FieldLevelMeta),
    session: z
      .object({
        id: z
          .string()
          .min(1, "Session is required.")
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Training Session",
              placeholder: "Select training session",
              validationErrorMessage: "Training session is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                allowCreateNew: false,
                getEndpoint: "https://api.techbee.et/api/hr/trainingSessions",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Session",
          accessorKey: "session.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Enrollments",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingEnrollments",
    formName: "trainingEnrollment",
    allowDelete: true,
    createTitle: "Create Training Enrollment",
    editTitle: "Edit Training Enrollment",
    sections: ["General Information", "Details", "Relations"],
  } as SchemaMeta);

//------------------------------------------------------------------------------------------------------------------------

export const trainingRecordCreateInputSchema = z
  .object({
    id,
    courseName: z
      .string()
      .min(1, "Course name is required.")
      .meta({
        formRelated: {
          section: "General Information",
          inputType: "text-field",
          label: "Course Name",
          placeholder: "Enter course name",
          validationErrorMessage: "Course name is required.",
          required: true,
        },
        tableRelated: {
          header: "Course Name",
          accessorKey: "courseName",
        },
      } as FieldLevelMeta),
    completionDate: preprocessedDate.meta({
      formRelated: {
        section: "General Information",
        inputType: "date-time",
        label: "Completion Date",
        placeholder: "Select completion date",
        validationErrorMessage: "Completion date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Completion Date",
        accessorKey: "completionDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    certificate: z
      .string()
      .url("Invalid URL")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Certificate URL",
          placeholder: "Enter certificate URL",
          validationErrorMessage: "Invalid URL.",
        },
        tableRelated: {
          header: "Certificate URL",
          accessorKey: "certificate",
        },
      } as FieldLevelMeta),
    employee: z
      .object({
        id: z
          .string()
          .min(1, "Employee is required.")
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Employee",
              placeholder: "Select employee",
              validationErrorMessage: "Employee is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                allowCreateNew: false,
                getEndpoint: "https://api.techbee.et/api/hr/employees",
                getOptionsLabel: (value) =>
                  value.firstName + " " + value.fatherName,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.name",
        },
      } as FieldLevelMeta),
    trainingProgram: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Program",
            placeholder: "Select training program",
            validationErrorMessage: "Training program is not valid.",
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: false,
              getEndpoint: "https://api.techbee.et/api/hr/trainingPrograms",
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
          header: "Training Program",
          accessorKey: "trainingProgram.name",
        },
      } as FieldLevelMeta),
    trainingSession: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Session",
            placeholder: "Select training session",
            validationErrorMessage: "Training session is not valid.",
            autoComplete: {
              multiple: false,
              async: true,
              allowCreateNew: false,
              getEndpoint: "https://api.techbee.et/api/hr/trainingSessions",
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
          header: "Training Session",
          accessorKey: "trainingSession.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Records",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRecords",
    formName: "trainingRecord",
    allowDelete: true,
    createTitle: "Create Training Record",
    editTitle: "Edit Training Record",
    sections: ["General Information", "Details", "Relations"],
  } as SchemaMeta);
