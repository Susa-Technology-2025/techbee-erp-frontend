import { z } from "zod";

const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const localDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const employeeBankAccountSchema = z.object({
  id: z.string().optional(),
  accountNumber: z.string().min(1, "Account Number is required."),
  accountType: z.string().min(1, "Account Type is required."),
  bankName: z.string().min(1, "Bank Name is required."),
  swiftCode: z.string().min(1, "SWIFT Code is required."),
  isPrimary: z.boolean().default(false),
  employee: z.object({
    id: z.string().min(1, "Employee is required."),
  }),
  createdAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val || isoDateTimeRegex.test(val) || localDateTimeRegex.test(val),
      {
        message:
          "CreatedAt must be in YYYY-MM-DDTHH:mm:ss.SSSZ or YYYY-MM-DDTHH:mm format.",
      }
    ),
  updatedAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val || isoDateTimeRegex.test(val) || localDateTimeRegex.test(val),
      {
        message:
          "UpdatedAt must be in YYYY-MM-DDTHH:mm:ss.SSSZ or YYYY-MM-DDTHH:mm format.",
      }
    ),
});

export type EmployeeBankAccount = z.infer<typeof employeeBankAccountSchema>;
