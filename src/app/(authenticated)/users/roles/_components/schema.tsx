import {z} from "zod"
export const RoleCreateInputFormSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string({ error: "Name is required" }),
  isActive: z.boolean().default(true),
  description: z.string().optional().nullable(),
  organizationNodeId: z
    .union([z.string(), z.object({ id: z.string() }).transform((v) => v.id)])
    .transform((v) => (typeof v === "string" ? v : v.id)),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  rolePermissions: z
    .array(
      z
        .object({
          code: z.string().optional().nullable(),
          id: z.string().optional().nullable(),
        })
        .transform((v) => ({ permissionCode: v.code ?? null }))
    )
    .optional()
    .nullable()
    .meta({ url: "/rolePermissions" }),
});