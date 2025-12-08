import { z } from "zod";
import type { FieldLevelMeta } from "@/lib/schemas/types";
import nerdamer from "nerdamer";
import "nerdamer/Solve";

const fetchAndValidateVariables = async (
  expression: string,
  meta: FieldLevelMeta
) => {
  const allowedVariablesEndpoint =
    meta.formRelated.expression?.allowedVariablesEndpoint;
  const getVariables = meta.formRelated.expression?.getVariables;

  if (!allowedVariablesEndpoint) {
    throw new Error("No allowedVariablesEndpoint provided in meta.");
  }

  try {
    const response = await fetch(allowedVariablesEndpoint);
    const data = await response.json();
    const allowedVariables = getVariables ? getVariables(data) : data;

    const tokens = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    for (const token of tokens) {
      if (!allowedVariables.includes(token)) {
        return {
          isValid: false,
          message: `Variable '${token}' is not allowed.`,
        };
      }
    }
    return { isValid: true, message: "" };
  } catch (error) {
    console.error("Failed to fetch allowed variables:", error);
    return {
      isValid: false,
      message: "Failed to validate variables. Please try again.",
    };
  }
};

export const createExpressionSchema = (meta: FieldLevelMeta) =>
  z.string().optional().nullable().meta(meta);

// {
//   .superRefine((val, ctx) => {
//   if (val && val.trim() !== "") {
//     try {
//       nerdamer.solveEquations(val);
//     } catch (err: any) {
//       ctx.addIssue({
//         code: "custom",
//         message: err.message || "Invalid mathematical expression.",
//       });
//     }
//   }
// })
// .refine(async (val) => {
//   if (!val || val.trim() === "") {
//     return false;
//   }
//   const result = await fetchAndValidateVariables(val, meta);
//   if (!result.isValid) {
//     throw new z.ZodError([
//       {
//         code: z.ZodIssueCode.custom,
//         message: result.message,
//         path: ["expression"],
//       },
//     ]);
//   }
//   return true;
// })
// }
