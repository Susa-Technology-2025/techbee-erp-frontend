import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";

export const dependentSchema = z
  .object({
    id,
    dateOfBirth: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Date of Birth",
          placeholder: "Select date of birth",
          description: "The dependent's date of birth.",
          validationErrorMessage: "Date of birth is required.",
          section: "Personal Information",
          required: true,
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Date of Birth",
          accessorKey: "dateOfBirth",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),

    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "Employee",
            placeholder: "Select employee",
            description: "The employee associated with this dependent.",
            validationErrorMessage: "Employee is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/employees",
              getOptionsLabel: (value) =>
                value.firstName + " " + value.fatherName,
              getOptionsValue: (value) => value.id,
              allowCreateNew: false,
            },
          },
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Employee",
          accessorKey: "employee.firstName",
        },
      } as FieldLevelMeta),

    fatherName: z.string().meta({
      formRelated: {
        section: "Personal Information",
        inputType: "text-field",
        label: "Father's Name",
        placeholder: "Enter father's name",
        description: "The dependent's father's name.",
        validationErrorMessage: "Father's name is required.",
        required: true,
      },
      tableRelated: {
        header: "Father's Name",
        accessorKey: "fatherName",
      },
    } as FieldLevelMeta),

    firstName: z.string().meta({
      formRelated: {
        section: "Personal Information",
        inputType: "text-field",
        label: "First Name",
        placeholder: "Enter first name",
        description: "The dependent's first name.",
        validationErrorMessage: "First name is required.",
        required: true,
      },
      tableRelated: {
        header: "First Name",
        accessorKey: "firstName",
      },
    } as FieldLevelMeta),

    gender: z.string().meta({
      formRelated: {
        section: "Personal Information",
        inputType: "auto-complete",
        label: "Gender",
        placeholder: "Select gender",
        description: "The dependent's gender.",
        validationErrorMessage: "Gender is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
        },
      },
      tableRelated: {
        header: "Gender",
        accessorKey: "gender",
      },
    } as FieldLevelMeta),

    grandFatherName: z.string().meta({
      formRelated: {
        section: "Personal Information",
        inputType: "text-field",
        label: "Grandfather's Name",
        placeholder: "Enter grandfather's name",
        description: "The dependent's grandfather's name.",
        validationErrorMessage: "Grandfather's name is required.",
        required: true,
      },
      tableRelated: {
        header: "Grandfather's Name",
        accessorKey: "grandFatherName",
      },
    } as FieldLevelMeta),

    isEmergencyContact: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Emergency Contact",
          description: "Indicates if this dependent is an emergency contact.",
          required: true,
        },
        tableRelated: {
          header: "Is Emergency Contact",
          accessorKey: "isEmergencyContact",
        },
      } as FieldLevelMeta),
    phoneNumber: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-field",
          label: "Phone Number",
          description: "Phone Number of Dependent.",
          required: true,
        },
        tableRelated: {
          header: "Phone Number",
          accessorKey: "phoneNumber",
        },
      } as FieldLevelMeta),

    relationship: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Relationship",
        placeholder: "Select relationship",
        description: "The dependent's relationship to the employee.",
        validationErrorMessage: "Relationship is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { value: "Spouse", label: "Spouse" },
            { value: "Child", label: "Child" },
            { value: "Parent", label: "Parent" },
            { value: "Sibling", label: "Sibling" },
            { value: "Other", label: "Other" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
        },
      },
      tableRelated: {
        header: "Relationship",
        accessorKey: "relationship",
      },
    } as FieldLevelMeta),

    remark: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Remark",
        placeholder: "Enter remark",
        description: "Any additional remarks about the dependent.",
        validationErrorMessage: "Remark is required.",
        required: true,
      },
      tableRelated: {
        header: "Remark",
        accessorKey: "remark",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Dependents",
    apiEndPoint: "https://api.techbee.et/api/hr/dependents",
    formName: "dependent",
    allowDelete: true,
    createTitle: "Create Dependent",
    sections: ["Personal Information", "General"],
    editTitle: "Edit Dependent",
  } as SchemaMeta);
