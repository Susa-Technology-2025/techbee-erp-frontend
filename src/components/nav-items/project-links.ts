import { NavItem } from "./nav-items-utils";

export const projectLinks: NavItem[] = [
  {
    link: "/project",
    hub: "project",
    name: "Project",
    emojie: "📁",
    category: "navigation",
    description: "Main project management hub.",
    active: true,
  },
  {
    link: "/project",
    hub: "project",
    name: "Project Management",
    module: "projectmanagement",
    emojie: "📁",
    description: "Main project management hub.",
    active: true,
  },

  // activities
  {
    link: "/project/activities",
    hub: "project",
    module: "projectmanagement",
    entity: "activities",
    name: "Activities",
    emojie: "📝",
    category: "activity",
    description: "Manage project activities.",
    active: true,
    nonSidebar: true,
  },

  // actualsledgers
  {
    link: "/project/actualsLedgers",
    hub: "project",
    module: "projectmanagement",
    entity: "actualsledgers",
    name: "Actuals Ledgers",
    emojie: "📘",
    category: "finance",
    description: "Track actual project financial entries.",
    active: true,
    nonSidebar: true,
  },

  // attachments
  {
    link: "/project/attachments",
    hub: "project",
    module: "projectmanagement",
    entity: "attachments",
    name: "Attachments",
    emojie: "📎",
    category: "files",
    description: "Manage project attachments.",
    active: true,
    nonSidebar: true,
  },

  // billingmethods
  {
    link: "/project/billingMethods",
    hub: "project",
    module: "projectmanagement",
    entity: "billingmethods",
    name: "Billing Methods",
    emojie: "💳",
    category: "settings",
    description: "Configure billing methods for projects.",
    active: true,
  },

  // changerequests
  {
    link: "/project/changeRequests",
    hub: "project",
    module: "projectmanagement",
    entity: "changerequests",
    name: "Change Requests",
    emojie: "🔧",
    category: "workflow",
    description: "Manage project change requests.",
    active: true,
    nonSidebar: true,
  },

  // comments
  {
    link: "/project/comments",
    hub: "project",
    module: "projectmanagement",
    entity: "comments",
    name: "Comments",
    emojie: "💬",
    category: "communication",
    description: "Project comments and discussions.",
    active: true,
    nonSidebar: true,
  },

  // milestones
  {
    link: "/project/milestones",
    hub: "project",
    module: "projectmanagement",
    entity: "milestones",
    name: "Milestones",
    emojie: "🏁",
    category: "settings",
    description: "Define and track project milestones.",
    active: true,
  },

  // performancerecords
  {
    link: "/project/performanceRecords",
    hub: "project",
    module: "projectmanagement",
    entity: "performancerecords",
    name: "Performance Records",
    emojie: "📊",
    category: "performance",
    description: "Record and evaluate project performance data.",
    active: true,
    nonSidebar: true,
  },

  // projectassignments
  {
    link: "/project/projectAssignments",
    hub: "project",
    module: "projectmanagement",
    entity: "projectassignments",
    name: "Project Assignments",
    emojie: "🧩",
    category: "resource",
    description: "Assign resources to projects.",
    active: true,
    nonSidebar: true,
  },

  // projectcontracts
  {
    link: "/project/projectContracts",
    hub: "project",
    module: "projectmanagement",
    entity: "projectcontracts",
    name: "Project Contracts",
    emojie: "📄",
    category: "contracts",
    description: "Manage project contract records.",
    active: true,
    nonSidebar: true,
  },

  // projects
  {
    link: "/project/projects",
    hub: "project",
    module: "projectmanagement",
    entity: "projects",
    name: "Projects",
    emojie: "📂",
    category: "projects",
    description: "List and manage all projects.",
    active: true,
  },

  // projectstages
  {
    link: "/project/projectStages",
    hub: "project",
    module: "projectmanagement",
    entity: "projectstages",
    name: "Project Stages",
    emojie: "🔄",
    category: "settings",
    description: "Define workflow stages for projects.",
    active: true,
  },

  // projectstagesets
  {
    link: "/project/projectStageSets",
    hub: "project",
    module: "projectmanagement",
    entity: "projectstagesets",
    name: "Project Stage Sets",
    emojie: "🧱",
    category: "settings",
    description: "Manage sets of project stages.",
    active: true,
  },

  // projecttypes
  {
    link: "/project/projectTypes",
    hub: "project",
    module: "projectmanagement",
    entity: "projecttypes",
    name: "Project Types",
    emojie: "📐",
    category: "settings",
    description: "Configure project types.",
    active: true,
  },

  // schedulingtypes
  {
    link: "/project/schedulingTypes",
    hub: "project",
    module: "projectmanagement",
    entity: "schedulingtypes",
    name: "Scheduling Types",
    emojie: "📆",
    category: "settings",
    description: "Define scheduling types.",
    active: true,
  },

  // taskstages
  {
    link: "/project/taskStages",
    hub: "project",
    module: "projectmanagement",
    entity: "taskstages",
    name: "Task Stages",
    emojie: "🪜",
    category: "settings",
    description: "Define workflow stages for tasks.",
    active: true,
  },

  // taskstagesets
  {
    link: "/project/taskStageSets",
    hub: "project",
    module: "projectmanagement",
    entity: "taskstagesets",
    name: "Task Stage Sets",
    emojie: "🧩",
    category: "settings",
    description: "Manage sets of task stages.",
    active: true,
  },

  // timesheets
  {
    link: "/project/timesheets",
    hub: "project",
    module: "projectmanagement",
    entity: "timesheets",
    name: "Timesheets",
    emojie: "⏱️",
    category: "time",
    description: "Track time spent on project tasks.",
    active: true,
  },
  {
    link: "/project/timeEntries",
    hub: "project",
    module: "projectmanagement",
    entity: "timeEntries",
    name: "TimeEntries",
    emojie: "⏱️",
    category: "time",
    description: "Track time entries spent on tasks.",
    active: true,
    nonSidebar: true,
  },

  // wbsassignments
  {
    link: "/project/wbsAssignments",
    hub: "project",
    module: "projectmanagement",
    entity: "wbsassignments",
    name: "WBS Assignments",
    emojie: "🧩",
    category: "resource",
    description: "Work breakdown structure assignments.",
    active: true,
    nonSidebar: true,
  },

  // wbsdependencies
  {
    link: "/project/wbsDependencies",
    hub: "project",
    module: "projectmanagement",
    entity: "wbsdependencies",
    name: "WBS Dependencies",
    emojie: "🔗",
    category: "planning",
    description: "Manage dependencies between WBS items.",
    active: true,
    nonSidebar: true,
  },

  // wbsitems
  {
    link: "/project/wbsItems",
    hub: "project",
    module: "projectmanagement",
    entity: "wbsitems",
    name: "WBS Items",
    emojie: "📊",
    category: "settings",
    description: "Work breakdown structure items for projects.",
    active: true,
    nonSidebar: true,
  },
];
