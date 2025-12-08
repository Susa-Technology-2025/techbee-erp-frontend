import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "slaState", header: "Sla State" },
  { accessorKey: "approvalRequired", header: "Approval Required",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "notifyTaskAssignmentChanged", header: "Notify Task Assignment Changed",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "actualCost", header: "Actual Cost" },
  { accessorKey: "budgetEstimate", header: "Budget Estimate" },
  { accessorKey: "durationDays", header: "Duration Days" },
  { accessorKey: "order", header: "Order" },
  { accessorKey: "percentCompletion", header: "Percent Completion" },
  { accessorKey: "weightPercent", header: "Weight Percent" },
  { accessorKey: "actualCompletionDate", header: "Actual Completion Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
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
  { accessorKey: "description", header: "Description" },
  { accessorKey: "notes", header: "Notes" },
  { accessorKey: "responsibleRoleOrName", header: "Responsible Role Or Name" },
  { accessorKey: "riskOrIssues", header: "Risk Or Issues" },
  { accessorKey: "statusLabel", header: "Status Label" },
  { accessorKey: "deliverables", header: "Deliverables" },
  { accessorKey: "milestone", header: "Milestone" },
  { accessorKey: "project", header: "Project" },
  { accessorKey: "parent", header: "Parent" },
  { accessorKey: "taskStage", header: "Task Stage" }
];