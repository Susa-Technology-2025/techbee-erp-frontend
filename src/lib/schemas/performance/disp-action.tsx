import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDateTime } from "@/lib/schemas/time-parser";
import { employeeSchema } from "../emp-for-contract";
import { incidentSchema } from "./incident";

export const disciplinaryActionSchema = z
  .object({
    id,
    action: z.string().meta({
      formRelated: {
        inputType: "text-field",
        section: "General",
        label: "Action",
        placeholder: "Enter disciplinary action",
        description: "The disciplinary action taken.",
        validationErrorMessage: "Action is required.",
        required: true,
      },
      tableRelated: {
        header: "Action",
        accessorKey: "action",
      },
    } as FieldLevelMeta),

    date: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Date",
        placeholder: "Select date of action",
        description: "The date when the action was taken.",
        validationErrorMessage: "Date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Date",
        accessorKey: "date",
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
            description:
              "The employee to whom the disciplinary action applies.",
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
          accessorKey: "employee.name",
        },
      } as FieldLevelMeta),

    incident: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Incident",
            placeholder: "Select incident",
            description: "The incident associated with the action.",
            validationErrorMessage: "Incident is required.",
            required: false,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/incidents",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: incidentSchema,
            },
          },
          tableRelated: {
            header: "Incident",
            accessorKey: "incident.name",
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
          header: "Incident",
          accessorKey: "incident.name",
        },
      } as FieldLevelMeta),

    reason: z.string().meta({
      formRelated: {
        inputType: "text-area",
        section: "General",
        label: "Reason",
        placeholder: "Enter reason for action",
        description: "The reason for the disciplinary action.",
        validationErrorMessage: "Reason is required.",
        required: true,
      },
      tableRelated: {
        header: "Reason",
        accessorKey: "reason",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Disciplinary Actions",
    apiEndPoint: "https://api.techbee.et/api/hr/disciplinaryActions",
    formName: "disciplinaryAction",
    allowDelete: true,
    createTitle: "Create Disciplinary Action",
    sections: ["General"],
    editTitle: "Edit Disciplinary Action",
  } as SchemaMeta);
