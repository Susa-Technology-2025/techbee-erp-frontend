import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "employeeId", header: "Employee Id" },
  { accessorKey: "entryCode", header: "Entry Code" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "totalAmount", header: "Total Amount" },
  { accessorKey: "totalHours", header: "Total Hours" },
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
  { accessorKey: "rejectionReason", header: "Rejection Reason" }
];