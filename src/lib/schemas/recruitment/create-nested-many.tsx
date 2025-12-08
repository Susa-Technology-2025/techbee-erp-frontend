import z from "zod";
import { employeeSchema } from "../emp-for-contract";
import { FieldLevelMeta, SchemaMeta } from "../types";
import { dateCell, preprocessedDateTime } from "../time-parser";
import { dateTime, id } from "../common-schemas";
import { orgology } from "../nested-reusable-objects";

export const OnboardingTaskAssignmentCreateSchema = z
  .object({
    // Primary Key (id) and Audit Fields (dateTime) are included via spread for consistency
    id,
    ...dateTime,

    assignedDept: orgology("General"),

    category: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Category",
        placeholder: "Select category",
        description: "The category of the onboarding task.",
        validationErrorMessage: "Category is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["HR", "IT", "Facilities", "Manager"],
          getOptionsLabel: (value: string) => value,
          getOptionsValue: (value: string) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Category",
        accessorKey: "category",
      },
    } as FieldLevelMeta),

    contractSignKey: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Contract Sign Key",
          placeholder: "Enter contract sign key",
          description: "Key for contract signing tasks (if applicable).",
          validationErrorMessage: "Contract Sign Key is required.",
          required: false,
        },
        tableRelated: {
          header: "Sign Key",
          accessorKey: "contractSignKey",
        },
      } as FieldLevelMeta),

    dueDate: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Due Date",
        placeholder: "Select due date and time",
        description: "The deadline for completing the task.",
        validationErrorMessage: "Due Date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-and-time",
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

    fileUrl: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "File URL",
          placeholder: "Enter file URL",
          description: "URL to the necessary document or file.",
          validationErrorMessage: "File URL is required.",
          required: false,
        },
        tableRelated: {
          header: "File URL",
          accessorKey: "fileUrl",
        },
      } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Task Name",
        placeholder: "Enter task name",
        description: "A descriptive name for the onboarding task.",
        validationErrorMessage: "Task Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    plan: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relationship",
              label: "Onboarding Plan",
              placeholder: "Select onboarding plan",
              description: "The unique plan this task belongs to.",
              validationErrorMessage: "Onboarding Plan ID is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/onboardingPlans",
                getOptionsLabel: (value: any) => value.name,
                getOptionsValue: (value: any) => value.id,
                // createSchema: OnboardingPlanCreateSchema,
                // allowCreateNew: true,
              },
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Onboarding Plan",
          accessorKey: "plan.name", // Assuming the related object has a 'name' field
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),

    status: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Status",
        placeholder: "Select status",
        description: "Current status of the task.",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["NotStarted", "InProgress", "Completed", "Blocked"],
          getOptionsLabel: (value: string) => value,
          getOptionsValue: (value: string) => value,
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
        section: "General",
        inputType: "auto-complete",
        label: "Task Type",
        placeholder: "Select task type",
        description: "The nature of the task.",
        validationErrorMessage: "Task Type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            "ContractSign",
            "Document",
            "Signature",
            "Meeting",
            "ToDo",
            "Other",
          ],
          getOptionsLabel: (value: string) => value,
          getOptionsValue: (value: string) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "type",
      },
    } as FieldLevelMeta),
  })
  .meta({
    tableName: "Onboarding Task Assignment",
    apiEndPoint: "https://api.techbee.et/api/hr/onboardingTaskAssignments",
    formName: "onboardingTaskAssignment",
    allowDelete: true,
    createTitle: "Create Onboarding Task Assignment",
    sections: ["General", "Details", "Relationship"],
    editTitle: "Edit Onboarding Task Assignment",
  } as SchemaMeta);
const tasksCOnnect = z
  .array(z.string())
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "Tasks",
      description: "Select tasks.",
      section: "General",
      required: true,
      autoComplete: {
        multiple: true,
        async: true,
        getEndpoint: "https://api.techbee.et/api/hr/onboardingTaskAssignments",
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
        allowCreateNew: true,
        createSchema: OnboardingTaskAssignmentCreateSchema,
      },
    },
  } as FieldLevelMeta)
  .optional()
  .nullable();

export const tasks = z
  .object({ connect: tasksCOnnect })
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "object",
      relationConnectKey: "employee",

      section: "General",
    },
  } as FieldLevelMeta);
