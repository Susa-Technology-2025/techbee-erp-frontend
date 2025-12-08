"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Box, Button, useTheme } from "@mui/material";
import Link from "next/link";

const navItems = [
  { path: "page", label: "Overview" },
  { path: "salary-rule-category", label: "Rule Categories" },
  { path: "salary-rules", label: "Salary Rules" },
  { path: "salary-structure", label: "Structures" },
  { path: "salary-structure-rules", label: "Structure Rules" },
];

export default function PayrollSettingsNav() {
  const pathname = usePathname();
  const theme = useTheme();
  const basePath = "/hr/payroll/settings";
  const currentPath =
    pathname.replace(`${basePath}/`, "").split("/")[0] || "page";

  return (
    <Box
      component="nav"
      display="flex"
      justifyContent="start"
      alignItems="center"
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: 2,
        pt: 2,
        pb: 1,
        gap: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Button
            component={Link}
            key={item.path}
            href={`${basePath}/${item.path}`}
            disableRipple
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 0,
              borderBottom: isActive
                ? `2px solid ${theme.palette.primary.main}`
                : "2px solid transparent",
              color: isActive
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
              pb: 1,
              px: 0.5,
              minWidth: "auto",
              "&:hover": {
                color: theme.palette.text.primary,
                backgroundColor: "transparent",
              },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}
