import React from "react";
import {
  Toolbar,
  Box,
  Button,
  Grid,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import {
  Dashboard as DashboardIcon,
  People as EmployeesIcon,
  Business as DepartmentsIcon,
  Settings as ConfigurationIcon,
  Home as HomeIcon,
  Event as LeaveIcon,
  Schedule as AttendanceIcon,
  TrendingUp as PerformanceIcon,
  Work as RecruitmentIcon,
  AttachMoney as PayrollIcon,
} from "@mui/icons-material";
import AuthMenu from "@/components/app-bar/auth-menu";
import ToogleTheme from "../../theme/toogle-theme";
import SelectLanguage from "../select-language";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
}

export default function HRNavbar() {
  const currentRole = "HR Manager";

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon fontSize="small" />,
      roles: [
        "HR Administrator",
        "HR Manager",
        "Department Manager",
        "Payroll Officer",
        "Recruiter",
      ],
    },
    {
      label: "Employees",
      path: "/hr/employees",
      icon: <EmployeesIcon fontSize="small" />,
      roles: [
        "HR Administrator",
        "HR Manager",
        "Department Manager",
        "Recruiter",
      ],
    },
    // {
    //   label: "Leaves",
    //   path: "/hr/leaves",
    //   icon: <LeaveIcon fontSize="small" />,
    //   roles: ["HR Administrator", "HR Manager", "Department Manager"],
    //   badge: "Updated",
    // },
    // {
    //   label: "Attendance",
    //   path: "/hr/attendance",
    //   icon: <AttendanceIcon fontSize="small" />,
    //   roles: [
    //     "HR Administrator",
    //     "HR Manager",
    //     "Department Manager",
    //     "Payroll Officer",
    //   ],
    // },
    // {
    //   label: "Performance",
    //   path: "/hr/performance",
    //   icon: <PerformanceIcon fontSize="small" />,
    //   roles: ["HR Administrator", "HR Manager", "Department Manager"],
    // },
    // {
    //   label: "Departments",
    //   path: "/hr/departments",
    //   icon: <DepartmentsIcon fontSize="small" />,
    //   roles: ["HR Administrator", "HR Manager"],
    // },
    // {
    //   label: "Payroll",
    //   path: "/hr/payroll",
    //   icon: <PayrollIcon fontSize="small" />,
    //   roles: ["HR Administrator", "Payroll Officer"],
    // },
    {
      label: "Recruiting",
      path: "/hr/recruiting",
      icon: <RecruitmentIcon fontSize="small" />,
      roles: ["HR Administrator", "Recruiter"],
      badge: "New",
    },
    {
      label: "Settings",
      path: "/hr/settings",
      icon: <ConfigurationIcon fontSize="small" />,
      roles: ["HR Administrator", "System Administrator"],
      badge: "Admin",
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <Toolbar
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        px: { xs: 1, sm: 3 },
        py: 1,
        overflowX: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Scrollable nav items */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          flex: 1,
          mr: 2,
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item.path}
            component={Link}
            href={item.path}
            variant="text"
            startIcon={item.icon}
            sx={{
              color: "inherit",
              textTransform: "none",
              fontSize: { xs: "0.7rem", sm: "0.85rem" },
              fontFamily: "Ubuntu",
              whiteSpace: "nowrap",
              px: { xs: 1, sm: 2 },
              borderRadius: 2,
              minWidth: "fit-content",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {item.label}
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color={
                    item.badge === "New"
                      ? "success"
                      : item.badge === "Updated"
                      ? "warning"
                      : "default"
                  }
                  sx={{ height: 18, fontSize: "0.6rem", ml: 0.5 }}
                />
              )}
            </Box>
          </Button>
        ))}
      </Box>
      {/* Right controls */}
      <Grid
        container
        justifyContent="flex-end"
        alignItems="center"
        wrap="nowrap"
        sx={{ width: "auto", flexShrink: 0 }}
        gap={1}
      >
        <Link href="/" passHref legacyBehavior>
          <IconButton color="inherit">
            <HomeIcon />
          </IconButton>
        </Link>
        <ToogleTheme />
        <SelectLanguage />
        <AuthMenu />
      </Grid>
    </Toolbar>
  );
}
