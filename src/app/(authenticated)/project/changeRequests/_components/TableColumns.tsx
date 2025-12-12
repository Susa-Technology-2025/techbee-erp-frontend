import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "changeType", header: "Change Type" },
  { accessorKey: "billingAmount", header: "Billing Amount" },
  { accessorKey: "impactCost", header: "Impact Cost" },
  { accessorKey: "impactTimeDays", header: "Impact Time Days" },
  { accessorKey: "project", header: "Project" },
  { accessorKey: "wbsItem", header: "Wbs Item" },
  { accessorKey: "approvalStatus", header: "Approval Status" }
];