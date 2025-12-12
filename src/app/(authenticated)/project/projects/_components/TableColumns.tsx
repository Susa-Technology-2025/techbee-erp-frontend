import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "currency", header: "Currency" },
  { accessorKey: "approvalRequired", header: "Approval Required",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "riskFlag", header: "Risk Flag",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "notifyMemberInvited", header: "Notify Member Invited",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "notifyProjectAssignmentChanged", header: "Notify Assignment Changed",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "actualCost", header: "Actual Cost" },
  { accessorKey: "totalBudget", header: "Total Budget" },
  { accessorKey: "totalPercentCompletion", header: "Total Completion (%)" },
  { accessorKey: "variance", header: "Variance" },
  { accessorKey: "actualStartDate", header: "Actual Start Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "actualEndDate", header: "Actual End Date",
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
  { accessorKey: "customerName", header: "Customer Name" },
  { accessorKey: "departmentOrCostCenter", header: "Department/Cost Center" },
  { accessorKey: "projectManagerUserId", header: "Project Manager" },
  { accessorKey: "billingMethod.id", header: "Billing Method" },
  { accessorKey: "projectStage.id", header: "Project Stage" },
  { accessorKey: "projectType.id", header: "Project Type" },
  { accessorKey: "taskStageSet.id", header: "Task Stage Set" }
];