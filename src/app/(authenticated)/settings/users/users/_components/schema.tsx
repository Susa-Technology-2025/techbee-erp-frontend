import {z} from "zod"
export const UserCreateFormSchema = z.object({
  id: z.string().optional().nullable(),
  username: z.string({ error: "Username is required" }),
  email: z.string().optional().nullable(),
  password: z.string({ error: "Password is required" }),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  tenantCode: z.string({ error: "Tenant code is required" }),
  typeField: z.enum(
    ["Employee", "Contractor", "Vendor", "Customer", "Support", "Admin"],
    { error: "User type is required" }
  ),
  signupSource: z
    .enum(["Internal", "SelfSignup", "Sso", "Import"])
    .optional()
    .nullable(),
  isActive: z.boolean({ error: "Is active status is required" }).default(true),
  isVerified: z
    .boolean({ error: "Is verified status is required" })
    .default(false),
  mustResetPassword: z.boolean().optional().nullable().default(false),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  userRoles: z
    .array(
      z
        .object({
          id: z.string().optional().nullable(),
          name: z.string().optional().nullable(),
        })
        .transform((val) => ({
          roleId: val?.id ?? null,
        }))
    )
    .transform((items) => ({
      createMany: {
        data: items
          .filter((i) => i.roleId) // strip nulls
          .map((i) => ({ roleId: i.roleId })),
        skipDuplicates: true,
      },
    }))
    .optional()
    .nullable()
    .meta({ url: "/userRoles" })
});