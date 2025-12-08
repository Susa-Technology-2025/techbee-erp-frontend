// next-version employee schema: only firstName is required, all other fields are optional (strings: .optional().or(z.literal('')))
import { z } from "zod";

export const employeeNVSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "First Name is required."),
  lastName: z.string().optional().or(z.literal("")),
  employeeCode: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  grandFatherName: z.string().optional().or(z.literal("")),
  position: z.object({ id: z.string().optional() }).nullable().optional(),
  hireDate: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  userId: z.string().optional().or(z.literal("")),
  probationEndDate: z.string().optional().or(z.literal("")),
  shift: z.object({ id: z.string().optional() }).nullable().optional(),
  isApprover: z.boolean().optional(),
  isHr: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tinNumber: z.string().optional().or(z.literal("")),
  nationalId: z.string().optional().or(z.literal("")),
  pensionId: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  companyExperience: z.number().optional(),
  dateOfBirth: z.string().optional().or(z.literal("")),
  employmentTerm: z
    .enum(["Permanent", "Contract", "Temporary", "Internship"])
    .optional(),
  fileNumber: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female"]).optional(),
  grade: z.string().optional().or(z.literal("")),
  manager: z.object({ id: z.string().optional() }).nullable().optional(),
  maritalStatus: z
    .enum(["Single", "Married", "Divorced", "Widowed"])
    .optional(),
  organizationNodeId: z.string().optional().or(z.literal("")),
  plateNumber: z.string().optional().or(z.literal("")),
  poessaNumber: z.string().optional().or(z.literal("")),
  previousExperience: z.number().optional(),
  psssaNumber: z.string().optional().or(z.literal("")),
  qualification: z.string().optional().or(z.literal("")),
  remark: z.string().optional().or(z.literal("")),
  retirementStatus: z.enum(["Active", "Retired"]).optional(),
  terminationDate: z.string().optional().or(z.literal("")),
  workPlace: z.string().optional().or(z.literal("")),
});

export type EmployeeNV = z.infer<typeof employeeNVSchema>;
