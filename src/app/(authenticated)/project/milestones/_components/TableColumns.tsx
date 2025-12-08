import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "approvalRequired", header: "Approval Required",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "billable", header: "Billable",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "billingAmount", header: "Billing Amount" },
  { accessorKey: "percentCompletion", header: "Percent Completion" },
  { accessorKey: "plannedStartDate", header: "Planned Start Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "plannedEndDate", header: "Planned End Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "actualCompletionDate", header: "Actual Completion Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "notes", header: "Notes" },
  { accessorKey: "billingSchedule", header: "Billing Schedule" },
  { accessorKey: "assignedTeamOrDept", header: "Assigned Team Or Dept" },
  { accessorKey: "responsibleOwner", header: "Responsible Owner" },
  { accessorKey: "status", header: "Status" }
];