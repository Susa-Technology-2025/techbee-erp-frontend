import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "sequence", header: "Sequence" },
  { accessorKey: "active", header: "Active",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "triggersNotification", header: "Triggers Notification",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "notes", header: "Notes" }
];