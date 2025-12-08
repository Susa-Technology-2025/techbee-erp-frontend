import { z, type ZodType } from "zod";
import type { MRT_ColumnDef } from "material-react-table";
import type { FieldLevelMeta } from "@/lib/schemas/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export function schemaToMRTColumnsFromZod<
  TSchema extends z.ZodObject<any>,
  TData extends z.infer<TSchema> = z.infer<TSchema>
>(schema: TSchema): MRT_ColumnDef<TData>[] {
  return (
    Object.entries(schema.shape) as [keyof TData, z.ZodType<any>][]
  ).flatMap(([key, field]) => {
    const meta =
      field.meta && ((field as ZodType).meta() as FieldLevelMeta | undefined);
    const tableRelated = meta?.tableRelated;

    // 🚨 skip if no tableRelated defined
    if (!tableRelated || Object.keys(tableRelated).length === 0) {
      return [];
    }

    const column: MRT_ColumnDef<TData> = {
      accessorKey: tableRelated.accessorKey ?? (key as string),
      header: tableRelated.header ?? String(key),
      ...tableRelated,
    };

    if (meta?.formRelated?.inputType === "boolean-field" && !column.Cell) {
      column.Cell = ({ cell }) =>
        cell.getValue() ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
    }

    return [column];
  });
}
