import { z } from "zod";
const id = z.string().optional().nullable();

export const LandingPageSchema = z.object({
  code: z.string(),
  description: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  isPublished: z.boolean(),
  logo: z.string().optional().nullable(),
  name: z.string(),
  priority: z.number(),
  id,
});

export type LandingPageData = z.infer<typeof LandingPageSchema>;
