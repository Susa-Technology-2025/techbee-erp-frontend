import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "body", header: "Body" },
  { accessorKey: "isInternal", header: "Is Internal",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "authorUserId", header: "Author Employee Id" },
  { accessorKey: "milestone.title", header: "Milestone" },
  { accessorKey: "parentComment.body", header: "Parent Comment" },
  { accessorKey: "wbsItem.title", header: "Wbs Item" },
  { accessorKey: "replies.body", header: "Replies" }
];