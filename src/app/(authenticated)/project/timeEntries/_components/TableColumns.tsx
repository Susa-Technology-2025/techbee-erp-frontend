import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "type", header: "Type" },
  { accessorKey: "billable", header: "Billable",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "userId", header: "Employee " },
  { accessorKey: "entryCode", header: "Entry Code" },
  { accessorKey: "taskOrActivity", header: "Task Or Activity" },
  { accessorKey: "notes", header: "Notes" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "hourlyRate", header: "Hourly Rate" },
  { accessorKey: "durationHours", header: "Duration Hours" },
  { accessorKey: "startTime", header: "Start Time" },
  { accessorKey: "endTime", header: "End Time" },
  { accessorKey: "attachmentUrl", header: "Attachment Url" },
  { accessorKey: "workDate", header: "Work Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "timesheet.entryCode", header: "Timesheet Id" },
  { accessorKey: "wbsItem.title", header: "Wbs Item Id" }
];