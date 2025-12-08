import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  dateCell,
  preprocessedDate,
  preprocessedDateTime,
} from "@/lib/schemas/time-parser";
import { employeeSchema } from "../emp-for-contract";

// LeaveRequestCreateInput Schema
export const leaveRequestSchema = z
  .object({
    id,
    // calculatedWorkingDays: z.number().meta({
    //   formRelated: {
    //     section: "General",
    //     inputType: "number-field",
    //     label: "Calculated Working Days",
    //     placeholder: "Enter calculated working days",
    //     description: "The number of working days calculated for the leave.",
    //     validationErrorMessage: "Calculated working days is required.",
    //   },
    //   tableRelated: {
    //     header: "Calculated Working Days",
    //     accessorKey: "calculatedWorkingDays",
    //   },
    // } as FieldLevelMeta),
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Employee",
            placeholder: "Select employee",
            description: "The employee requesting the leave.",
            validationErrorMessage: "Employee is required.",
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
          tableRelated: {
            header: "Employee",
            accessorKey: "employee.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.id",
          Cell: ({ row }) =>
            row.original.employee?.firstName +
            " " +
            row.original.employee?.fatherName,
        },
      } as FieldLevelMeta),
    startDate: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        section: "General",
        label: "Start Date",
        placeholder: "Select start date",
        description: "The start date of the leave.",
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
    endDate: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        section: "General",
        label: "End Date",
        placeholder: "Select end date",
        description: "The end date of the leave.",
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
    // episodeId: z.string().meta({
    //   formRelated: {
    //     inputType: "auto-complete",
    //     section: "General",
    //     label: "Episode ID",
    //     placeholder: "Select episode ID",
    //     description: "The unique identifier for the sick leave episode.",
    //     validationErrorMessage: "Episode ID is required.",
    //     required: true,
    //     autoComplete: {
    //       multiple: false,
    //       async: true,
    //       getEndpoint: "https://api.techbee.et/api/hr/sickLeaveEpisodes",
    //       getOptionsLabel: (value) => value.id,
    //       getOptionsValue: (value) => value.id,
    //       allowCreateNew: false,
    //       //   createSchema: sickLeaveEpisodeSchema,
    //     },
    //   },
    //   tableRelated: {
    //     header: "Episode ID",
    //     accessorKey: "episodeId",
    //   },
    // } as FieldLevelMeta),
    leaveType: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Leave Type",
            placeholder: "Select leave type",
            description: "The type of leave being requested.",
            validationErrorMessage: "Leave type is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/leaveTypes",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Leave Type",
            accessorKey: "leaveType.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Leave Type",
          accessorKey: "leaveType.name",
        },
      } as FieldLevelMeta),
    requiresProof: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Requires Proof",
          description: "Indicates if proof is required for the leave.",
        },
        tableRelated: {
          header: "Requires Proof",
          accessorKey: "requiresProof",
        },
      } as FieldLevelMeta),
    // specialEventKey: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       section: "General",
    //       inputType: "text-field",
    //       label: "Special Event Key",
    //       placeholder: "Enter special event key",
    //       description: "The key for a special event related to the leave.",
    //       validationErrorMessage: "Special event key is required.",
    //     },
    //     tableRelated: {
    //       header: "Special Event Key",
    //       accessorKey: "specialEventKey",
    //     },
    //   } as FieldLevelMeta),

    status: z
      .string()
      .default("Pending")
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "table-only",
          disabled: true,
          hidden: true,
          section: "General",
          label: "Status",
          placeholder: "Select status",
          description: "The current status of the leave request.",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              { id: "Pending", name: "Pending" },
              { id: "ManagerApproved", name: "Manager Approved" },
              { id: "HrApproved", name: "Hr Approved" },
              { id: "FinalApproved", name: "Final Approved" },
              { id: "Rejected", name: "Rejected" },
              { id: "Cancelled", name: "Cancelled" },
            ],
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
            allowCreateNew: false,
          },
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Leave Request",
    apiEndPoint: "https://api.techbee.et/api/hr/leaveRequests",
    formName: "leaveRequest",
    allowDelete: true,
    createTitle: "Create Leave Request",
    sections: ["General"],
    editTitle: "Edit Leave Request",
  } as SchemaMeta);

// LeaveBalanceCreateInput Schema
export const leaveBalanceSchema = z
  .object({
    id,
    active: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Active",
          description: "Indicates if the leave balance is active.",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "active",
        },
      } as FieldLevelMeta),
    carryForwardDays: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Carry Forward Days",
        placeholder: "Enter carry forward days",
        description:
          "The number of days carried forward from the previous period.",
        validationErrorMessage: "Carry forward days is required.",
        required: true,
      },
      tableRelated: {
        header: "Carry Forward Days",
        accessorKey: "carryForwardDays",
      },
    } as FieldLevelMeta),
    currentBalance: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Current Balance",
        placeholder: "Enter current balance",
        description: "The current leave balance.",
        validationErrorMessage: "Current balance is required.",
        required: true,
      },
      tableRelated: {
        header: "Current Balance",
        accessorKey: "currentBalance",
      },
    } as FieldLevelMeta),
    daysTaken: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Days Taken",
        placeholder: "Enter days taken",
        description: "The number of leave days taken.",
        validationErrorMessage: "Days taken is required.",
        required: true,
      },
      tableRelated: {
        header: "Days Taken",
        accessorKey: "daysTaken",
      },
    } as FieldLevelMeta),
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Employee",
            placeholder: "Select employee",
            description: "The employee requesting the leave.",
            validationErrorMessage: "Employee is required.",
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
          tableRelated: {
            header: "Employee",
            accessorKey: "employee.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.id",
          Cell: ({ row }) =>
            row.original.employee?.firstName +
            row.original.employee?.fatherName,
        },
      } as FieldLevelMeta),
    leaveType: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Leave Type",
            placeholder: "Select leave type",
            description: "The type of leave for this balance.",
            validationErrorMessage: "Leave type is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/leaveTypes",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Leave Type",
            accessorKey: "leaveType.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Leave Type",
          accessorKey: "leaveType.name",
        },
      } as FieldLevelMeta),
    notes: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Notes",
          placeholder: "Enter notes",
          description: "Additional notes about the leave balance.",
        },
        tableRelated: {
          header: "Notes",
          accessorKey: "notes",
        },
      } as FieldLevelMeta),
    openingBalance: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Opening Balance",
        placeholder: "Enter opening balance",
        description: "The opening balance for the leave period.",
        validationErrorMessage: "Opening balance is required.",
        required: true,
      },
      tableRelated: {
        header: "Opening Balance",
        accessorKey: "openingBalance",
      },
    } as FieldLevelMeta),
    periodYear: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Period Year",
        placeholder: "Enter period year",
        description: "The year for the leave period.",
        validationErrorMessage: "Period year is required.",
        required: true,
      },
      tableRelated: {
        header: "Period Year",
        accessorKey: "periodYear",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Leave Balance",
    apiEndPoint: "https://api.techbee.et/api/hr/leaveBalances",
    formName: "leaveBalance",
    allowDelete: true,
    createTitle: "Create Leave Balance",
    sections: ["General"],
    editTitle: "Edit Leave Balance",
  } as SchemaMeta);

// LeaveEncashmentCreateInput Schema
export const leaveEncashmentSchema = z
  .object({
    id,
    amount: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Amount",
        placeholder: "Enter amount",
        description: "The monetary amount for the leave encashment.",
        validationErrorMessage: "Amount is required.",
        required: true,
      },
      tableRelated: {
        header: "Amount",
        accessorKey: "amount",
      },
    } as FieldLevelMeta),
    days: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Days",
        placeholder: "Enter days",
        description: "The number of days being encashed.",
        validationErrorMessage: "Days is required.",
        required: true,
      },
      tableRelated: {
        header: "Days",
        accessorKey: "days",
      },
    } as FieldLevelMeta),
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Employee",
            placeholder: "Select employee",
            description: "The employee requesting the leave.",
            validationErrorMessage: "Employee is required.",
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
          tableRelated: {
            header: "Employee",
            accessorKey: "employee.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.id",
          Cell: ({ row }) =>
            row.original.employee?.firstName +
            row.original.employee?.fatherName,
        },
      } as FieldLevelMeta),
    leaveType: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Leave Type",
            placeholder: "Select leave type",
            description: "The type of leave being encashed.",
            validationErrorMessage: "Leave type is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/leaveTypes",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Leave Type",
            accessorKey: "leaveType.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Leave Type",
          accessorKey: "leaveType.name",
        },
      } as FieldLevelMeta),
    periodYear: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Period Year",
        placeholder: "Enter period year",
        description: "The year for the encashment period.",
        validationErrorMessage: "Period year is required.",
        required: true,
      },
      tableRelated: {
        header: "Period Year",
        accessorKey: "periodYear",
      },
    } as FieldLevelMeta),
    status: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Status",
        placeholder: "Select status",
        description: "The current status of the leave encashment.",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { id: "Draft", name: "Draft" },
            { id: "Pending", name: "Pending" },
            { id: "FinalApproved", name: "Final Approved" },
            { id: "Rejected", name: "Rejected" },
            { id: "Cancelled", name: "Cancelled" },
          ],
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Leave Encashment",
    apiEndPoint: "https://api.techbee.et/api/hr/leaveEncashments",
    formName: "leaveEncashment",
    allowDelete: true,
    createTitle: "Create Leave Encashment",
    sections: ["General"],
    editTitle: "Edit Leave Encashment",
  } as SchemaMeta);

// SickLeaveEpisodeCreateInput Schema
export const sickLeaveEpisodeSchema = z
  .object({
    id,
    diagnosis: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Diagnosis",
          placeholder: "Enter diagnosis",
          description: "The diagnosis for the sick leave episode.",
          validationErrorMessage: "Diagnosis is required.",
        },
        tableRelated: {
          header: "Diagnosis",
          accessorKey: "diagnosis",
        },
      } as FieldLevelMeta),
    employeeId: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Employee",
        placeholder: "Select employee",
        description: "The employee associated with the sick leave episode.",
        validationErrorMessage: "Employee is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/hr/employees",
          getOptionsLabel: (value) => value.firstName + " " + value.fatherName,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: employeeSchema,
        },
      },
      tableRelated: {
        header: "Employee ID",
        accessorKey: "employeeId",
      },
    } as FieldLevelMeta),
    totalDays0: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Total Days at 0%",
        placeholder: "Enter total days at 0%",
        description: "Total days with 0% pay.",
        validationErrorMessage: "Total days is required.",
        required: true,
      },
      tableRelated: {
        header: "Total Days at 0%",
        accessorKey: "totalDays0",
      },
    } as FieldLevelMeta),
    totalDays100: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Total Days at 100%",
        placeholder: "Enter total days at 100%",
        description: "Total days with 100% pay.",
        validationErrorMessage: "Total days is required.",
        required: true,
      },
      tableRelated: {
        header: "Total Days at 100%",
        accessorKey: "totalDays100",
      },
    } as FieldLevelMeta),
    totalDays50: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Total Days at 50%",
        placeholder: "Enter total days at 50%",
        description: "Total days with 50% pay.",
        validationErrorMessage: "Total days is required.",
        required: true,
      },
      tableRelated: {
        header: "Total Days at 50%",
        accessorKey: "totalDays50",
      },
    } as FieldLevelMeta),
    year: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Year",
        placeholder: "Enter year",
        description: "The year for the sick leave episode.",
        validationErrorMessage: "Year is required.",
        required: true,
      },
      tableRelated: {
        header: "Year",
        accessorKey: "year",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Sick Leave Episode",
    apiEndPoint: "https://api.techbee.et/api/hr/sickLeaveEpisodes",
    formName: "sickLeaveEpisode",
    allowDelete: true,
    createTitle: "Create Sick Leave Episode",
    sections: ["General"],
    editTitle: "Edit Sick Leave Episode",
  } as SchemaMeta);
