import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id } from "@/lib/schemas/common-schemas";
import { preprocessedDateTime, dateCell } from "@/lib/schemas/time-parser";
import { format } from "date-fns";

export const payslipInputSchema = z
  .object({
    name: z.string().meta({
      formRelated: {
        section: "Payslip Details",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the payslip input.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    amount: z.number().meta({
      formRelated: {
        section: "Payslip Details",
        inputType: "number-field",
        label: "Amount",
        placeholder: "Enter amount",
        description: "The amount for the payslip.",
        validationErrorMessage: "Amount is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Amount",
        accessorKey: "amount",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "Payslip Details",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "A unique code for the payslip input.",
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
          section: "Payslip Details",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter a description",
          description: "A detailed description of the payslip input.",
          validationErrorMessage: "Description is optional.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Employee",
            placeholder: "Select employee",
            description: "The employee associated with this payslip.",
            validationErrorMessage: "Employee is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://hr.api.techbee.et/api/employees",
              getOptionsLabel: (value) =>
                `${value.firstName || ""}  ${value?.fatherName || ""} ${
                  value?.grandFatherName || ""
                }`,
              getOptionsValue: (value) => value.id,
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
          header: "Employee",
          accessorFn(originalRow) {
            return `${originalRow?.employee?.firstName || ""} ${
              originalRow?.employee?.fatherName || ""
            } ${originalRow?.employee?.grandFatherName || ""}`;
          },
        },
      } as FieldLevelMeta),

    periodStart: preprocessedDateTime.meta({
      formRelated: {
        section: "Payslip Details",
        inputType: "date-time",
        label: "Period Start",
        placeholder: "Select period start date and time",
        description: "The start date and time of the payslip period.",
        validationErrorMessage: "Period start date is required.",
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
    periodEnd: preprocessedDateTime.meta({
      formRelated: {
        section: "Payslip Details",
        inputType: "date-time",
        label: "Period End",
        placeholder: "Select period end date and time",
        description: "The end date and time of the payslip period.",
        validationErrorMessage: "Period end date is required.",
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
    externalCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Payslip Details",
          inputType: "text-field",
          label: "External Code",
          placeholder: "Enter external code",
          description: "The external code for the payslip input.",
          validationErrorMessage: "External code is optional.",
        },
        tableRelated: {
          header: "External Code",
          accessorKey: "externalCode",
        },
      } as FieldLevelMeta),

    // paySlip: z
    //   .object({
    //     id: z.string().optional().nullable().meta({

    //     } as FieldLevelMeta),

    //   }).optional().meta({
    //     tableRelated: {
    //       header: "Payslip",
    //       accessorKey: "paySlip.name",
    //     },
    //   })
  })
  .meta({
    tableName: "Payslip Input",
    apiEndPoint: "https://hr.api.techbee.et/api/payslipInputs",
    formName: "payslipInput",
    allowDelete: true,
    createTitle: "Create Payslip Input",
    sections: ["Payslip Details", "Relations"],
    editTitle: "Edit Payslip Input",
  } as SchemaMeta);
