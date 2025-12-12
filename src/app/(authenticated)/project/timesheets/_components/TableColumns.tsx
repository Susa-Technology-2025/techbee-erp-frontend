import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "userId", header: "Employee" },
  { accessorKey: "entryCode", header: "Entry Code" },
  { accessorKey: "periodStart", header: "Period Start",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "periodEnd", header: "Period End",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "totalHours", header: "Total Hours" },
  { accessorKey: "totalAmount", header: "Total Amount" },
  { accessorKey: "rejectionReason", header: "Rejection Reason" },
  { accessorKey: "approvedAt", header: "Approved At",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "submittedAt", header: "Submitted At",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "entries", header: "Entries" },
  { accessorKey: "approvalRequired", header: "Approval Required",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" }
];