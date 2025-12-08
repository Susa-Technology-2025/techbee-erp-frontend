import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const performanceTemplateCreateInputSchema = z
  .object({
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter template code",
        description: "A unique code for the performance template.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
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
          placeholder: "Enter a description",
          description: "A brief description of the performance template.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    title: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Title",
        placeholder: "Enter title",
        description: "The title of the performance template.",
        validationErrorMessage: "Title is required.",
        required: true,
      },
      tableRelated: {
        header: "Title",
        accessorKey: "title",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Performance Template",
    apiEndPoint: "https://api.techbee.et/api/hr/performanceTemplates",
    formName: "performanceTemplate",
    allowDelete: true,
    createTitle: "Create Performance Template",
    sections: ["General"],
    editTitle: "Edit Performance Template",
  } as SchemaMeta);

export const ratingScaleCreateInputSchema = z
  .object({
    type: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Rating Type",
        placeholder: "Select rating type",
        description: "The type of rating for the question.",
        validationErrorMessage: "Rating type is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: ["Enum", "Descriptive", "FrequencyBased", "Scale"],
          getOptionsLabel: (value) => value,
          getOptionsValue: (value) => value,
          allowCreateNew: false,
        },
      },
      tableRelated: {
        header: "Rating Type",
        accessorKey: "ratingType",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter code",
        description: "A unique code for the rating scale.",
        validationErrorMessage: "Code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter name",
        description: "The name of the rating scale.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    options: z
      .array(
        z.object({
          label: z.string().meta({
            formRelated: {
              section: "General",
              inputType: "text-field",
              label: "Label",
              placeholder: "Enter label",
              description: "The display label for the rating option.",
              validationErrorMessage: "Label is required.",
              required: true,
            },
            tableRelated: {
              header: "Label",
              accessorKey: "label",
            },
          } as FieldLevelMeta),
          order: z
            .number()
            .optional()
            .nullable()
            .meta({
              formRelated: {
                section: "General",
                inputType: "number-field",
                label: "Order",
                placeholder: "Enter order",
                description: "The display order of the option.",
                validationErrorMessage: "Order is required.",
                required: true,
              },
              tableRelated: {
                header: "Order",
                accessorKey: "order",
              },
            } as FieldLevelMeta),

          score: z.number().meta({
            formRelated: {
              section: "General",
              inputType: "number-field",
              label: "Score",
              placeholder: "Enter score",
              description: "The numerical score associated with the option.",
              validationErrorMessage: "Score is required.",
              required: true,
            },
            tableRelated: {
              header: "Score",
              accessorKey: "score",
            },
          } as FieldLevelMeta),
          value: z.string().meta({
            formRelated: {
              section: "General",
              inputType: "text-field",
              label: "Value",
              placeholder: "Enter value",
              description: "The programmatic value of the option.",
              validationErrorMessage: "Value is required.",
              required: true,
            },
            tableRelated: {
              header: "Value",
              accessorKey: "value",
            },
          } as FieldLevelMeta),

          ...dateTime,
        })
      )
      .meta({
        formRelated: {
          inputType: "object-array",
          section: "Options",
        },
      } as FieldLevelMeta)
      .optional()
      .nullable(),
    ...dateTime,
  })
  .meta({
    tableName: "Rating Scale",
    apiEndPoint: "https://api.techbee.et/api/hr/ratingScales",
    formName: "ratingScale",
    allowDelete: true,
    createTitle: "Create Rating Scale",
    sections: ["General", "Options"],
    editTitle: "Edit Rating Scale",
  } as SchemaMeta);

export const performanceTemplateQuestionCreateInputSchema = z
  .object({
    code: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Code",
          placeholder: "Enter code",
          description: "A unique code for the question.",
        },
        tableRelated: {
          header: "Code",
          accessorKey: "code",
        },
      } as FieldLevelMeta),
    // description: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       section: "General",
    //       inputType: "text-area",
    //       label: "Description",
    //       placeholder: "Enter a description",
    //       description: "A description of the question.",
    //     },
    //     tableRelated: {
    //       header: "Description",
    //       accessorKey: "description",
    //     },
    //   } as FieldLevelMeta),
    order: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Order",
          placeholder: "Enter order",
          description: "The display order of the question.",
        },
        tableRelated: {
          header: "Order",
          accessorKey: "order",
        },
      } as FieldLevelMeta),
    question: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Question",
        placeholder: "Enter the question",
        description: "The text of the performance question.",
        validationErrorMessage: "Question is required.",
        required: true,
      },
      tableRelated: {
        header: "Question",
        accessorKey: "question",
      },
    } as FieldLevelMeta),
    ratingScale: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "General",
              label: "Rating Scale",
              placeholder: "Select rating scale",
              description: "The rating scale associated with the question.",
              validationErrorMessage: "Rating scale is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint: "https://api.techbee.et/api/hr/ratingScales",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                allowCreateNew: true,
                createSchema: ratingScaleCreateInputSchema,
              },
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
          header: "Rating Scale",
          accessorKey: "ratingScale.name",
        },
      } as FieldLevelMeta),

    section: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Section",
          placeholder: "Enter section name",
          description: "The section where the question belongs.",
        },
        tableRelated: {
          header: "Section",
          accessorKey: "section",
        },
      } as FieldLevelMeta),
    template: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Template",
            placeholder: "Select performance template",
            description: "The performance template this question belongs to.",
            validationErrorMessage: "Template is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/performanceTemplates",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: performanceTemplateCreateInputSchema,
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
    weight: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "number-field",
          label: "Weight",
          placeholder: "Enter weight",
          description: "The weight of the question in the appraisal.",
        },
        tableRelated: {
          header: "Weight",
          accessorKey: "weight",
        },
      } as FieldLevelMeta),
    required: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Required",
          description: "Indicates if the question is mandatory.",
        },
        tableRelated: {
          header: "Required",
          accessorKey: "required",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Performance Template Question",
    apiEndPoint: "https://api.techbee.et/api/hr/performanceTemplateQuestions",
    formName: "performanceTemplateQuestion",
    allowDelete: true,
    createTitle: "Create Performance Template Question",
    sections: ["General"],
    editTitle: "Edit Performance Template Question",
  } as SchemaMeta);

export const ratingScaleOptionCreateInputSchema = z
  .object({
    label: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Label",
        placeholder: "Enter label",
        description: "The display label for the rating option.",
        validationErrorMessage: "Label is required.",
        required: true,
      },
      tableRelated: {
        header: "Label",
        accessorKey: "label",
      },
    } as FieldLevelMeta),
    order: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Order",
        placeholder: "Enter order",
        description: "The display order of the option.",
        validationErrorMessage: "Order is required.",
        required: true,
      },
      tableRelated: {
        header: "Order",
        accessorKey: "order",
      },
    } as FieldLevelMeta),
    scale: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Rating Scale",
            placeholder: "Select rating scale",
            description: "The rating scale this option belongs to.",
            validationErrorMessage: "Rating scale is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/ratingScales",
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
          header: "Rating Scale",
          accessorKey: "scale.name",
        },
      } as FieldLevelMeta),
    score: z.number().meta({
      formRelated: {
        section: "General",
        inputType: "number-field",
        label: "Score",
        placeholder: "Enter score",
        description: "The numerical score associated with the option.",
        validationErrorMessage: "Score is required.",
        required: true,
      },
      tableRelated: {
        header: "Score",
        accessorKey: "score",
      },
    } as FieldLevelMeta),
    value: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Value",
        placeholder: "Enter value",
        description: "The programmatic value of the option.",
        validationErrorMessage: "Value is required.",
        required: true,
      },
      tableRelated: {
        header: "Value",
        accessorKey: "value",
      },
    } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Rating Scale Option",
    apiEndPoint: "https://api.techbee.et/api/hr/ratingScaleOptions",
    formName: "ratingScaleOption",
    allowDelete: true,
    createTitle: "Create Rating Scale Option",
    sections: ["General", "Relations"],
    editTitle: "Edit Rating Scale Option",
  } as SchemaMeta);
