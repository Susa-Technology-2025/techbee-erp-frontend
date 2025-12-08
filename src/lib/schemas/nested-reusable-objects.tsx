import z from "zod";
import { minimalEmployeeSchema } from "./manager-employee";
import { FieldLevelMeta } from "./types";
import { positionSchema } from "./position";
import { userSchema } from "./users";
import { organizationSchema } from "./organization-node";
import { ApplicationCreateInput } from "./recruitment/application";
import { interviewSchema } from "./recruitment/interview";

export const employeeId = (section: string) =>
  z
    .object({
      id: z
        .string()
        .optional()
        .nullable()
        .meta({
          formRelated: {
            inputType: "auto-complete",
            label: "Employee",
            placeholder: "Select employee",
            description: "Employees for this target.",
            validationErrorMessage: "employee is required.",
            section,
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              options: undefined,
              allowCreateNew: true,
              createSchema: minimalEmployeeSchema,
              getEndpoint: "https://api.techbee.et/api/hr/employees",
              getOptionsLabel: (value) =>
                value.firstName + " " + value.fatherName,
              getOptionsValue: (value) => value.id,
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
        header: "employee",
        accessorKey: "employee.id",
        Cell: ({ row }: any) => {
          return `${row.original.employee?.firstName} ${row.original.employee?.fatherName}`;
        },
      },
    } as FieldLevelMeta);
export const positionId = (section: string) =>
  z
    .object({
      id: z
        .string()
        .optional()
        .nullable()
        .meta({
          formRelated: {
            inputType: "auto-complete",
            label: "Position",
            placeholder: "Select position",
            description: "The employee's job position.",
            validationErrorMessage: "Position is required.",
            section,
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              options: undefined,
              allowCreateNew: true,
              createSchema: positionSchema,
              getEndpoint: "https://api.techbee.et/api/hr/positions",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
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
        header: "Position",
        accessorKey: "position.title",
      },
    } as FieldLevelMeta);

export const userology = z
  .string()
  .optional()
  .nullable()
  .meta({
    formRelated: {
      inputType: "auto-complete",
      label: "User ID",
      placeholder: "Enter user ID",
      description: "The user ID associated with the employee.",
      validationErrorMessage: "User ID is required.",
      section: "Other Details",
      required: true,
      autoComplete: {
        async: true,
        allowCreateNew: true,
        getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
        getOptionsValue: (opt) => opt.id,
        createSchema: userSchema,
        getEndpoint: "https://api.techbee.et/api/auth/users",
      },
    },
    tableRelated: {
      header: "User ID",
      accessorKey: "userId",
    },
  } as FieldLevelMeta);
export const orgology = (section: string) =>
  z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Organization Node",
        placeholder: "Enter organization node ",
        description: "organization node the entity belongs to.",
        validationErrorMessage: "organization node is required.",
        section,
        autoComplete: {
          multiple: false,
          async: true,
          allowCreateNew: true,
          createSchema: organizationSchema,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (opt) => opt.name,
          getOptionsValue: (opt) => opt.id,
        },
      },
    } as FieldLevelMeta);

export const application = z
  .object({
    id: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Application",
        placeholder: "Select application",
        description: "The application associated with this record.",
        validationErrorMessage: "Application is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/hr/applications",
          getOptionsLabel: (value) =>
            value.candidate?.firstName + " " + value.candidate?.lastName,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: ApplicationCreateInput,
        },
      },
    } as FieldLevelMeta),
  })
  .meta({
    formRelated: {
      inputType: "object",
    },
    tableRelated: {
      header: "Application",
      accessorKey: "application.id",
      Cell: ({ row }) => {
        const candidate = row.original.application.candidate;
        return `${candidate.firstName} ${candidate.lastName}`;
      },
    },
  } as FieldLevelMeta);

export const interview = z
  .object({
    id: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "Interview Information",
        label: "Interview",
        placeholder: "Select interview",
        description: "The interview this feedback is for.",
        validationErrorMessage: "Interview is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/hr/interviews",
          getOptionsLabel: (value) =>
            value.application?.candidate?.firstName +
            " " +
            value.application?.candidate?.lastName,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: interviewSchema,
        },
      },
      tableRelated: {
        header: "Interview",
        accessorKey: "interview.id",
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
      header: "Interview",
      accessorKey: "application.id",
      Cell: ({ row }) => {
        const candidate = row.original.interview.application.candidate;
        return `${candidate.firstName} ${candidate.lastName}`;
      },
    },
  } as FieldLevelMeta);

export const appStatus = z
  .string()
  .optional()
  .default("Draft")
  .meta({
    formRelated: {
      section: "no-section",
      inputType: "auto-complete",
      label: "Approval Status",
      placeholder: "Select approval status",
      description: "The current approval status of the entity.",
      validationErrorMessage: "Approval status is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: false,
        options: [
          "Draft",
          "PendingApproval",
          "Approved",
          "Rejected",
          "InformationRequested",
          "Reassigned",
          "Withdrawn",
          "Cancelled",
          "Delete",
          "Closed",
        ],
        allowCreateNew: false,
        getOptionsLabel: (value: string) => value,
        getOptionsValue: (value: string) => value,
      },
    },
    tableRelated: {
      header: "Approval Status",
      accessorKey: "approvalStatus",
    },
  } as FieldLevelMeta);
export const userId = ({
  required,
  section,
  label,
}: {
  required: boolean;
  section: string;
  label: string;
  tableHeader?: string;
  tableHeaderAccessorKey?: string;
}) =>
  z
    .string()
    .optional()
    .nullable()
    .meta({
      formRelated: {
        inputType: "auto-complete",
        label,
        placeholder: "Enter user",
        description: "The user related with the record",
        validationErrorMessage: "User is required.",
        section,
        required,
        autoComplete: {
          async: true,
          allowCreateNew: true,
          getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
          getOptionsValue: (opt) => opt.id,
          createSchema: userSchema,
          getEndpoint: "https://api.techbee.et/api/auth/users",
        },
      },
      // tableRelated: {
      //   header: "User ID",
      //   accessorKey: "userId",
      // },
    } as FieldLevelMeta);
