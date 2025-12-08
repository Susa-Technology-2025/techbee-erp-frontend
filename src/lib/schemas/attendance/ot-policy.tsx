import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { orgology } from "../nested-reusable-objects";
export const otPolicySchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Policy Name",
        placeholder: "Enter policy name",
        description: "A descriptive name for the overtime policy.",
        validationErrorMessage: "Policy Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    baseHourlyDivisor: z.number().meta({
      formRelated: {
        section: "Rates",
        inputType: "number-field",
        label: "Base Hourly Divisor",
        placeholder: "Enter divisor (e.g., 2080)",
        description:
          "The number used to calculate the base hourly rate (e.g., total annual working hours).",
        validationErrorMessage: "Base Hourly Divisor is required.",
        required: true,
      },
      tableRelated: {
        header: "Divisor",
        accessorKey: "baseHourlyDivisor",
      },
    } as FieldLevelMeta),
    normalRate: z.number().meta({
      formRelated: {
        section: "Rates",
        inputType: "number-field",
        label: "Normal Overtime Rate",
        placeholder: "Enter rate multiplier (e.g., 1.5)",
        description:
          "Multiplier for normal working hour overtime (e.g., 1.5 for time and a half).",
        validationErrorMessage: "Normal Rate is required.",
        required: true,
      },
      tableRelated: {
        header: "Normal Rate",
        accessorKey: "normalRate",
      },
    } as FieldLevelMeta),
    holidayRate: z.number().meta({
      formRelated: {
        section: "Rates",
        inputType: "number-field",
        label: "Holiday Overtime Rate",
        placeholder: "Enter rate multiplier (e.g., 2.0)",
        description: "Multiplier for overtime worked on public holidays.",
        validationErrorMessage: "Holiday Rate is required.",
        required: true,
      },
      tableRelated: {
        header: "Holiday Rate",
        accessorKey: "holidayRate",
      },
    } as FieldLevelMeta),
    weekendRate: z.number().meta({
      formRelated: {
        section: "Rates",
        inputType: "number-field",
        label: "Weekend Overtime Rate",
        placeholder: "Enter rate multiplier (e.g., 1.75)",
        description: "Multiplier for overtime worked on weekends.",
        validationErrorMessage: "Weekend Rate is required.",
        required: true,
      },
      tableRelated: {
        header: "Weekend Rate",
        accessorKey: "weekendRate",
      },
    } as FieldLevelMeta),
    nightRate: z.number().meta({
      formRelated: {
        section: "Rates",
        inputType: "number-field",
        label: "Night Overtime Rate",
        placeholder: "Enter rate multiplier (e.g., 1.6)",
        description: "Multiplier for overtime worked during night shifts.",
        validationErrorMessage: "Night Rate is required.",
        required: true,
      },
      tableRelated: {
        header: "Night Rate",
        accessorKey: "nightRate",
      },
    } as FieldLevelMeta),
    organizationNodeId: orgology("General"),
    ...dateTime,
  })
  .meta({
    tableName: "Overtime Policies",
    apiEndPoint: "https://api.techbee.et/api/hr/overtimePolicies",
    formName: "overtimePolicy",
    allowDelete: true,
    createTitle: "Create Overtime Policy",
    sections: ["General", "Rates"],
    editTitle: "Edit Overtime Policy",
  } as SchemaMeta);
