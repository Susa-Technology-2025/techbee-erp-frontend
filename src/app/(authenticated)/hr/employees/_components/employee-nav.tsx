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
  Typography,
  Divider,
  Avatar,
  Badge,
  Chip,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import DashActions from "@/components/dash-actions";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";

type IconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};

interface NavItem {
  label?: string;
  path?: string;
  icon?: IconType;
  badge?: number;
  new?: boolean;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Employees", path: "/hr/employees", icon: GroupIcon },
  { label: "Next Version", path: "/employees", icon: GroupIcon },
  {
    label: "Contracts",
    path: "/hr/employees/contracts",
    icon: DescriptionOutlinedIcon,
  },
];

const drawerWidth = 280;

export default function HrNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();

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
        item.path &&
        (pathWithoutLocale === item.path ||
          pathWithoutLocale.startsWith(item.path + "/"))
      ) {
        if (item.path.length > longestMatch.length) {
          longestMatch = item.path;
        }
      }
    }
    return longestMatch;
  };

  const longestMatchingPath = getLongestMatchingPath(pathname);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "background.paper",
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "72px",
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                letterSpacing: "-0.5px",
              }}
            >
              Employees
            </Typography>
          </Box>
          <DashActions />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            background: "background.paper",
            boxShadow: "4px 0 20px rgba(0,0,0,0.04)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              flexGrow: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "divider",
                borderRadius: "3px",
              },
            }}
          >
            <List sx={{ py: 1 }}>
              {navItems.map((item, index) => {
                if (item.section) {
                  return (
                    <React.Fragment key={`section-${index}`}>
                      <Typography
                        variant="overline"
                        sx={{
                          display: "block",
                          px: 2,
                          py: 1.5,
                          mt: index !== 0 ? 2 : 0,
                          color: "text.secondary",
                          letterSpacing: "0.5px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {item.section}
                      </Typography>
                      <Divider sx={{ my: 0.5 }} />
                    </React.Fragment>
                  );
                }

                if (!item.path || !item.icon) return null;

                const isActive = item.path === longestMatchingPath;
                const IconComponent = item.icon;

                return (
                  <Button
                    component={Link}
                    key={item.path}
                    href={item.path}
                    onClick={handleDrawerToggle}
                    startIcon={<IconComponent />}
                    sx={{
                      width: "100%",
                      margin: "4px 0",
                      justifyContent: "flex-start",
                      px: 2,
                      py: "10px",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "primary.main" : "text.secondary",
                      backgroundColor: isActive
                        ? "rgba(59, 130, 246, 0.1)"
                        : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(59, 130, 246, 0.08)",
                        color: "primary.main",
                        transform: "translateX(4px)",
                        "& .MuiSvgIcon-root": {
                          color: "primary.main",
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        color: isActive ? "primary.main" : "text.secondary",
                        fontSize: "1.1rem",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      {item.badge && (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{
                            ml: "auto",
                            "& .MuiBadge-badge": {
                              right: -6,
                              top: 6,
                              padding: "0 4px",
                              minWidth: "18px",
                              height: "18px",
                              fontSize: "0.65rem",
                            },
                          }}
                        />
                      )}
                      {item.new && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            ml: "auto",
                            height: "18px",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            backgroundColor: "success.light",
                            color: "success.contrastText",
                          }}
                        />
                      )}
                    </Box>
                  </Button>
                );
              })}
            </List>
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(241, 245, 249, 0.6)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.7rem" }}
              >
                v1.0.0 • {new Date().toLocaleDateString()}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Online
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
