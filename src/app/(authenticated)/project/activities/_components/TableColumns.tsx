import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "summary", header: "Summary" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "percentComplete", header: "Percent Complete" },
  { accessorKey: "actualCost", header: "Actual Cost" },
  { accessorKey: "dueDate", header: "Due Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "assigneeEmployeeId", header: "Assignee Employee Id" },
  { accessorKey: "attachmentUrl", header: "Attachment Url" },
  { accessorKey: "wbsItem.id", header: "WBS Item" },
  { accessorKey: "schedulingType.id", header: "Scheduling Type" }
];