"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
  IconButton,
  Divider,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { sidebarItems } from "@/lib/constants/sidebar";

export default function Sidebar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    itemName: string
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(itemName);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: collapsed ? "auto" : "auto",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1,
        }}
      >
        <IconButton size="large" onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider />

      {sidebarItems.map((item, index) => (
        <Box key={index}>
          {item.items && item.items.length > 0 ? (
            <Box>
              <Button
                fullWidth
                startIcon={
                  item.icon ? (
                    <Badge color="info" variant="dot">
                      <item.icon />
                    </Badge>
                  ) : null
                }
                onClick={(event) => handleClick(event, item.name)}
                sx={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  textTransform: "none",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {!collapsed && item.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openMenu === item.name}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {item.items.map((subItem, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    onClick={handleClose}
                    component={Link}
                    href={subItem.link || ""}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {subItem.icon && <subItem.icon />}
                    {subItem.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              fullWidth
              startIcon={item.icon ? <item.icon /> : null}
              href={item.link}
              component={Link}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                textTransform: "none",
                px: 2,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {!collapsed && item.name}
            </Button>
          )}
        </Box>
      ))}
    </Paper>
  );
}
