import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { id, dateTime } from "./common-schemas";
import { organizationSchemaNoParent } from "./org-node-without-parent";

export const organizationSchema = z
  .object({
    id,
    typeField: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Type",
        placeholder: "Select organization type",
        description: "Type of organization unit.",
        validationErrorMessage: "Type is required.",
        section: "General",
        required: false,
        autoComplete: {
          options: [
            "Company",
            "SisterCompany",
            "SubCompany",
            "BusinessUnit",
            "SubUnit",
            "Branch",
            "Department",
            "Division",
            "Team",
            "Custom",
          ],
          getOptionsLabel: (opt) => opt,
          getOptionsValue: (opt) => opt,
        },
      },
      tableRelated: {
        header: "Type",
        accessorKey: "typeField",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Code",
        placeholder: "Enter organization code",
        description: "Internal code for the organization.",
        validationErrorMessage: "Code is required.",
        section: "General",
        required: false,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),

    currencyCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Currency Code",
          placeholder: "Enter currency code",
          description: "Currency used by the organization.",
          validationErrorMessage: "Currency code is required.",
          section: "General",
          required: false,
        },
        tableRelated: {
          header: "Currency Code",
          accessorKey: "currencyCode",
        },
      } as FieldLevelMeta),

    groupCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Group Code",
          placeholder: "Enter group code",
          description: "Group code the organization belongs to.",
          validationErrorMessage: "Group code is required.",
          section: "General",
          required: false,
        },
        tableRelated: {
          header: "Group Code",
          accessorKey: "groupCode",
        },
      } as FieldLevelMeta),

    isActive: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Active",
          description: "Whether the organization is active.",
          validationErrorMessage: "Active status is required.",
          section: "General",
        },
        tableRelated: {
          header: "Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),

    isLegalEntity: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Legal Entity",
          description: "Whether the organization is a legal entity.",
          validationErrorMessage: "Legal entity status is required.",
          section: "General",
        },
        tableRelated: {
          header: "Legal Entity",
          accessorKey: "isLegalEntity",
        },
      } as FieldLevelMeta),

    legalEntityCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Legal Entity Code",
          placeholder: "Enter legal entity code",
          description: "Code for the associated legal entity.",
          validationErrorMessage: "Legal entity code is required.",
          section: "General",
          required: false,
        },
        tableRelated: {
          header: "Legal Entity Code",
          accessorKey: "legalEntityCode",
        },
      } as FieldLevelMeta),

    level: z.number().meta({
      formRelated: {
        inputType: "number-field",
        label: "Level",
        placeholder: "Enter organization level",
        description: "Hierarchy level of the organization.",
        validationErrorMessage: "Level is required.",
        section: "General",
        required: false,
      },
      tableRelated: {
        header: "Level",
        accessorKey: "level",
      },
    } as FieldLevelMeta),

    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter organization name",
        description: "Name of the organization.",
        validationErrorMessage: "Name is required.",
        section: "General",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),

    parentNode: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Parent Node",
              placeholder: "Enter parent node ID",
              description: "Parent node the organization belongs to.",
              validationErrorMessage: "Parent node is required.",
              section: "General",
              autoComplete: {
                multiple: false,
                async: true,
                allowCreateNew: true,
                createSchema: organizationSchemaNoParent,
                getEndpoint:
                  "https://core.api.techbee.et/api/organizationNodes",
                getOptionsLabel: (opt) => opt.name + " " + opt.code,
                getOptionsValue: (opt) => opt.id,
              },
            },
            tableRelated: {
              header: "Parent Node",
              accessorKey: "parentNode.id",
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
          header: "Parent Node",
          accessorKey: "parentNode.id",
        },
      } as FieldLevelMeta),

    regionCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Region Code",
          placeholder: "Enter region code",
          description: "Region code of the organization.",
          validationErrorMessage: "Region code is required.",
          section: "General",
          required: false,
        },
        tableRelated: {
          header: "Region Code",
          accessorKey: "regionCode",
        },
      } as FieldLevelMeta),

    tags: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Tags",
          placeholder: "Enter tags",
          description: "Tags related to the organization.",
          validationErrorMessage: "Tags are required.",
          section: "General",
          required: false,
        },
        tableRelated: {
          header: "Tags",
          accessorKey: "tags",
        },
      } as FieldLevelMeta),

    taxIdentificationNo: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Tax Identification No",
          placeholder: "Enter tax identification number",
          description: "Tax ID number for the organization.",
          validationErrorMessage: "Tax Identification Number is required.",
          section: "General",
          required: false,
        },
        tableRelated: {
          header: "Tax Identification No",
          accessorKey: "taxIdentificationNo",
        },
      } as FieldLevelMeta),

    tenantCode: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Tenant code",
        placeholder: "Enter tenant ID",
        description: "Unique tenant identifier.",
        validationErrorMessage: "Tenant code is required.",
        section: "no-section",
        required: true,
      },
      tableRelated: {
        header: "Tenant code",
        accessorKey: "tenantCode",
      },
    } as FieldLevelMeta),
    parentLegalEntityCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "parent LegalEntity  code",
          placeholder: "Enter LegalEntity code",
          description: "Unique LegalEntity code.",
          validationErrorMessage: "LegalEntity code is required.",
          section: "no-section",
          required: true,
        },
        tableRelated: {
          header: "Parent LegalEntity code",
          accessorKey: "parentLegalEntityCode",
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Organizations",
    apiEndPoint: "https://core.api.techbee.et/api/organizationNodes",

    formName: "organization",
    sections: ["General"],
    createTitle: "Create Organization",
    editTitle: "Edit Organization",
  } as SchemaMeta);

export type OrganizationSchema = z.infer<typeof organizationSchema>;
