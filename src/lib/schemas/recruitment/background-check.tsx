import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { preprocessedDate } from "@/lib/schemas/time-parser";
import { ApplicationCreateInput } from "./application";

export const BackgroundCheckCreateInputSchema = z
  .object({
    id,
    application: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Application",
            placeholder: "Select application",
            description: "The application for the background check.",
            validationErrorMessage: "Application is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/applications",
              getOptionsLabel: (value) => value.id,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: ApplicationCreateInput,
            },
          },
          tableRelated: {
            header: "Application",
            accessorKey: "application.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Application",
          accessorKey: "application.name",
        },
      } as FieldLevelMeta),
    provider: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Provider",
        placeholder: "Enter provider",
        description: "The provider of the background check service.",
        validationErrorMessage: "Provider is required.",
        required: true,
      },
      tableRelated: {
        header: "Provider",
        accessorKey: "provider",
      },
    } as FieldLevelMeta),
    reportUrl: z.url().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Report URL",
        placeholder: "Enter report URL",
        description: "The URL of the background check report.",
        validationErrorMessage: "A valid URL is required.",
        required: false,
      },
      tableRelated: {
        header: "Report URL",
        accessorKey: "reportUrl",
      },
    } as FieldLevelMeta),
    status: z.enum(["Pending", "Clear", "Flagged"]).meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Status",
        placeholder: "Select status",
        description: "The status of the background check.",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { label: "Pending", value: "Pending" },
            { label: "Clear", value: "Clear" },
            { label: "Flagged", value: "Flagged" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
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
    tableName: "Background Checks",
    apiEndPoint: "https://api.techbee.et/api/hr/backgroundChecks",
    formName: "backgroundCheck",
    allowDelete: true,
    createTitle: "Create Background Check",
    editTitle: "Edit Background Check",
    sections: ["General"],
  } as SchemaMeta);
