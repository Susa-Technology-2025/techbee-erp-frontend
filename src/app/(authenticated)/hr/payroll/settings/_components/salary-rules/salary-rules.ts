import { z } from "zod";

// Regex for YYYY-MM-DDTHH:mm format
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

// ✅ Allowed variables dictionary (you can fetch from DB or pass dynamically)
const allowedVariables = [
  "employee_id",
  "contract_id",
  "baseSalary",
  "employee_grade",
  "employee_level",
  "employee_positionId",
  "employee_departmentId",
  "employee_previousExperience",
  "employee_employmentTerm",
  "employee_maritalStatus",
  "employee_retirementStatus",
  "employee_gender",
  "employee_language",
  "employee_workPlace",
  "employee_isApprover",
  "employee_isHr",
  "employee_isManager",
  "contract_terms",
  "contract_salaryStructureId",
  "workEntry_Regular",
  "workEntry_Overtime",
  "input_bonus",
  "input_overtime",
  "input_commission",
  "unpaid_leave_days",
  "loan_repayment_amount",
  "tax_rate",
  "tax_deduction",
  "pension_employee",
  "pension_employer",
];
// ✅ Formula validation function
const validateFormula = (formula: string): boolean => {
  if (!formula || formula.trim() === "") return true; // Allow empty if not using formula

  // Split into tokens (variables, numbers, operators)
  const tokens = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*|\d+|[+\-*/%()]/g);

  if (!tokens) return false;

  for (const token of tokens) {
    // Check variables only
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
      if (!allowedVariables.includes(token)) {
        return false;
      }
    }
  }
  return true;
};

export const salaryRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  code: z.string().min(1, "Code is required."),
  category: z.object({ id: z.string().min(1, "Category is required.") }),
  calculationType: z.enum(
    ["Fixed", "Formula", "PercentageOfCategory", "SplitEqually"],
    {
      errorMap: () => ({
        message:
          "Calculation Type is required and must be one of Fixed, Formula, PercentageOfCategory, or SplitEqually.",
      }),
    },
  ),
  fixedAmount: z.number().optional().or(z.literal(0)),

  // ✅ Formula validation added here
  formula: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => validateFormula(val || ""), {
      message: `Formula contains invalid variables. Allowed: ${allowedVariables.join(", ")}`,
    }),

  percentageOfCategory: z.object({ id: z.string() }).optional(),

  // Add missing properties that the component expects
  amount: z.number().optional().or(z.literal(0)),
  percentage: z.number().optional().or(z.literal(0)),
  organizationNode: z.object({ id: z.string().optional() }).optional(),
  priority: z.number().optional().or(z.literal(0)),
  sequence: z.number().int().optional(),
  isActive: z.boolean().default(true).optional(),
  externalCode: z.string().optional().or(z.literal("")),
  organizationNodeId: z.string().optional().or(z.literal("")),
  conditionExpression: z.string().nullable().optional(),
  activeFrom: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "Active From Date must be in YYYY-MM-DDTHH:mm format.",
    }),
  isDeduction: z.boolean().default(false).optional(),
  activeTo: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dateTimeRegex.test(val), {
      message: "Active To Date must be in YYYY-MM-DDTHH:mm format.",
    }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

// Separate validation function for conditional validation
export const validateSalaryRule = (data: any) => {
  const result = salaryRuleSchema.safeParse(data);
  if (!result.success) {
    // Enhance error messages to be more specific
    const enhancedIssues = result.error.issues.map((issue) => {
      let message = issue.message;

      if (issue.path.includes("name") && message.includes("required")) {
        message = "Name is required. Please enter a name for the salary rule.";
      } else if (issue.path.includes("code") && message.includes("required")) {
        message =
          "Code is required. Please enter a unique code for the salary rule.";
      } else if (
        issue.path.includes("category") &&
        message.includes("required")
      ) {
        message =
          "Category is required. Please select a category for the salary rule.";
      } else if (
        issue.path.includes("calculationType") &&
        message.includes("required")
      ) {
        message =
          "Calculation Type is required. Please select a calculation type.";
      } else if (issue.path.includes("formula")) {
        message = issue.message; // already contains allowed vars info
      }

      return {
        ...issue,
        message,
      };
    });

    return {
      success: false,
      error: {
        issues: enhancedIssues,
      },
    };
  }

  // Conditional validation for percentageOfCategory
  if (data.calculationType === "PercentageOfCategory") {
    if (
      !data.percentageOfCategory ||
      !data.percentageOfCategory.id ||
      data.percentageOfCategory.id.trim() === ""
    ) {
      return {
        success: false,
        error: {
          issues: [
            {
              code: "custom",
              message:
                "Percentage of Category ID is required when Calculation Type is PercentageOfCategory.",
              path: ["percentageOfCategory", "id"],
            },
          ],
        },
      };
    }
  }

  return result;
};

export type SalaryRule = z.infer<typeof salaryRuleSchema>;
