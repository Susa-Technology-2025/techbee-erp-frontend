"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  CssBaseline,
  IconButton,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashActions from "@/components/dash-actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import InputIcon from "@mui/icons-material/Input";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GavelIcon from "@mui/icons-material/Gavel";

const navItems = [
  { label: "Overview", path: "/hr/payroll", icon: DashboardIcon },

  { label: "Payslips", path: "/hr/payroll/payslips", icon: ReceiptLongIcon },
  {
    label: "Payroll Batches",
    path: "/hr/payroll/payroll-batches",
    icon: BatchPredictionIcon,
  },
  {
    label: "Payslip Inputs",
    path: "/hr/payroll/payslip-inputs",
    icon: InputIcon,
  },

  {
    label: "Bank Accounts",
    path: "/hr/payroll/bank-accounts",
    icon: AccountBalanceIcon,
  },
  // {
  //   label: "Payslip Components",
  //   path: "/hr/payroll/payslip-components",
  //   icon: PaymentsOutlinedIcon,
  // },

  {
    label: "Work Entries",
    path: "/hr/payroll/work-entries",
    icon: WorkHistoryIcon,
  },
  {
    label: "Tax Bracket",
    path: "/hr/payroll/tax-bracket",
    icon: AccountBalanceWalletIcon,
  },
  // {
  //   label: "Deduction Policy",
  //   path: "/hr/payroll/deduction-policy",
  //   icon: TrendingDownIcon,
  // },
  {
    label: "Pension Policy",
    path: "/hr/payroll/pension-policy",
    icon: GavelIcon,
  },
  {
    label: "Configuration",
    path: "/hr/payroll/settings",
    icon: SettingsIcon,
  },
];

const drawerWidth = 240;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const getLongestMatchingPath = (currentPathWithLocale: string) => {
    const pathWithoutLocale = currentPathWithLocale.replace(
      /^\/[a-z]{2}(?=\/|$)/,
      ""
    );

    let longestMatch = "";
    for (const item of navItems) {
      if (
        pathWithoutLocale === item.path ||
        pathWithoutLocale.startsWith(item.path + "/")
      ) {
        if (item.path.length > longestMatch.length) {
          longestMatch = item.path;
        }
      }
    }
    return longestMatch;
  };

  const longestMatchingPath = getLongestMatchingPath(pathname);

  const drawerContent = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 1,
          ...{ minHeight: 56 },
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeft sx={{ color: "section.contrastText" }} />
        </IconButton>
      </Box>
      <List>
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = path === longestMatchingPath;

          return (
            <Button
              component={Link}
              key={path}
              href={path}
              onClick={() => {
                setOpen(false);
              }}
              startIcon={<Icon />}
              sx={{
                width: "100%",
                m: 0,
                justifyContent: "flex-start",
                py: 1,
                px: 2,
                borderRadius: 0,
                backgroundColor: isActive ? "black" : "transparent",
                color: !isActive ? "white" : "section.contrastText",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {label}
            </Button>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          backgroundColor: "background.paper",

          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon sx={{ color: "section.main" }} />
          </IconButton>
          <DashActions />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{}}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "section.main",
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
