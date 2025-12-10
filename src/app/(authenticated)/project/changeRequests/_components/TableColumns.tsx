import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "changeType", header: "Change Type" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "reason", header: "Reason" },
  { accessorKey: "billingAmount", header: "Billing Amount" },
  { accessorKey: "impactCost", header: "Impact Cost" },
  { accessorKey: "impactTimeDays", header: "Impact Time Days" },
  { accessorKey: "requestedByName", header: "Requested By Name" }
];