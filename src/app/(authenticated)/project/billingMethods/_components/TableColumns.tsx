import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "method", header: "Method" },
  { accessorKey: "active", header: "Active",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "projectTypesDefaultFor", header: "Project Types Default For" }
];