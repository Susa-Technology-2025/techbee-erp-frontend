import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import { OnboardingPlanCreateInputSchema } from "./onboarding-plan";
import { organizationSchema } from "../organization-node";

export const OnboardingTaskAssignmentCreateInputSchema = z
  .object({
    assignedDept: z.string().meta({
      id,
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
    dueDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Due Date",
          placeholder: "Select due date",
          description: "The date when the task is due.",
          validationErrorMessage: "Due date is required.",
          section: "General",
          required: true,
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Due Date",
          accessorKey: "dueDate",
          Cell: ({ cell }) => dateCell({ cell }),
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
    plan: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Plan",
            placeholder: "Select a plan",
            description: "The onboarding plan this task belongs to.",
            validationErrorMessage: "Plan is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/onboardingPlans",
              getOptionsLabel: (value) => value.employee?.firstName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: OnboardingPlanCreateInputSchema,
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
          header: "Plan",
          accessorKey: "plan.name",
        },
      } as FieldLevelMeta),
    status: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Status",
        placeholder: "Select a status",
        description: "The current status of the task.",
        validationErrorMessage: "Status is required.",
        section: "General",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["NotStarted", "InProgress", "Completed", "Blocked"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
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
    tableName: "Onboarding Task Assignments",
    apiEndPoint: "https://api.techbee.et/api/hr/onboardingTaskAssignments",
    formName: "onboardingTaskAssignment",
    allowDelete: true,
    createTitle: "Create Onboarding Task Assignment",
    sections: ["General"],
    editTitle: "Edit Onboarding Task Assignment",
  } as SchemaMeta);
