import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "active",
    header: "Active",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyBudgetExceeded",
    header: "Notify Budget Exceeded",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyChangeRequestSubmitted",
    header: "Notify Change Request Submitted",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyMilestoneDeadlineUpcoming",
    header: "Notify Milestone Deadline Upcoming",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyMilestoneOverdue",
    header: "Notify Milestone Overdue",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyProjectDeadlineUpcoming",
    header: "Notify Project Deadline Upcoming",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyTaskDeadlineUpcoming",
    header: "Notify Task Deadline Upcoming",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyProjectOverdue",
    header: "Notify project overdue",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "notifyTaskOverdue",
    header: "Notify Task Overdue",
    Cell: ({ cell }) => (cell.getValue() ? "✔" : "✘"),
  },
  {
    accessorKey: "milestoneDeadlineUpcomingLeadHours",
    header: "Milestone Deadline Upcoming Lead Hours",
  },
  {
    accessorKey: "projectDeadlineUpcomingLeadHours",
    header: "Project Deadline Upcoming Lead Hours",
  },
  {
    accessorKey: "taskDeadlineUpcomingLeadHours",
    header: "Task Deadline Upcoming Lead Hours",
  },
  { accessorKey: "defaultWbsTemplateId", header: "Default Wbs Template Id" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "defaultBillingMethod.name",
    header: "Default Billing Method",
  },
  {
    accessorKey: "defaultProjectStageSet.name",
    header: "Default Project Stage Set",
  },
  { accessorKey: "defaultTaskStageSet.name", header: "Default Task Stage Set" },
];
