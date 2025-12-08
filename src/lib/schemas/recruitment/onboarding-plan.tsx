import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import { OnboardingTemplateCreateInputSchema } from "./onboarding-templates";
import { employeeSchema } from "../emp-for-contract";

export const OnboardingPlanCreateInputSchema = z
  .object({
    id,
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Employee",
            placeholder: "Select an employee",
            description: "The employee assigned to this onboarding plan.",
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
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.firstName",
        },
      } as FieldLevelMeta),
    endDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "End Date",
          placeholder: "Select end date",
          description: "The planned end date for the onboarding.",
          validationErrorMessage: "End date is required.",
          section: "General",
          required: true,
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "End Date",
          accessorKey: "endDate",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    startDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Start Date",
          placeholder: "Select start date",
          description: "The planned start date for the onboarding.",
          validationErrorMessage: "Start date is required.",
          section: "General",
          required: true,
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Start Date",
          accessorKey: "startDate",
          Cell: ({ cell }) => dateCell({ cell }),
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
            description: "The onboarding template used for this plan.",
            validationErrorMessage: "Template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/onboardingTemplates",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: OnboardingTemplateCreateInputSchema,
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
    ...dateTime,
  })
  .meta({
    tableName: "Onboarding Plans",
    apiEndPoint: "https://api.techbee.et/api/hr/onboardingPlans",
    formName: "onboardingPlan",
    allowDelete: true,
    createTitle: "Create Onboarding Plan",
    sections: ["General"],
    editTitle: "Edit Onboarding Plan",
  } as SchemaMeta);
