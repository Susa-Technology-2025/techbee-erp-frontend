import z from "zod";

export const questionSchema = z
  .object({
    id: z.string().optional(),
    section: z.string().default("ungrouped"),
    question: z.string().min(1, "Question is required"),
    required: z.boolean().optional().nullable().default(false),
    answerType: z.enum([
      "text",
      "number",
      "date",
      "time",
      "date-time",
      "multiple-choice",
      "true-false",
      "file",
    ]),

    multipleChoices: z.array(z.string()).optional().nullable(),
    allowMultipleChoice: z.boolean().optional().nullable().default(false),

    min: z.number().optional().nullable(),
    max: z.number().optional().nullable(),
    answeDependentOn: z.string().optional(),
    answerDependentValue: z.string().optional(),
    defaultAnswer: z
      .union([
        z.string(),
        z.number(),
        z.file(),
        z.boolean(),
        z.date(),
        z.null(),
      ])
      .optional(),
    answerValidationMessage: z.string().optional(),
    fileTypes: z.array(z.string()).optional(),
    conditions: z
      .array(
        z.object({
          action: z.enum([
            "show",
            "hide",
            "enable",
            "disable",
            "require",
            "jumpTo",
          ]),
          questionId: z.string(),
          operator: z.enum([
            "equals",
            "notEquals",
            "contains",
            "greaterThan",
            "lessThan",
            "isEmpty",
            "isNotEmpty",
          ]),
          value: z.any().optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.answerType === "multiple-choice" && data.allowMultipleChoice) {
        return (
          data.multipleChoices !== null &&
          data.multipleChoices !== undefined &&
          data.multipleChoices.length > 0
        );
      }
      return true;
    },
    {
      message: "Multiple choices are required for multiple-choice questions.",
      path: ["multipleChoices"],
    }
  );
