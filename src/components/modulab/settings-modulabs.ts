export type Modulab = {
  link: string;
  hub: string;
  module?: string;
  category?: string;
  entity?: string;
  name: string;
  emojie: string;
};

export const settingsModulabs: Modulab[] = [
  {
    link: "/settings",
    hub: "settings",
    name: "Settings",
    emojie: "⚙️",
    category: "navigation",
  },
  {
    link: "/settings/approval",
    hub: "settings",
    module: "approval",
    name: "Approval",
    emojie: "✅",
    category: "configuration",
  },
  {
    link: "/settings/approval/approval-group",
    hub: "settings",
    module: "approval",
    entity: "approval-group",
    name: "Approval Group",
    emojie: "👥",
    category: "configuration",
  },
  {
    link: "/settings/approval/approval-policy",
    hub: "settings",
    module: "approval",
    entity: "approval-policy",
    name: "Approval Policy",
    emojie: "📜",
    category: "configuration",
  },
  {
    link: "/settings/approval/delegation",
    hub: "settings",
    module: "approval",
    entity: "delegation",
    name: "Delegation",
    emojie: "🔀",
    category: "configuration",
  },

  {
    link: "/settings/delegation",
    hub: "settings",
    entity: "delegation",
    name: "Delegation (Legacy)",
    emojie: "🔀",
    category: "configuration",
  },

  {
    link: "/settings/org-structure",
    hub: "settings",
    entity: "org-structure",
    name: "Organization Structure",
    emojie: "🏗️",
    category: "configuration",
  },
  {
    link: "/settings/profile",
    hub: "settings",
    entity: "profile",
    name: "Profile Settings",
    emojie: "👤",
    category: "configuration",
  },
  {
    link: "/settings/roles",
    hub: "settings",
    entity: "roles",
    name: "Roles",
    emojie: "🎭",
    category: "security",
  },
  {
    link: "/settings/tree",
    hub: "settings",
    entity: "tree",
    name: "Settings Tree",
    emojie: "🌳",
    category: "configuration",
  },
  {
    link: "/settings/users",
    hub: "settings",
    module: "users",
    name: "Users",
    emojie: "🧑‍💻",
    category: "security",
  },
  {
    link: "/settings/users/users",
    hub: "settings",
    module: "users",
    entity: "users",
    name: "User Management",
    emojie: "🧑‍💻",
    category: "security",
  },
];
