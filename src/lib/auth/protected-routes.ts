export const roles = [
  "employee",
  "hr",
  "user",
  "hr-manager",
  "recruiter",
  "payroll-specialist",
  "org-admin",
  "guest",
  "super-admin",
  "support",
  "asset-manager",
  "department-head",
  "project-manager",
  "senior-manager",
  "sales-director",
  "finance-manager",
  "warehouse-manager",
  "manager",
  "admin",
] as const;
export type Role = (typeof roles)[number];
const allRoles = roles.filter((role) => role !== "guest");

export const protectedRoutes = [
  {
    path: "/dashboard",
    allowedRoles: roles,
  },
  {
    path: "/dashboard/super-admin",
    allowedRoles: ["super-admin"],
  },
  {
    path: "/dashboard/organization-settings",
    allowedRoles: ["super-admin", "org-admin", "admin"],
  },
  {
    path: "/settings",
    allowedRoles: ["super-admin", "org-admin", "admin"],
  },
  {
    path: "/employee-portal",
    allowedRoles: allRoles,
  },
  {
    path: "/hr",
    allowedRoles: ["hr-manager", "manager", "hr", "super-admin", "admin"],
  },
  {
    path: "/employees",
    allowedRoles: ["hr-manager", "manager", "hr", "super-admin", "admin"],
  },
  {
    path: "/pos",
    allowedRoles: ["hr-manager", "manager", "hr", "super-admin", "admin"],
  },
  {
    path: "/inventory",
    allowedRoles: ["hr-manager", "manager", "hr", "super-admin", "admin"],
  },
  {
    path: "/hr/attendance",
    allowedRoles: ["hr", "hr-manager", "manager", "super-admin", "admin"],
  },

  {
    path: "/hr/hub",
    allowedRoles: ["hr", "hr-manager", "manager", "super-admin", "admin"],
  },
  {
    path: "/users",
    allowedRoles: ["admin"],
  },
  {
    path: "/hr/employees",
    allowedRoles: ["hr", "hr-manager", "manager", "super-admin", "admin"],
  },
  {
    path: "/hr/payroll",
    allowedRoles: [
      "payroll-specialist",
      "hr-manager",
      "manager",
      "super-admin",
      "admin",
    ],
  },

  {
    path: "/hr/attendance",
    allowedRoles: ["hr", "hr-manager", "manager", "employee", "admin"],
  },
];
