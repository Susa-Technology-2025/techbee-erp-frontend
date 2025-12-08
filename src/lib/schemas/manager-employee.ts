import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";

export const minimalEmployeeSchema = z
  .object({
    id,

    // Personal Information
    firstName: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "First Name",
        placeholder: "Enter first name",
        description: "The employee's legal first name.",
        validationErrorMessage: "First name is required.",
        section: "Personal Information",
        required: true,
      },
      tableRelated: {
        header: "First Name",
        accessorKey: "firstName",
      },
    } as FieldLevelMeta),

    lastName: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Last Name",
        placeholder: "Enter last name",
        description: "The employee's legal last name.",
        validationErrorMessage: "Last name is required.",
        section: "Personal Information",
        required: true,
      },
      tableRelated: {
        header: "Last Name",
        accessorKey: "lastName",
      },
    } as FieldLevelMeta),

    // Employment Details
    employeeCode: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Employee Code",
        placeholder: "Enter employee code",
        description: "The employee's unique company code.",
        validationErrorMessage: "Employee code is required.",
        section: "Employment Details",
        required: true,
      },
      tableRelated: {
        header: "Employee Code",
        accessorKey: "employeeCode",
      },
    } as FieldLevelMeta),

    status: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Status",
        description: "The employee's current employment status.",
        validationErrorMessage: "Status is required.",
        section: "Employment Details",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { label: "Onboarding", value: "Onboarding" },
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
            { label: "Terminated", value: "Terminated" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value: any) => value.label,
          getOptionsValue: (value: any) => value.value,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),

    // Boolean Flags
    isHr: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is HR",
          description: "Indicates if the employee has HR privileges.",
          section: "Boolean Flags",
        },
        tableRelated: {
          header: "HR",
          accessorKey: "isHr",
        },
      } as FieldLevelMeta),

    isManager: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Manager",
          description: "Indicates if the employee is a manager.",
          section: "Boolean Flags",
        },
        tableRelated: {
          header: "Manager",
          accessorKey: "isManager",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Employees",
    apiEndPoint: "https://api.techbee.et/api/hr/employees",
    formName: "minimal-employee",
    sections: ["Personal Information", "Employment Details", "Boolean Flags"],
    createTitle: "Create Employee",
    editTitle: "Edit Employee",
  } as SchemaMeta);

export type MinimalEmployeeSchema = z.infer<typeof minimalEmployeeSchema>;
