import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  preprocessedDate,
  dateCell,
  preprocessedDateTime,
} from "@/lib/schemas/time-parser";
import { employeeId, userId } from "../nested-reusable-objects";

// --- Helper Enum Options ---
const responseTypeOptions = [
  { id: "YesNo", name: "Yes/No" },
  { id: "Text", name: "Text Input" },
];

const reasonOptions = [
  { id: "Resignation", name: "Resignation" },
  { id: "Termination", name: "Termination" },
  { id: "Retirement", name: "Retirement" },
];

const reviewStatusOptions = [
  { id: "Pending", name: "Pending Review" },
  { id: "Approved", name: "Approved" },
  { id: "Rejected", name: "Rejected" },
];

// --- 1. OffboardingTemplateCreateInput Schema ---
export const offboardingTemplateSchema = z
  .object({
    id,
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Template Title",
        placeholder: "Enter template title",
        description: "Name of the offboarding template.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Template Code",
        placeholder: "Enter unique code",
        description: "Unique identifier for the template.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Offboarding Templates",
    apiEndPoint: "https://api.techbee.et/api/hr/offboardingTemplates",
    formName: "offboardingTemplate",
    allowDelete: true,
    createTitle: "Create Offboarding Template",
    sections: ["General"],
    editTitle: "Edit Offboarding Template",
  } as SchemaMeta);

// --- 2. OffboardingQuestionCreateInput Schema ---
export const offboardingQuestionSchema = z
  .object({
    id,
    questionText: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Question Text",
        placeholder: "Enter the offboarding question",
        description: "The actual question asked during offboarding.",
        validationErrorMessage: "Question text is required.",
        required: true,
      },
      tableRelated: {
        header: "Question",
        accessorKey: "questionText",
      },
    } as FieldLevelMeta),
    responseType: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Response Type",
        placeholder: "Select response type",
        description: "The expected format of the answer (Yes/No or Text).",
        validationErrorMessage: "Response type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: responseTypeOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Response Type",
        accessorKey: "responseType",
      },
    } as FieldLevelMeta),
    mandatory: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Mandatory",
          description: "Is an answer to this question required?",
          required: true,
        },
        tableRelated: {
          header: "Mandatory",
          accessorKey: "mandatory",
        },
      } as FieldLevelMeta),
    template: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Offboarding Template",
              placeholder: "Select offboarding template",
              description: "The template this question belongs to.",
              validationErrorMessage: "Template is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/offboardingTemplates",
                getOptionsLabel: (value) => value.title,
                getOptionsValue: (value) => value.id,
                createSchema: offboardingTemplateSchema,
                allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Template",
              accessorKey: "template.title",
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
          header: "Template",
          accessorKey: "template.title",
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),
    ...dateTime,
  })
  .meta({
    tableName: "Offboarding Questions",
    apiEndPoint: "https://api.techbee.et/api/hr/offboardingQuestions",
    formName: "offboardingQuestion",
    allowDelete: true,
    createTitle: "Create Offboarding Question",
    sections: ["General", "Relations"],
    editTitle: "Edit Offboarding Question",
  } as SchemaMeta);

// --- 3. OffboardingRequestCreateInput Schema ---
export const offboardingRequestSchema = z
  .object({
    id,
    reason: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Reason",
        placeholder: "Select offboarding reason",
        description:
          "The reason for the employee's departure (Resignation, Termination, Retirement).",
        validationErrorMessage: "Reason is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: reasonOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Reason",
        accessorKey: "reason",
      },
    } as FieldLevelMeta),
    approvalStatus: z
      .string()
      .default("PendingApproval")
      .meta({
        formRelated: {
          section: "Approval",
          inputType: "table-only", // Assuming this is set by system/workflow, keeping as text-field for general input
          label: "Approval Status",
          placeholder: "Enter approval status",
          description:
            "Current status of the offboarding request (e.g., Pending, Approved).",
          validationErrorMessage: "Approval status is required.",
          required: true,
        },
        tableRelated: {
          header: "Status",
          accessorKey: "approvalStatus",
        },
      } as FieldLevelMeta),
    requestedBy: userId({
      section: "General",
      required: true,
      label: "Requested By",
    }),
    // approvedBy: userId({section: "General",required: true, label: "Approved By"}),
    // approvedAt: preprocessedDate
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "table-only",
    //       label: "Approved At",
    //       placeholder: "Select approval date",
    //       description: "The date the request was approved.",
    //       section: "Approval",
    //       date: {
    //         type: "date-only",
    //         min: undefined,
    //         max: undefined,
    //       },
    //     },
    //     tableRelated: {
    //       header: "Approved Date",
    //       accessorKey: "approvedAt",
    //       Cell: ({ cell }) => dateCell({ cell }),
    //     },
    //   } as FieldLevelMeta),
    notes: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Notes",
          placeholder: "Enter any notes",
          description: "General notes regarding the offboarding process.",
        },
        tableRelated: {
          header: "Notes",
          accessorKey: "notes",
        },
      } as FieldLevelMeta),
    employee: employeeId("General"),

    // exitSurvey: z
    //   .object({
    //     id: z.string().meta({
    //       formRelated: {
    //         inputType: "auto-complete",
    //         section: "Relations",
    //         label: "Exit Survey",
    //         placeholder: "Select exit survey",
    //         description: "The linked exit survey for this request.",
    //         validationErrorMessage: "Invalid exit survey.",
    //         autoComplete: {
    //           multiple: false,
    //           async: true,
    //           getEndpoint: "https://api.techbee.et/api/hr/exitSurveys",
    //           getOptionsLabel: (value) => value.name,
    //           getOptionsValue: (value) => value.id,
    //           // createSchema: exitSurveySchema,
    //           // allowCreateNew: true,
    //         },
    //       },
    //       tableRelated: {
    //         header: "Survey ID",
    //         accessorKey: "exitSurvey.id",
    //       },
    //     } as FieldLevelMeta),
    //   })
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "object",
    //     },
    //     tableRelated: {
    //       header: "Exit Survey",
    //       accessorKey: "exitSurvey.id",
    //     },
    //   } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Offboarding Requests",
    apiEndPoint: "https://api.techbee.et/api/hr/offboardingRequests",
    formName: "offboardingRequest",
    allowDelete: true,
    createTitle: "Create Offboarding Request",
    sections: ["General", "Details"],
    editTitle: "Edit Offboarding Request",
  } as SchemaMeta);

// --- 4. OffboardingTaskCreateInput Schema ---
export const offboardingTaskSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Task Name",
        placeholder: "Enter task name",
        description:
          "The name of the offboarding task (e.g., Collect laptop, Final Paycheck).",
        validationErrorMessage: "Task name is required.",
        required: true,
      },
      tableRelated: {
        header: "Task",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    assignedTo: userId({
      section: "General",
      required: false,
      label: "Task Overseer",
    }),
    deadline: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Deadline",
        placeholder: "Select deadline date",
        description: "The target date for task completion.",
        validationErrorMessage: "Deadline is required.",
        section: "Timeframe",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Deadline",
        accessorKey: "deadline",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    finished: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          section: "Status",
          inputType: "boolean-field",
          label: "Finished",
          description: "Indicates if the task has been completed.",
          required: true,
        },
        tableRelated: {
          header: "Finished",
          accessorKey: "finished",
        },
      } as FieldLevelMeta),
    completedAt: preprocessedDateTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Completed At",
          placeholder: "Select completion date and time",
          description: "The date and time the task was completed.",
          section: "Status",
          date: {
            type: "date-and-time",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Completed At",
          accessorKey: "completedAt",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    reviewStatus: z.string().meta({
      formRelated: {
        section: "Review",
        inputType: "auto-complete",
        label: "Review Status",
        placeholder: "Select review status",
        description: "The current review status of the completed task.",
        validationErrorMessage: "Review status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: reviewStatusOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Review Status",
        accessorKey: "reviewStatus",
      },
    } as FieldLevelMeta),
    // reviewer: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       section: "Review",
    //       inputType: "text-field",
    //       label: "Reviewer",
    //       placeholder: "Enter reviewer's user ID",
    //       description: "The person who reviewed the completed task.",
    //     },
    //     tableRelated: {
    //       header: "Reviewer",
    //       accessorKey: "reviewer",
    //     },
    //   } as FieldLevelMeta),
    remarks: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Review",
          inputType: "text-area",
          label: "Remarks",
          placeholder: "Enter reviewer remarks",
          description: "Comments or feedback from the reviewer.",
        },
        tableRelated: {
          header: "Remarks",
          accessorKey: "remarks",
        },
      } as FieldLevelMeta),
    offboardingRequest: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Offboarding Request",
            placeholder: "Select offboarding request",
            description: "The request this task belongs to.",
            validationErrorMessage: "Offboarding request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/offboardingRequests",
              getOptionsLabel: (value) =>
                value.employee?.firstName + " " + value.employee?.fatherName, // Assuming request links to employee
              getOptionsValue: (value) => value.id,
              createSchema: offboardingRequestSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request ID",
            accessorKey: "offboardingRequest.id",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Offboarding Request",
          accessorKey: "offboardingRequest.id",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Offboarding Tasks",
    apiEndPoint: "https://api.techbee.et/api/hr/offboardingTasks",
    formName: "offboardingTask",
    allowDelete: true,
    createTitle: "Create Offboarding Task",
    sections: ["General", "Timeframe", "Status", "Review", "Relations"],
    editTitle: "Edit Offboarding Task",
  } as SchemaMeta);

// --- 5. ExitSurveyCreateInput Schema ---
export const exitSurveySchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Survey name",
        placeholder: "Enter a unique name",
        description: "Name for the entity.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter a unique code",
        description: "for the  plan.",
        validationErrorMessage: "code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    // employee: employeeId("General"),
    offboardingRequest: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Offboarding Request",
            placeholder: "Select offboarding request",
            description: "The request this survey is linked to.",
            validationErrorMessage: "Offboarding request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/offboardingRequests",
              getOptionsLabel: (value) =>
                value.employee?.firstName + " " + value.employee?.fatherNamer,
              getOptionsValue: (value) => value.id,
              createSchema: offboardingRequestSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request ID",
            accessorKey: "offboardingRequest.id",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Offboarding Request",
          accessorKey: "offboardingRequest.id",
        },
      } as FieldLevelMeta),
    template: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Offboarding Template",
            placeholder: "Select offboarding template",
            description: "The template used for this survey.",
            validationErrorMessage: "Template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/offboardingTemplates",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: offboardingTemplateSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Template",
            accessorKey: "template.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Template",
          accessorKey: "template.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Exit Surveys",
    apiEndPoint: "https://api.techbee.et/api/hr/exitSurveys",
    formName: "exitSurvey",
    allowDelete: true,
    createTitle: "Create Exit Survey",
    sections: ["General", "Relations"],
    editTitle: "Edit Exit Survey",
  } as SchemaMeta);

// --- 6. ExitSurveyResponseCreateInput Schema ---
export const exitSurveyResponseSchema = z
  .object({
    id,
    answer: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Answer",
        placeholder: "Enter the survey answer",
        description: "The response provided by the employee.",
        validationErrorMessage: "Answer is required.",
        required: true,
      },
      tableRelated: {
        header: "Answer",
        accessorKey: "answer",
      },
    } as FieldLevelMeta),
    question: z
      .object({
        id: z
          .string()
          .uuid()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Question",
              placeholder: "Select offboarding question",
              description: "The question this response answers.",
              validationErrorMessage: "Question is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/offboardingQuestions",
                getOptionsLabel: (value) => value.questionText,
                getOptionsValue: (value) => value.id,
                createSchema: undefined,
                allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Question",
              accessorKey: "question.questionText",
            },
          } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Question",
          accessorKey: "question.questionText",
        },
      } as FieldLevelMeta),
    survey: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Exit Survey",
            placeholder: "Select exit survey",
            description: "The survey this response belongs to.",
            validationErrorMessage: "Survey is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/exitSurveys",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Survey ID",
            accessorKey: "survey.id",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Survey",
          accessorKey: "survey.id",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Exit Survey Responses",
    apiEndPoint: "https://api.techbee.et/api/hr/exitSurveyResponses",
    formName: "exitSurveyResponse",
    allowDelete: true,
    createTitle: "Create Exit Survey Response",
    sections: ["General", "Relations"],
    editTitle: "Edit Exit Survey Response",
  } as SchemaMeta);
