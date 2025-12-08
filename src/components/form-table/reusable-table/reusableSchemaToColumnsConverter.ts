import type { MRT_ColumnDef } from 'material-react-table';

export function reusableSchemaToColumnsConverter(schema: any): MRT_ColumnDef<any>[] {
  return schema.map((col: any) => ({
    accessorKey: col.accessorKey,
    header: col.header,
  }));
}