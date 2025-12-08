import {
  Badge as EmployeeRecordsIcon,
  People as HRIcon,
  ManageAccounts as SysAdminIcon,
} from "@mui/icons-material";

export const subscribedModules = [
  {
    icon: EmployeeRecordsIcon,
    title: "Employee Portal",
    color: "#5c6bc0",
    path: "dashboard/employee-portal",
    roles: ["admin", "manager", "user"],
  },
  {
    icon: HRIcon,
    title: "Human Resources",
    color: "#e91e63",
    path: "hr",
    roles: ["admin", "manager"],
  },
  {
    icon: SysAdminIcon,
    title: "System Admin Panel",
    color: "#455a64",
    path: "super-admin",
    roles: ["admin"],
  },
];
