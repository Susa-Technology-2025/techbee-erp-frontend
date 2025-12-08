import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "body", header: "Body" },
  { accessorKey: "isInternal", header: "Is Internal",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "authorEmployeeId", header: "Author Employee Id" },
  { accessorKey: "milestone", header: "Milestone" },
  { accessorKey: "parentComment", header: "Parent Comment" },
  { accessorKey: "wbsItem", header: "Wbs Item" },
  { accessorKey: "replies", header: "Replies" }
];