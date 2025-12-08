import z from "zod";
import { type FieldLevelMeta } from "./types";
import { Chip, Tooltip } from "@mui/material";
import { format, formatDistance } from "date-fns";

const dateTimeChip = (date?: Date | string) => {
  if (!date) return <Chip label="-" size="small" />;

  const d = date instanceof Date ? date : new Date(date);
  const formatted = formatDistance(d, new Date(), {
    addSuffix: true,
    includeSeconds: true,
  });

  return (
    <Tooltip title={format(d, "PPpp")} arrow>
      <Chip
        label={formatted}
        onClick={() => null}
        size="small"
        sx={{
          bgcolor: "backgroundSection.main",
          color: "backgroundSection.contrastText",
        }}
      />
    </Tooltip>
  );
};

export const dateTime = {
  createdAt: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string") return new Date(val);
      return val;
    })
    .meta({
      formRelated: {
        inputType: "date-time",
        label: "Created At",
        description: "when created.",
        disabled: true,
        section: "no-section",
        hidden: true,
      },
      tableRelated: {
        header: "Created At",
        accessorKey: "createdAt",
        Cell: ({ cell }: any) => dateTimeChip(cell.getValue()),
      },
    } as FieldLevelMeta),

  updatedAt: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string") return new Date(val);
      return val;
    })
    .meta({
      formRelated: {
        inputType: "date-time",
        label: "Updated At",
        description: "when last updated.",
        section: "no-section",
        hidden: true,
        disabled: true,
      },
      tableRelated: {
        header: "Updated At",
        accessorKey: "updatedAt",
        Cell: ({ cell }: any) => dateTimeChip(cell.getValue()),
      },
    } as FieldLevelMeta),
};

export const id = z
  .string()
  .optional()
  .meta({
    formRelated: {
      inputType: "text-field",
      label: "ID",
      description: "Unique identifier for the field.",
      validationErrorMessage: "ID is required.",
      section: "no-section",
      disabled: true,
      hidden: true,
    },
    tableRelated: {
      header: "ID",
      accessorKey: "id",
    },
  } as FieldLevelMeta);
