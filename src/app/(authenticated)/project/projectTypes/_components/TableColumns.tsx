import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "active", header: "Active",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "approvalRequired", header: "Approval Required",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" }
];