"use client";
import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import DashActions from "@/components/dash-actions";
import { hrLinks } from "../_constants/hr-links";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "100%",
        display: { xs: "flex", lg: "none" },
        backgroundColor: "background.paper",
        borderRadius: "1rem",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{ color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <DashActions />
      </Box>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "80%", sm: "60%" },
            backgroundColor: "background.paper",
          },
        }}
      >
        <List>
          {hrLinks.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton
                component={Link}
                href={link.href}
                onClick={toggleDrawer(false)}
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <link.icon />
                </ListItemIcon>
                <ListItemText primary={link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
