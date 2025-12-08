import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { employeeId, userId } from "../nested-reusable-objects";
import { organizationSchema } from "../organization-node";
import {
  requests,
  tnaLinks,
  targetEmployeeLinks,
  subjects,
} from "./create-connect-many-schemas";

export const trainingRequestTnaSchema = z
  .object({
    id,
    request: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Request",
            placeholder: "Select training request",
            description: "The associated training request.",
            validationErrorMessage: "Training request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request Title",
            accessorKey: "request.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Request",
          accessorKey: "request.title",
        },
      } as FieldLevelMeta),
    survey: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "TNA Survey",
            placeholder: "Select TNA survey",
            description: "The associated training need survey.",
            validationErrorMessage: "TNA survey is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingNeedSurveys",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Survey Title",
            accessorKey: "survey.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "TNA Survey",
          accessorKey: "survey.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Request TNA Links",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequestTnas",
    formName: "trainingRequestTna",
    allowDelete: true,
    createTitle: "Link TNA Survey to Request",
    sections: ["Relations"],
    editTitle: "Edit TNA Link",
  } as SchemaMeta);

// 2. TrainingRequestCategoryCreateInput Schema
export const trainingRequestCategorySchema = z
  .object({
    id,
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Category Code",
        placeholder: "Enter unique code",
        description: "Unique code for the request category.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter category title",
        description: "Name of the training request category.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter description",
          description: "Details about the category.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Request Categories",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequestCategories",
    formName: "trainingRequestCategory",
    allowDelete: true,
    createTitle: "Create Training Request Category",
    sections: ["General"],
    editTitle: "Edit Training Request Category",
  } as SchemaMeta);
export const trainingRequestBundleSchema = z
  .object({
    id,
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Bundle Title",
        placeholder: "Enter bundle title",
        description: "The name of the training request bundle.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter description",
          description: "Details about the training request bundle.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    createdByUserId: userId({
      section: "General",
      required: true,
      label: "Created By",
    }),
    requests,
    ...dateTime,
  })
  .meta({
    tableName: "Training Request Bundles",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequestBundles",
    formName: "trainingRequestBundle",
    allowDelete: true,
    createTitle: "Create Training Request Bundle",
    sections: ["General"],
    editTitle: "Edit Training Request Bundle",
  } as SchemaMeta);

// 3. TrainingRequestCreateInput Schema
export const trainingRequestSchema = z
  .object({
    id,
    source: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Source",
        placeholder: "Select source of request",
        description:
          "The origin of the training need (Performance, TNA, Manual).",
        validationErrorMessage: "Source is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { id: "Performance", name: "Performance" },
            { id: "Tna", name: "TNA" },
            { id: "Manual", name: "Manual" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Source",
        accessorKey: "source",
      },
    } as FieldLevelMeta),
    appraisalSubjectLinks: subjects,
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Request Title",
        placeholder: "Enter request title",
        description: "The name of the training request.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),

    targetOrganizationNodeIds: z
      .array(z.string())
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "General",
          label: "Target Nodes",
          placeholder: "Select nodes",
          description: "Target organization nodes.",
          validationErrorMessage: "At least one node is required.",
          required: true,
          autoComplete: {
            multiple: true,
            async: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
            allowCreateNew: true,
            createSchema: organizationSchema,
          },
        },
      } as FieldLevelMeta),
    estimatedBudget: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Estimated Budget",
          placeholder: "Enter estimated budget",
          description: "The estimated financial cost for the training.",
        },
        tableRelated: {
          header: "Budget",
          accessorKey: "estimatedBudget",
        },
      } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter request description",
          description: "Detailed description of the training need.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    skillGap: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Skill Gap",
          placeholder: "Describe the skill gap",
          description: "The specific skill gap this training aims to address.",
        },
        tableRelated: {
          header: "Skill Gap",
          accessorKey: "skillGap",
        },
      } as FieldLevelMeta),
    category: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Category",
              placeholder: "Select request category",
              description: "The category of the training request.",
              validationErrorMessage: "Category is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/trainingRequestCategories",
                getOptionsLabel: (value) => value.title,
                getOptionsValue: (value) => value.id,
                createSchema: trainingRequestCategorySchema,
                allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Category",
              accessorKey: "category.title",
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Category",
          accessorKey: "category.title",
        },
      } as FieldLevelMeta),
    // bundle: z
    //   .object({
    //     id: z
    //       .string()
    //       .meta({
    //         formRelated: {
    //           inputType: "auto-complete",
    //           section: "Relations",
    //           label: "Training Bundle",
    //           placeholder: "Select training bundle",
    //           description: "The bundle this request is part of (if any).",
    //           validationErrorMessage: "Invalid bundle selection.",
    //           autoComplete: {
    //             multiple: false,
    //             async: true,
    //             getEndpoint:
    //               "https://api.techbee.et/api/hr/trainingRequestBundles",
    //             getOptionsLabel: (value) => value.title,
    //             getOptionsValue: (value) => value.id,
    //             createSchema: trainingRequestBundleSchema,
    //             allowCreateNew: true,
    //           },
    //         },
    //         tableRelated: {
    //           header: "Bundle",
    //           accessorKey: "bundle.title",
    //         },
    //       } as FieldLevelMeta)
    //       .optional()
    //       .nullable(),
    //   })
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       inputType: "object",
    //     },
    //     tableRelated: {
    //       header: "Bundle",
    //       accessorKey: "bundle.title",
    //     },
    //   } as FieldLevelMeta),
    createdByUserId: userId({
      section: "General",
      required: true,
      label: "Created By",
    }),
    tnaLinks,
    targetEmployeeLinks,
    ...dateTime,
  })
  .meta({
    tableName: "Training Requests",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequests",
    formName: "trainingRequest",
    allowDelete: true,
    createTitle: "Create Training Request",
    sections: ["General", "Details", "Relations"],
    editTitle: "Edit Training Request",
  } as SchemaMeta);

// 4. TrainingRequestAppraisalEvaluationCreateInput Schema
export const trainingRequestAppraisalEvaluationSchema = z
  .object({
    id,
    evaluation: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Appraisal Evaluation",
            placeholder: "Select appraisal evaluation",
            description: "The appraisal evaluation linked to the request.",
            validationErrorMessage: "Appraisal evaluation is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/appraisalEvaluations",
              getOptionsLabel: (value) =>
                value.subject?.employee?.firstName +
                " " +
                value.subject?.employee?.fatherName,
              getOptionsValue: (value) => value.id,
            },
          },
          tableRelated: {
            header: "Evaluation Title",
            accessorKey: "evaluation.plan?.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Appraisal Evaluation",
          accessorKey: "evaluation.plan?.title",
        },
      } as FieldLevelMeta),
    request: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Request",
            placeholder: "Select training request",
            description: "The associated training request.",
            validationErrorMessage: "Training request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request Title",
            accessorKey: "request.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Request",
          accessorKey: "request.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Request Evaluation Links",
    apiEndPoint:
      "https://api.techbee.et/api/hr/trainingRequestAppraisalSubjects",
    formName: "trainingRequestAppraisalEvaluation",
    allowDelete: true,
    createTitle: "Link Evaluation to Request",
    sections: ["Relations"],
    editTitle: "Edit Evaluation Link",
  } as SchemaMeta);

// 5. TrainingRequestTargetEmployeeCreateInput Schema
export const trainingRequestTargetEmployeeSchema = z
  .object({
    id,
    employee: employeeId("General"),
    request: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Training Request",
            placeholder: "Select training request",
            description: "The associated training request.",
            validationErrorMessage: "Training request is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: trainingRequestSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Request Title",
            accessorKey: "request.title",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Request",
          accessorKey: "request.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Request Target Employees",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRequestTargetEmployees",
    formName: "trainingRequestTargetEmployee",
    allowDelete: true,
    createTitle: "Add Target Employee",
    sections: ["General"],
    editTitle: "Edit Target Employee Link",
  } as SchemaMeta);

// 6. TrainingRequestBundleCreateInput Schema
