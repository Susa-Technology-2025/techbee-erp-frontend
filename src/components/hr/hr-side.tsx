"use client";

import React, { useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Mail as MailIcon,
  CalendarToday as CalendarIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const SidebarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: "100vh",
  position: "sticky",
  top: 0,
}));

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Users", icon: <PeopleIcon /> },
  { text: "Messages", icon: <MailIcon /> },
  { text: "Calendar", icon: <CalendarIcon /> },
  { text: "Documents", icon: <FileCopyIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <SidebarWrapper open={open}>
      <Grid container direction="column" sx={{ height: "100%" }}>
        {/* Header section - always shows the toggle button */}
        <Grid>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: theme.spacing(2),
              minHeight: 64, // Ensure consistent height
            }}
          >
            {open && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 700,
                  flexGrow: 1,
                  ml: 1,
                  transition: "opacity 0.3s",
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                }}
              >
                Admin Panel
              </Typography>
            )}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: "inherit",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
                ml: open ? 0 : "auto", // Center when closed
                mr: open ? 0 : "auto", // Center when closed
              }}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        </Grid>

        {/* Menu items */}
        <Grid sx={{ flexGrow: 1, overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <Tooltip title={!open ? item.text : ""} placement="right">
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Footer section */}
        <Grid>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <Box
            sx={{
              p: theme.spacing(2),
              display: "flex",
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            {open ? (
              <Typography variant="body2">v1.0.0</Typography>
            ) : (
              <Tooltip title="v1.0.0" placement="right">
                <Typography variant="caption">v1</Typography>
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>
    </SidebarWrapper>
  );
};

export default Sidebar;
