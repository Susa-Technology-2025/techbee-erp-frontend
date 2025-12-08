import {z} from "zod"
export const ProjectStageSetFormSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string(),
  code: z.string(),
  active: z.boolean().default(true),
  color: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  stages: z
    .array(
      z.object({
        id: z.string().optional().nullable(),
        name: z.string(),
        code: z.string(),
        sequence: z.number(),
        active: z.boolean().default(true),
        requiresApproval: z.boolean().default(false),
        triggersNotification: z.boolean().default(true),
        color: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable()
    .meta({ asyncArrayDeleteurl: "/projectStages" }),
})