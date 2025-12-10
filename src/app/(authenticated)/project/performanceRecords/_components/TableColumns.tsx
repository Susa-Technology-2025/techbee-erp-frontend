import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "resourceName", header: "Resource Name" },
  { accessorKey: "taskName", header: "Task Name" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "plannedCompletionDate", header: "Planned Completion Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "actualCompletionDate", header: "Actual Completion Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "plannedCost", header: "Planned Cost" },
  { accessorKey: "actualCost", header: "Actual Cost" },
  { accessorKey: "plannedHours", header: "Planned Hours" },
  { accessorKey: "actualHours", header: "Actual Hours" },
  { accessorKey: "costVariance", header: "Cost Variance" },
  { accessorKey: "scheduleVariance", header: "Schedule Variance" },
  { accessorKey: "efficiencyPct", header: "Efficiency Pct" },
  { accessorKey: "qualityRating", header: "Quality Rating" },
  { accessorKey: "clientSatisfaction", header: "Client Satisfaction" },
  { accessorKey: "riskScore", header: "Risk Score" },
  { accessorKey: "comments", header: "Comments" },
  { accessorKey: "wbsItem.id", header: "Wbs Item Id" }
];