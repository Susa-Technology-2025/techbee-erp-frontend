import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  preprocessedTime,
  preprocessedDate,
  timeCell,
  dateCell,
} from "@/lib/schemas/time-parser";

const timeZoneOptions = Intl.supportedValuesOf("timeZone"); // modern browsers

export const leaveTypeSchema = z
  .object({
    id,
    accrualMethod: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Accrual Method",
        placeholder: "Select accrual method",
        validationErrorMessage: "Accrual method is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["None", "Daily", "Monthly", "Quarterly", "Yearly"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Accrual Method",
        accessorKey: "accrualMethod",
      },
    } as FieldLevelMeta),
    allowNegativeBalance: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Allow Negative Balance",
          description: "Allow employees to have a negative leave balance.",
        },
        tableRelated: {
          header: "Allow Negative Balance",
          accessorKey: "allowNegativeBalance",
        },
      } as FieldLevelMeta),
    carryForwardAllowed: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Carry Forward Allowed",
          description: "Allow unused leave days to be carried forward.",
        },
        tableRelated: {
          header: "Carry Forward Allowed",
          accessorKey: "carryForwardAllowed",
        },
      } as FieldLevelMeta),
    carryForwardDeadline: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Carry Forward Deadline",
          placeholder: "Select deadline",
          section: "General",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
          conditional: {
            dependsOn: "carryForwardAllowed",
            showIf: true,
          },
        },

        tableRelated: {
          header: "Carry Forward Deadline",
          accessorKey: "carryForwardDeadline",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    countMode: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Count Mode",
        placeholder: "Select count mode",
        validationErrorMessage: "Count mode is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["WorkingDays", "CalendarDays"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Count Mode",
        accessorKey: "countMode",
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
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    eligibilityGender: z.string().meta({
      formRelated: {
        section: "Eligibility",
        inputType: "auto-complete",
        label: "Eligibility Gender",
        placeholder: "Select gender eligibility",
        validationErrorMessage: "Eligibility gender is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Any", "Male", "Female"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Eligibility Gender",
        accessorKey: "eligibilityGender",
      },
    } as FieldLevelMeta),
    eligibilityMinServiceMonths: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Eligibility",
          inputType: "number-field",
          label: "Min Service Months",
          placeholder: "Enter minimum service months",
          description: "Minimum months of service to be eligible.",
        },
        tableRelated: {
          header: "Min Service Months",
          accessorKey: "eligibilityMinServiceMonths",
        },
      } as FieldLevelMeta),
    encashmentAllowed: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Encashment",
          inputType: "boolean-field",
          label: "Encashment Allowed",
          description: "Allow encashment of leave days.",
        },
        tableRelated: {
          header: "Encashment Allowed",
          accessorKey: "encashmentAllowed",
        },
      } as FieldLevelMeta),
    encashmentFormula: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Encashment",
          inputType: "text-field",
          label: "Encashment Formula",
          placeholder: "Enter encashment formula",
          conditional: {
            dependsOn: "encashmentAllowed",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Encashment Formula",
          accessorKey: "encashmentFormula",
        },
      } as FieldLevelMeta),
    encashmentMaxDays: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Encashment",
          inputType: "number-field",
          label: "Max Encashment Days",
          placeholder: "Enter maximum encashment days",
          conditional: {
            dependsOn: "encashmentAllowed",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Max Encashment Days",
          accessorKey: "encashmentMaxDays",
        },
      } as FieldLevelMeta),
    encashmentMinBalanceDays: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Encashment",
          inputType: "number-field",
          label: "Min Balance Days for Encashment",
          placeholder: "Enter minimum balance days",
          conditional: {
            dependsOn: "encashmentAllowed",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Min Balance Days",
          accessorKey: "encashmentMinBalanceDays",
        },
      } as FieldLevelMeta),
    encashmentPeriod: z.string().meta({
      formRelated: {
        section: "Encashment",
        inputType: "auto-complete",
        label: "Encashment Period",
        placeholder: "Select encashment period",
        validationErrorMessage: "Encashment period is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["AnyTime", "YearEnd", "OnExit"],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
        conditional: {
          dependsOn: "encashmentAllowed",
          showIf: true,
        },
      },
      tableRelated: {
        header: "Encashment Period",
        accessorKey: "encashmentPeriod",
      },
    } as FieldLevelMeta),
    entitlementDays: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Entitlement Days",
          placeholder: "Enter entitlement days",
        },
        tableRelated: {
          header: "Entitlement Days",
          accessorKey: "entitlementDays",
        },
      } as FieldLevelMeta),
    expiryMonths: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Expiry Months",
          placeholder: "Enter expiry months",
        },
        tableRelated: {
          header: "Expiry Months",
          accessorKey: "expiryMonths",
        },
      } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Active",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    isPaid: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Paid",
        },
        tableRelated: {
          header: "Is Paid",
          accessorKey: "isPaid",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    negativeBalanceLimitDays: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Negative Balance Limit Days",
          placeholder: "Enter negative balance limit",
          conditional: {
            dependsOn: "allowNegativeBalance",
            showIf: true,
          },
        },
        tableRelated: {
          header: "Negative Balance Limit",
          accessorKey: "negativeBalanceLimitDays",
        },
      } as FieldLevelMeta),
    proofRequired: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Proof Required",
          description: "Proof is required for this leave type.",
        },
        tableRelated: {
          header: "Proof Required",
          accessorKey: "proofRequired",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Leave Types",
    apiEndPoint: "https://api.techbee.et/api/hr/leaveTypes",
    formName: "leaveType",
    allowDelete: true,
    createTitle: "Create Leave Type",
    editTitle: "Edit Leave Type",
    sections: ["General", "Eligibility", "Encashment"],
  } as SchemaMeta);

export const workScheduleSchema = z
  .object({
    id,
    avgHoursPerDay: z
      .number()
      .max(24)
      .min(1)
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Average Hours Per Day",
          placeholder: "Enter average hours",
          validationErrorMessage: "(1 - 24) Average hours per day is required.",
          required: true,
        },
        tableRelated: {
          header: "Avg. Hours",
          accessorKey: "avgHoursPerDay",
        },
      } as FieldLevelMeta),
    isDefault: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Default",
        },
        tableRelated: {
          header: "Is Default",
          accessorKey: "isDefault",
        },
      } as FieldLevelMeta),
    isCompanyFullTime: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Company Full Time",
        },
        tableRelated: {
          header: "Is Company Full Time",
          accessorKey: "isCompanyFullTime",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    timeZone: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Time Zone",
        placeholder: "Enter time zone",
        validationErrorMessage: "Time zone is required.",
        required: true,
        autoComplete: {
          options: timeZoneOptions,
          getOptionsValue: (opt) => opt,
          getOptionsLabel: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Time Zone",
        accessorKey: "timeZone",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Work Schedules",
    apiEndPoint: "https://api.techbee.et/api/hr/workSchedules",
    formName: "workSchedule",
    allowDelete: true,
    createTitle: "Create Work Schedule",
    editTitle: "Edit Work Schedule",
    sections: ["General"],
  } as SchemaMeta);

export const workScheduleSlotSchema = z
  .object({
    id,
    durationMins: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Duration (Mins)",
        placeholder: "Enter duration in minutes",
        validationErrorMessage: "Duration is required.",
        required: true,
      },
      tableRelated: {
        header: "Duration (Mins)",
        accessorKey: "durationMins",
      },
    } as FieldLevelMeta),
    endTime: preprocessedTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "End Time",
        placeholder: "Select end time",
        validationErrorMessage: "End time is required.",
        required: true,
        section: "General",
        date: {
          type: "time-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "End Time",
        accessorKey: "endTime",
        Cell: ({ cell }) => timeCell({ cell }),
      },
    } as FieldLevelMeta),
    label: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Label",
          placeholder: "Enter label",
        },
        tableRelated: {
          header: "Label",
          accessorKey: "label",
        },
      } as FieldLevelMeta),
    schedule: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Work Schedule",
            placeholder: "Select work schedule",
            validationErrorMessage: "Work schedule is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/workSchedules",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: workScheduleSchema,
              allowCreateNew: true,
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
          header: "Work Schedule",
          accessorKey: "schedule.name",
        },
      } as FieldLevelMeta),
    startTime: preprocessedTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Start Time",
        placeholder: "Select start time",
        validationErrorMessage: "Start time is required.",
        required: true,
        section: "General",
        date: {
          type: "time-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Start Time",
        accessorKey: "startTime",
        Cell: ({ cell }) => timeCell({ cell }),
      },
    } as FieldLevelMeta),
    weekday: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Weekday",
        placeholder: "Select weekday",
        validationErrorMessage: "Weekday is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
        },
      },
      tableRelated: {
        header: "Weekday",
        accessorKey: "weekday",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Work Schedule Slots",
    apiEndPoint: "https://api.techbee.et/api/hr/workScheduleSlots",
    formName: "workScheduleSlot",
    allowDelete: true,
    createTitle: "Create Work Schedule Slot",
    editTitle: "Edit Work Schedule Slot",
    sections: ["General"],
  } as SchemaMeta);

export const holidaySchema = z
  .object({
    id,
    date: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Date",
        placeholder: "Select date",
        validationErrorMessage: "Date is required.",
        required: true,
        section: "General",
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Date",
        accessorKey: "date",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    isRecurring: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Recurring",
        },
        tableRelated: {
          header: "Is Recurring",
          accessorKey: "isRecurring",
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Holidays",
    apiEndPoint: "https://api.techbee.et/api/hr/holidays",
    formName: "holiday",
    allowDelete: true,
    createTitle: "Create Holiday",
    editTitle: "Edit Holiday",
    sections: ["General"],
  } as SchemaMeta);
