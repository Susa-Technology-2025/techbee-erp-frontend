import {
  SpaceDashboardRounded as Dashboard,
  PeopleAltRounded as Employees,
  AccessTimeRounded as Attendance,
  Payments as Payroll,
  GroupsRounded as HRHub,
} from "@mui/icons-material";

export const hrLinks = [
  { href: "/hr", icon: Dashboard, text: "Overview" },
  { href: "/hr/employees", icon: Employees, text: "Employees" },
  { href: "/hr/attendance", icon: Attendance, text: "Attendance" },
  { href: "/hr/payroll", icon: Payroll, text: "Payroll" },
  {
    href: "/hr/hub",
    icon: HRHub,
    text: "Main Hub",
  },
];
