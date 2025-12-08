import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDateTime } from "@/lib/schemas/time-parser";
import { employeeSchema } from "../emp-for-contract";
export const application2 = z
  .object({
    id: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "application",
        placeholder: "Select application",
        description: "The applicator associated with this record.",
        validationErrorMessage: "Application is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/hr/applications",
          getOptionsLabel: (value) =>
            value.requisition?.title +
            " - " +
            value.candidate?.firstName +
            " " +
            value.candidate?.fatherName,
          getOptionsValue: (value) => value.id,
          // allowCreateNew: true,
          // createSchema: ApplicationCreateInput,
        },
      },
    } as FieldLevelMeta),
  })
  .meta({
    formRelated: {
      inputType: "object",
    },
    tableRelated: {
      header: "Applicator",
      accessorKey: "application.id",
      Cell: ({ row }) => {
        const candidate = row.original.application?.candidate;
        return `${row.original.application?.requisition?.title} / ${candidate?.firstName} ${candidate?.fatherName}`;
      },
    },
  } as FieldLevelMeta);
export const interviewSchema = z
  .object({
    id,
    application: application2,

    durationMin: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "number-field",
          section: "General",
          label: "Duration (min)",
          placeholder: "Enter duration in minutes",
          description: "The duration of the interview in minutes.",
          validationErrorMessage: "Duration is required.",
          required: true,
        },
        tableRelated: {
          header: "Duration (min)",
          accessorKey: "durationMin",
        },
      } as FieldLevelMeta),

    location: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          section: "General",
          label: "Location",
          placeholder: "Enter location",
          description: "The location of the interview.",
          validationErrorMessage: "Location is required.",
          required: false,
        },
        tableRelated: {
          header: "Location",
          accessorKey: "location",
        },
      } as FieldLevelMeta),

    panelistIds: z.array(z.string()).meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Attenders",
        placeholder: "Select attenders",
        description: "The attenders assigned to the intervieww.",
        validationErrorMessage: "At least one attender is required.",
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
    } as FieldLevelMeta),

    scheduledAt: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        section: "General",
        label: "Scheduled At",
        placeholder: "Select scheduled date and time",
        description: "The scheduled date and time of the interview.",
        validationErrorMessage: "Scheduled date and time is required.",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Scheduled At",
        accessorKey: "scheduledAt",
      },
    } as FieldLevelMeta),

    type: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "General",
          label: "Type",
          placeholder: "Select interview type",
          description: "The type of the interview.",
          validationErrorMessage: "Interview type is required.",
          required: false,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Phone", "Virtual", "InPerson"],
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
    ...dateTime,
  })
  .meta({
    tableName: "Interviews",
    apiEndPoint: "https://api.techbee.et/api/hr/interviews",
    formName: "interview",
    allowDelete: true,
    createTitle: "Create Interview",
    sections: ["General"],
    editTitle: "Edit Interview",
  } as SchemaMeta);
