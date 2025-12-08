import { z } from "zod";

export const TestSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z
    .number()
    .min(13, { message: "You must be at least 13 years old" })
    .max(120),
  newsletterSubscribed: z.boolean(),
  lastLogin: z.date().optional(),
  membershipLevel: z.enum(["Free", "Basic", "Premium", "VIP"]),
  tags: z.array(z.string()).optional(),
  address: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z
        .string()
        .length(2, { message: "State code must be 2 characters" }),
      zipCode: z
        .string()
        .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid zip code" }),
    })
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Invalid phone number" })
    .optional(),
  isActive: z.boolean().default(true),
  roles: z.array(z.enum(["user", "admin", "moderator"])).default(["user"]),
  profilePictureUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type TestType = z.infer<typeof TestSchema>;
