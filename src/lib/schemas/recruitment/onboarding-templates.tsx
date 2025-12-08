import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const OnboardingTemplateCreateInputSchema = z
  .object({
    id,
    departmentId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Department",
        placeholder: "Select department",
        description: "The department associated with this onboarding template.",
        validationErrorMessage: "Department is required.",
        section: "General",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
        },
      },
      tableRelated: {
        header: "Department",
        accessorKey: "department.name",
      },
    } as FieldLevelMeta),
    description: z.string().meta({
      formRelated: {
        inputType: "text-area",
        label: "Description",
        placeholder: "Enter description",
        description: "A detailed description of the onboarding template.",
        validationErrorMessage: "Description is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Description",
        accessorKey: "description",
      },
    } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the onboarding template.",
        validationErrorMessage: "Name is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    role: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Role",
        placeholder: "Enter role",
        description: "The role associated with this onboarding template.",
        validationErrorMessage: "Role is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Role",
        accessorKey: "role",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Onboarding Templates",
    apiEndPoint: "https://api.techbee.et/api/hr/onboardingTemplates",
    formName: "onboardingTemplate",
    allowDelete: true,
    createTitle: "Create Onboarding Template",
    sections: ["General"],
    editTitle: "Edit Onboarding Template",
  } as SchemaMeta);
