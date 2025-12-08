import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";

export const PermissionSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter permission name",
        description: "The unique name of the permission.",
        validationErrorMessage: "Permission name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "code",
        placeholder: "Enter permission code",
        description: "The unique code of the permission.",
        validationErrorMessage: "Permission code is required.",
        required: true,
      },
      tableRelated: {
        header: "code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    method: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "method",
        placeholder: "Enter endpoint method",
        description: "The  method of the endpoint.",
        validationErrorMessage: "endpoint method is required.",
        required: true,
      },
      tableRelated: {
        header: "method",
        accessorKey: "method",
      },
    } as FieldLevelMeta),
    endpoint: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "endpoint",
        placeholder: "Enter permission endpoint",
        description: "The unique endpoint of the permission.",
        validationErrorMessage: "Permission endpoint is required.",
        required: true,
      },
      tableRelated: {
        header: "endpoint",
        accessorKey: "endpoint",
      },
    } as FieldLevelMeta),
    hub: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "hub",
        placeholder: "Enter permission hub",
        description: "The  hub of the permission.",
        validationErrorMessage: "Permission hub is required.",
        required: true,
      },
      tableRelated: {
        header: "hub",
        accessorKey: "hub",
      },
    } as FieldLevelMeta),
    module: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "module",
        placeholder: "Enter permission module",
        description: "The  module of the permission.",
        validationErrorMessage: "Permission module is required.",
        required: true,
      },
      tableRelated: {
        header: "module",
        accessorKey: "module",
      },
    } as FieldLevelMeta),
    entity: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "entity",
        placeholder: "Enter permission entity",
        description: "The entity of the permission.",
        validationErrorMessage: "Permission entity is required.",
        required: true,
      },
      tableRelated: {
        header: "entity",
        accessorKey: "entity",
      },
    } as FieldLevelMeta),
    action: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "action",
        placeholder: "Enter permission action",
        description: "The action of the permission.",
        validationErrorMessage: "Permission action is required.",
        required: true,
      },
      tableRelated: {
        header: "action",
        accessorKey: "action",
      },
    } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Active",
          description: "Status of the permission.",
          section: "General",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
        },
      } as FieldLevelMeta),
    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "text-area",
          label: "Description",
          placeholder: "Enter a description",
          description: "A brief description of the permission.",
          validationErrorMessage: "Description is required.",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Permissions",
    apiEndPoint: "https://auth.api.techbee.et/api/permissions",
    formName: "permissionForm",
    allowDelete: true,
    createTitle: "Create Permission",
    sections: ["General"],
    editTitle: "Edit Permission",
  } as SchemaMeta);
