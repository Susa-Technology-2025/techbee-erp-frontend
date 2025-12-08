import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDateTime } from "@/lib/schemas/time-parser";

// Define a placeholder schema for related entities to satisfy the autoComplete requirement
// In a real application, you would import the actual schemas (e.g., EmployeeSchema)
const placeholderSchema = z.object({ id: z.string(), name: z.string() });

export const paySlipSchema = z
  .object({
    // SCALAR FIELD: analyticAccountId

    payrollBatch: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Payroll Batch",
            placeholder: "Select Payroll Batch",
            description: "The payroll batch this payslip belongs to.",
            validationErrorMessage: "Payroll Batch is required.",
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/payrollBatches", // Placeholder endpoint
              getOptionsLabel: (value: any) => value.name,
              getOptionsValue: (value: any) => value.id,
              createSchema: placeholderSchema, // Placeholder schema
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
          header: "Payroll Batch",
          accessorKey: "payrollBatch.name",
          minSize: 400,
        },
      } as FieldLevelMeta),

    // analyticAccountId: z.string().optional().nullable().meta({
    //   formRelated: {
    //     section: "General",
    //     inputType: "text-field",
    //     label: "Analytic Account ID",
    //     placeholder: "Enter Analytic Account ID",
    //     description: "The ID of the analytic account for this payslip.",
    //     validationErrorMessage: "Invalid Analytic Account ID.",
    //   },
    //   tableRelated: {
    //     header: "Analytic Account ID",
    //     accessorKey: "analyticAccountId",
    //   },
    // } as FieldLevelMeta),

    // OBJECT FIELD: bankAccount
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Employee",
            placeholder: "Select Employee",
            description: "The employee this payslip belongs to.",
            validationErrorMessage: "Employee is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/employees", // Placeholder endpoint
              getOptionsLabel: (value: any) =>
                `  ${value.firstName || ""} ${value.fatherName || ""} ${
                  value.grandFatherName || ""
                }`,
              getOptionsValue: (value: any) => value.id,
              allowCreateNew: false,
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
          accessorFn(originalRow) {
            return `${originalRow?.employee?.firstName || ""} ${
              originalRow?.employee?.fatherName || ""
            } ${originalRow?.employee?.grandFatherName || ""}`;
          },
        },
      } as FieldLevelMeta),

    bankAccount: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Bank Account",
            placeholder: "Select Bank Account",
            description: "The employee's bank account.",
            validationErrorMessage: "Bank account is required.",
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/employeeBankAccounts", // Placeholder endpoint
              getOptionsLabel: (value: any) => value.accountNumber,
              getOptionsValue: (value: any) => value.id,
              createSchema: placeholderSchema, // Placeholder schema
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
          header: "Bank Account",
          accessorKey: "bankAccount.accountNumber",
        },
      } as FieldLevelMeta),

    // OBJECT FIELD: contract
    // contract: z
    //   .object({
    //     id: z.string().meta({
    //       formRelated: {
    //         inputType: "auto-complete",
    //         section: "General",
    //         label: "Contract",
    //         placeholder: "Select Contract",
    //         description: "The contract associated with this payslip.",
    //         validationErrorMessage: "Contract is required.",
    //         autoComplete: {
    //           multiple: false,
    //           async: true,
    //           getEndpoint: "https://api.techbee.et/api/hr/contracts", // Placeholder endpoint
    //           getOptionsLabel: (value: any) => value.code,
    //           getOptionsValue: (value: any) => value.id,
    //           createSchema: placeholderSchema, // Placeholder schema
    //           allowCreateNew: true,
    //         },
    //       },
    //     } as FieldLevelMeta),
    //   })
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "object",
    //     },
    //     tableRelated: {
    //       header: "Contract",
    //       accessorKey: "contract.code",
    //     },
    //   } as FieldLevelMeta),

    // SCALAR FIELD: currency
    currency: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Currency",
          placeholder: "Enter Currency Code (e.g., ETB)",
          description: "The currency of the payslip amounts.",
          validationErrorMessage: "Invalid Currency.",
        },
        tableRelated: {
          header: "Currency",
          accessorKey: "currency",
        },
      } as FieldLevelMeta),

    // OBJECT FIELD: employee (Required)

    // SCALAR FIELD: grossPay
    grossPay: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Gross Pay",
          placeholder: "Enter Gross Pay",
          description: "The total gross pay before deductions.",
          validationErrorMessage: "Gross Pay must be a number.",
        },
        tableRelated: {
          header: "Gross Pay",
          accessorKey: "grossPay",
          minSize: 500,
        },
      } as FieldLevelMeta),

    // SCALAR FIELD: journalEntryCode
    // journalEntryCode: z.string().optional().nullable().meta({
    //   formRelated: {
    //     section: "General",
    //     inputType: "text-field",
    //     label: "Journal Entry Code",
    //     placeholder: "Enter Journal Entry Code",
    //     description: "The code for the corresponding journal entry.",
    //     validationErrorMessage: "Invalid Journal Entry Code.",
    //   },
    //   tableRelated: {
    //     header: "Journal Entry Code",
    //     accessorKey: "journalEntryCode",
    //   },
    // } as FieldLevelMeta),

    // SCALAR FIELD: journalEntryId
    // journalEntryId: z.string().optional().nullable().meta({
    //   formRelated: {
    //     section: "General",
    //     inputType: "text-field",
    //     label: "Journal Entry ID",
    //     placeholder: "Enter Journal Entry ID",
    //     description: "The ID of the corresponding journal entry.",
    //     validationErrorMessage: "Invalid Journal Entry ID.",
    //   },
    //   tableRelated: {
    //     header: "Journal Entry ID",
    //     accessorKey: "journalEntryId",
    //   },
    // } as FieldLevelMeta),

    // SCALAR FIELD: netPay
    netPay: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Net Pay",
          placeholder: "Enter Net Pay",
          description: "The total net pay after deductions.",
          validationErrorMessage: "Net Pay must be a number.",
        },
        tableRelated: {
          header: "Net Pay",
          accessorKey: "netPay",
          minSize: 500,
        },
      } as FieldLevelMeta),

    // SCALAR FIELD: organizationNodeId
    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Organization Node ID",
          placeholder: "Enter Organization Node ID",
          description: "The organization node ID associated with the payslip.",
          validationErrorMessage: "Invalid Organization Node ID.",
        },
        // tableRelated: {
        //   header: "Org Node ID",
        //   accessorKey: "organizationNodeId",
        // },
      } as FieldLevelMeta),

    // OBJECT FIELD: period
    period: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Payroll Period",
            placeholder: "Select Payroll Period",
            description: "The period this payslip covers.",
            validationErrorMessage: "Payroll Period is required.",
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/payrollPeriods", // Placeholder endpoint
              getOptionsLabel: (value: any) => value.name,
              getOptionsValue: (value: any) => value.id,
              createSchema: placeholderSchema, // Placeholder schema
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
          header: "Period",
          accessorKey: "period.name",
        },
      } as FieldLevelMeta),

    periodStart: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Period Start",
        placeholder: "Select Period Start Date",
        description: "The start date of the payroll period.",
        validationErrorMessage: "Period Start date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period Start",
        accessorKey: "periodStart",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    // DATE FIELD: periodEnd (Required)
    periodEnd: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Period End",
        placeholder: "Select Period End Date",
        description: "The end date of the payroll period.",
        validationErrorMessage: "Period End date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period End",
        accessorKey: "periodEnd",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),

    // DATE FIELD: periodStart (Required)

    // ENUM FIELD: status (Required)
    status: z
      .enum(["Draft", "Generated", "Verified", "Done", "Paid", "Posted"])
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Status",
          placeholder: "Select Payslip Status",
          description: "The current status of the payslip.",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              "Draft",
              "Generated",
              "Verified",
              "Done",
              "Paid",
              "Posted",
            ],
            allowCreateNew: false,
            getOptionsLabel: (value: string) => value,
            getOptionsValue: (value: string) => value,
          },
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Payslips",
    apiEndPoint: "https://api.techbee.et/api/hr/payslips", // Placeholder endpoint
    formName: "payslipForm",
    allowDelete: false,
    allowCreateNew: false,
    allowEdit: false,
    createTitle: "Create New Payslip",
    sections: ["General"],
    editTitle: "Edit Payslip",
  } as SchemaMeta);
