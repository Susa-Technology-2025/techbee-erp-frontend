import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "../types";
import { dateTime, id } from "../common-schemas";

export const userSchema = z
  .object({
    id,

    // Account Details
    username: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Username",
        placeholder: "Enter username",
        description: "The unique username for the user.",
        validationErrorMessage: "Username is required.",
        section: "Account Details",
        required: true,
      },
      tableRelated: {
        header: "Username",
        accessorKey: "username",
      },
    } as FieldLevelMeta),

    password: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "password-field",
          label: "Password",
          placeholder: "Enter password",
          description: "The user's password. Must be at least 8 characters.",
          validationErrorMessage: "Password must be at least 8 characters.",
          section: "Account Details",
          required: true,
        },
        tableRelated: {
          header: "Password",
          accessorKey: "password",
        },
      } as FieldLevelMeta),

    typeField: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "User Type",
        description: "The user's role or type within the system.",
        validationErrorMessage: "User type is required.",
        section: "Account Details",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            "Employee",
            "Contractor",
            "Vendor",
            "Customer",
            "Support",
            "Admin",
          ],
          allowCreateNew: false,
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "User Type",
        accessorKey: "typeField",
      },
    } as FieldLevelMeta),

    // Personal Information
    firstName: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "First Name",
        placeholder: "Enter first name",
        description: "The user's first name.",
        validationErrorMessage: "First name is required.",
        section: "Personal Information",
        required: true,
      },
      tableRelated: {
        header: "First Name",
        accessorKey: "firstName",
      },
    } as FieldLevelMeta),

    lastName: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Last Name",
          placeholder: "Enter last name",
          description: "The user's last name.",
          validationErrorMessage: "Last name is required.",
          section: "Personal Information",
          required: true,
        },
        tableRelated: {
          header: "Last Name",
          accessorKey: "lastName",
        },
      } as FieldLevelMeta),

    // Contact Information
    email: z.email().meta({
      formRelated: {
        inputType: "text-field",
        label: "Email",
        placeholder: "Enter user's email",
        description: "The user's email address.",
        validationErrorMessage: "A valid email is required.",
        section: "Personal Information",
        required: true,
      },
      tableRelated: {
        header: "Email",
        accessorKey: "email",
      },
    } as FieldLevelMeta),

    phoneNumber: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Phone Number",
        placeholder: "Enter phone number",
        description: "The user's contact phone number.",
        validationErrorMessage: "Phone number is required.",
        section: "Contact Information",
        required: true,
      },
      tableRelated: {
        header: "Phone Number",
        accessorKey: "phoneNumber",
      },
    } as FieldLevelMeta),

    // System/Tenant Information (Moved to be before status flags)
    tenantId: z
      .string()
      .default("tenant-id")
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Tenant ID",
          placeholder: "Enter tenant ID",
          description: "The unique ID for the user's organization.",
          validationErrorMessage: "Tenant ID is required.",
          section: "no-section",
          required: true,
        },
        tableRelated: {
          header: "Tenant ID",
          accessorKey: "tenantId",
        },
      } as FieldLevelMeta),

    tenantCode: z
      .string()
      .default("tenant-code")
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Tenant Code",
          placeholder: "Enter tenant code",
          description: "The unique code for the user's organization.",
          validationErrorMessage: "Tenant code is required.",
          section: "no-section",
          required: true,
        },
        tableRelated: {
          header: "Tenant Code",
          accessorKey: "tenantCode",
        },
      } as FieldLevelMeta),

    // Status Flags
    isActive: z
      .boolean()
      .default(true)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Active",
          description: "Indicates if the user account is active.",
          section: "Status Flags",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    isVerified: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Verified",
          description: "Indicates if the user account has been verified.",
          section: "Status Flags",
        },
        tableRelated: {
          header: "Verified",
          accessorKey: "isVerified",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Users",
    apiEndPoint: "https://auth.api.techbee.et/api/users",
    formName: "user",
    sections: [
      "Personal Information",
      "Contact Information",
      "Account Details",
      "Status Flags",
    ],
    createTitle: "Create User",
    editTitle: "Edit User",
  } as SchemaMeta);

export type UserSchema = z.infer<typeof userSchema>;
