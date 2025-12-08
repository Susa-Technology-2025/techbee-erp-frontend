import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDateTime } from "@/lib/schemas/time-parser";
import { employeeSchema } from "../emp-for-contract";
import {
  incidentActionSchema,
  incidentStatusSchema,
  incidentTypeSchema,
} from "./settings";
import { appStatus, employeeId, orgology } from "../nested-reusable-objects";

export const incidentSchema = z
  .object({
    id,
    actionTaken: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Action Taken",
            placeholder: "Select action taken",
            description: "The action taken for the incident.",
            validationErrorMessage: "Action taken is required.",
            required: false,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/incidentActions",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: incidentActionSchema,
            },
          },
          tableRelated: {
            header: "Action Taken",
            accessorKey: "actionTaken.name",
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
          header: "Action Taken",
          accessorKey: "actionTaken.name",
        },
      } as FieldLevelMeta),

    approvalStatus: appStatus,
    dateOfIncident: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Date of Incident",
        placeholder: "Select date of incident",
        description: "The date when the incident occurred.",
        validationErrorMessage: "Date of incident is required.",
        section: "General",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Date of Incident",
        accessorKey: "dateOfIncident",
      },
    } as FieldLevelMeta),

    // decisionMaker: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "text-field",
    //       section: "General",
    //       label: "Decision Maker",
    //       placeholder: "Enter decision maker",
    //       description: "Person who made the decision on the incident.",
    //       validationErrorMessage: "Decision maker is required.",
    //       required: false,
    //     },
    //     tableRelated: {
    //       header: "Decision Maker",
    //       accessorKey: "decisionMaker",
    //     },
    //   } as FieldLevelMeta),

    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          section: "General",
          label: "Description",
          placeholder: "Enter description",
          description: "Detailed description of the incident.",
          validationErrorMessage: "Description is required.",
          required: false,
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),

    employee: employeeId("General"),

    incidentType: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Incident Type",
            placeholder: "Select incident type",
            description: "The type of incident.",
            validationErrorMessage: "Incident type is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/incidentTypes",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: incidentTypeSchema,
            },
          },
          tableRelated: {
            header: "Incident Type",
            accessorKey: "incidentType.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Incident Type",
          accessorKey: "incidentType.name",
        },
      } as FieldLevelMeta),

    organizationNodeId: orgology("General"),

    performanceImpactScore: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "number-field",
          section: "General",
          label: "Performance Impact Score",
          placeholder: "Enter performance impact score",
          description: "Score representing the impact on performance.",
          validationErrorMessage: "Performance impact score is required.",
          required: false,
        },
        tableRelated: {
          header: "Performance Impact Score",
          accessorKey: "performanceImpactScore",
        },
      } as FieldLevelMeta),

    position: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Position",
            placeholder: "Select position",
            description:
              "The position of the employee at the time of the incident.",
            validationErrorMessage: "Position is required.",
            required: false,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/positions",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Position",
            accessorKey: "position.name",
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
          header: "Position",
          accessorKey: "position.name",
        },
      } as FieldLevelMeta),

    remarks: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          section: "General",
          label: "Remarks",
          placeholder: "Enter remarks",
          description: "Remarks about the incident.",
          validationErrorMessage: "Remarks are required.",
          required: false,
        },
        tableRelated: {
          header: "Remarks",
          accessorKey: "remarks",
        },
      } as FieldLevelMeta),

    status: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Status",
            placeholder: "Select status",
            description: "The status of the incident.",
            validationErrorMessage: "Status is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/incidentStatuses",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: incidentStatusSchema,
            },
          },
          tableRelated: {
            header: "Status",
            accessorKey: "status.name",
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
          header: "Status",
          accessorKey: "status.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Incidents",
    apiEndPoint: "https://api.techbee.et/api/hr/incidents",
    formName: "incident",
    allowDelete: true,
    createTitle: "Create Incident",
    sections: ["General"],
    editTitle: "Edit Incident",
  } as SchemaMeta);
