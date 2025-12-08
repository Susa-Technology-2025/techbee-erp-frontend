import { z, ZodRawShape } from "zod";
import { Questions } from "./types";

export const generateSchemaFromQuestions = (questions: Questions) => {
  const dynamicSchema: Record<string, ZodRawShape[string]> = {};
  questions.forEach((q, index) => {
    const fieldId = q.id || `question_${index}`;
    let fieldSchema: z.ZodType<any, any>;

    switch (q.answerType) {
      case "text":
        fieldSchema = q.required
          ? z.string().min(1, {
              message: q.answerValidationMessage || "This field is required",
            })
          : z.string().optional();
        break;
      case "email":
        fieldSchema = q.required
          ? z.email({ message: "Invalid email address" }).min(1, {
              message: q.answerValidationMessage || "This field is required",
            })
          : z.email({ message: "Invalid email address" }).optional();
        break;
      case "number":
        let numberSchema = z.number({
          message: "Must be a number",
        });
        if (q.min !== null && q.min !== undefined) {
          numberSchema = numberSchema.min(q.min, `Must be at least ${q.min}`);
        }
        if (q.max !== null && q.max !== undefined) {
          numberSchema = numberSchema.max(q.max, `Must be at most ${q.max}`);
        }

        if (q.required) {
          numberSchema = numberSchema.refine(
            (val) => val !== null && val !== undefined,
            { message: q.answerValidationMessage || "This field is required" }
          );
        }

        fieldSchema = z.preprocess(
          (val) => (val === "" ? undefined : Number(val) || undefined),
          numberSchema
        );
        break;
      case "multiple-choice":
        if (q.allowMultipleChoice) {
          fieldSchema = q.required
            ? z.array(z.string()).min(1, {
                message:
                  q.answerValidationMessage ||
                  "At least one option is required",
              })
            : z.array(z.string()).optional();
        } else {
          fieldSchema = q.required
            ? z.string().min(1, {
                message: q.answerValidationMessage || "This field is required",
              })
            : z.string().optional();
        }
        break;
      case "true-false":
        fieldSchema = q.required
          ? z.boolean({
              message: q.answerValidationMessage || "This field is required",
            })
          : z.boolean().optional();
        break;
      case "date":
      case "time":
      case "date-time":
        fieldSchema = q.required
          ? z.instanceof(Date, {
              message: q.answerValidationMessage || "This field is required",
            })
          : z.instanceof(Date).nullable().optional();
        break;
      case "file":
        fieldSchema = q.required
          ? z.any().refine((val) => val !== null && val !== undefined, {
              message: q.answerValidationMessage || "A file is required",
            })
          : z.any().optional();
        break;
      default:
        fieldSchema = z.any().optional();
    }
    dynamicSchema[fieldId] = fieldSchema;
  });
  return z.object(dynamicSchema);
};
