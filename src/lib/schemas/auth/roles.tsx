import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { PermissionSchema } from "./permissions";
import { Chip, Stack } from "@mui/material";

export const roleSchema = z
  .object({
    id,
    description: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-area",
        label: "Description",
        placeholder: "Enter description",
        validationErrorMessage: "Description is required.",
      },
      tableRelated: {
        header: "Description",
        accessorKey: "description",
      },
    } as FieldLevelMeta),
    isActive: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "boolean-field",
          label: "Is Active",
          description: "Indicates if the role is active.",
        },
        tableRelated: {
          header: "Is Active",
          accessorKey: "isActive",
          Cell: ({ cell }) =>
            cell.getValue() ? (
              <Chip label="Active" color="success" size="small" />
            ) : (
              <Chip label="Inactive" color="default" size="small" />
            ),
        },
      } as FieldLevelMeta),
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Name",
        placeholder: "Enter role name",
        validationErrorMessage: "Role name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    permissionIds: z.array(z.string()).meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Permissions",
        placeholder: "Select permissions",
        description: "Permissions associated with this role.",
        validationErrorMessage: "At least one permission is required.",
        required: true,
        autoComplete: {
          multiple: true,
          async: true,
          getEndpoint: "https://auth.api.techbee.et/api/permissions",
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
          // allowCreateNew: true,
          createSchema: PermissionSchema,
        },
      },
      tableRelated: {
        header: "Permissions",
        accessorKey: "permissionIds",
        Cell: ({ row }) => {
          const permissions = row.original.permissions || [];
          return (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ gap: 0.5 }}
            >
              {permissions.map((perm: any) => (
                <Chip
                  key={perm.id}
                  label={perm.name}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          );
        },
      },
    } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Roles",
    apiEndPoint: "https://auth.api.techbee.et/api/roles",
    formName: "role",
    allowDelete: true,
    createTitle: "Create New Role",
    sections: ["General"],
    editTitle: "Edit Role",
  } as SchemaMeta);
