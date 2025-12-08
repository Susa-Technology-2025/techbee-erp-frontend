import { NavItem } from "./nav-items-utils";

export const settingsModulabs: NavItem[] = [
  {
    link: "/settings",
    hub: "settings",
    name: "Settings",
    emojie: "⚙️",
    category: "navigation",
    description:
      "Main configuration panel for system-wide and module-specific settings.",
    active: true,
  },
  {
    link: "/settings/organization",
    hub: "settings",
    module: "organization",
    name: "organization",
    emojie: "✅",
    category: "security",

    description: "Manage Organization.",
    active: true,
  },
  {
    link: "/settings/organization/tree",
    hub: "settings",
    module: "organization",
    name: "Org Tree",
    entity: "Tree",
    emojie: "✅",
    category: "configuration",
    description: "View Organization Tree.",
    active: true,
  },

  {
    link: "/settings/organization/approval-group",
    hub: "settings",
    module: "organization",
    entity: "approval-group",
    name: "Approval Group",
    emojie: "👥",
    category: "configuration",
    description:
      "Define and manage groups of users responsible for approving requests.",
    active: true,
  },

  {
    link: "/settings/organization/approval-policy",
    hub: "settings",
    module: "organization",
    entity: "approval-policy",
    name: "Approval Policy",
    emojie: "📜",
    category: "configuration",
    description:
      "Set up the rules and conditions that trigger specific approval flows.",
    active: true,
  },
  {
    link: "/settings/organization/delegation",
    hub: "settings",
    module: "organization",
    entity: "delegation",
    name: "Delegation",
    emojie: "🔀",
    category: "configuration",
    description:
      "Configure temporary or permanent delegation of approval authority to other users.",
    active: true,
  },

  {
    link: "/settings/organization/org-structure",
    hub: "settings",
    entity: "org-structure",
    module: "organization",
    name: "Organization Structure",
    emojie: "🏗️",
    category: "configuration",
    description:
      "Define and visualize the company's hierarchy, departments, and positions.",
    active: true,
  },
  {
    link: "/settings/organization/profile",
    hub: "settings",
    module: "organization",
    entity: "profile",
    name: "Profile Settings",
    emojie: "👤",
    category: "configuration",
    description:
      "Manage the fields and visibility settings for user and employee profiles.",
    active: true,
  },
  {
    link: "/settings/organization/notification",
    hub: "settings",
    module: "organization",
    entity: "notification",
    name: "notification",
    emojie: "👤",
    category: "configuration",
    description: "Manage notification settings.",
    active: true,
  },

  {
    link: "/settings/users",
    hub: "settings",
    module: "user",
    name: "user",
    emojie: "🧑‍💻",
    category: "security",
    description:
      "Main module for creating and managing all system users and their accounts.",
    active: true,
  },
  {
    link: "/settings/users",
    hub: "settings",
    module: "user",
    entity: "users",
    name: "User Management",
    emojie: "🧑‍💻",
    category: "security",
    description:
      "Detailed management of individual user accounts, credentials, and properties.",
    active: true,
  },
  {
    link: "/settings/users/roles",
    hub: "settings",
    entity: "roles",
    module: "user",
    name: "Roles",
    emojie: "🎭",
    category: "user",
    description:
      "Define and assign roles to control user access and permissions within the system.",
    active: true,
  },
];
