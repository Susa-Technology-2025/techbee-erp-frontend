import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { userSchema } from "./users";
import { organizationSchema } from "../organization-node";
import { roleSchema } from "./roles";

export const UserRoleSchema = z
  .object({
    id,
    user: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "General",
            label: "User",
            placeholder: "Select user",
            description: "The user to whom the roles will be assigned.",
            validationErrorMessage: "User is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://auth.api.techbee.et/api/users",
              getOptionsLabel: (value) => value.username,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
              createSchema: userSchema,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "User",
          accessorKey: "user.username",
        },
      } as FieldLevelMeta),
    orgNodeId: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Organization Node",
        placeholder: "Select organization node",
        description: "The organizational node the role applies to.",
        validationErrorMessage: "Organization node is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: organizationSchema,
        },
      },
      tableRelated: {
        header: "Organization Node",
        accessorKey: "orgNodeId",
      },
    } as FieldLevelMeta),
    roleIds: z.array(z.string()).meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "Roles",
        placeholder: "Select roles",
        description: "The roles assigned to the user.",
        validationErrorMessage: "At least one role is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          getEndpoint:
            "https://auth.api.techbee.et/api/roles?where[isActive]=true",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: roleSchema,
        },
      },
      tableRelated: {
        header: "Roles",
        accessorKey: "roles",
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "User Roles",
    apiEndPoint: "https://auth.api.techbee.et/api/userRoles",
    formName: "userRole",
    allowDelete: true,
    createTitle: "Create User Role",
    sections: ["General"],
    editTitle: "Edit User Role",
  } as SchemaMeta);
