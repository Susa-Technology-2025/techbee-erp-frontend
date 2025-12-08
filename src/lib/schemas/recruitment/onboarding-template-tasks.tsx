import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { organizationSchema } from "../organization-node";

export const OnboardingTemplateTaskCreateInputSchema = z
  .object({
    id,
    assignedDept: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Assigned Department",
        placeholder: "Select a department",
        description: "The department responsible for this task.",
        validationErrorMessage: "Assigned department is required.",
        section: "General",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: organizationSchema,
        },
      },
      tableRelated: {
        header: "Assigned Department",
        accessorKey: "assignedDept.name",
      },
    } as FieldLevelMeta),
    category: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Category",
        placeholder: "Select a category",
        description: "The category of the task.",
        validationErrorMessage: "Category is required.",
        section: "General",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["HR", "IT", "Facilities", "Manager"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Category",
        accessorKey: "category",
      },
    } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter task name",
        description: "The name of the onboarding task.",
        validationErrorMessage: "Name is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    relativeDueDays: z.number().meta({
      formRelated: {
        inputType: "number-field",
        label: "Relative Due Days",
        placeholder: "Enter due days",
        description:
          "The number of days after onboarding starts for the task to be due.",
        validationErrorMessage: "Relative due days is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Relative Due Days",
        accessorKey: "relativeDueDays",
      },
    } as FieldLevelMeta),
    required: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Required",
          description: "Indicates if the task is mandatory.",
          section: "General",
        },
        tableRelated: {
          header: "Required",
          accessorKey: "required",
        },
      } as FieldLevelMeta),
    template: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Template",
            placeholder: "Select a template",
            description: "The template this task belongs to.",
            validationErrorMessage: "Template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/onboardingTemplates",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
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
          header: "Template",
          accessorKey: "template.name",
        },
      } as FieldLevelMeta),
    type: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Type",
        placeholder: "Select a type",
        description: "The type of onboarding task.",
        validationErrorMessage: "Type is required.",
        section: "General",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Document", "Signature", "Meeting", "ToDo"],
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
    tableName: "Onboarding Template Tasks",
    apiEndPoint: "https://api.techbee.et/api/hr/onboardingTemplateTasks",
    formName: "onboardingTemplateTask",
    allowDelete: true,
    createTitle: "Create Onboarding Template Task",
    sections: ["General"],
    editTitle: "Edit Onboarding Template Task",
  } as SchemaMeta);
