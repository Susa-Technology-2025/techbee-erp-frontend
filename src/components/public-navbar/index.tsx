"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "next/link";
import ToggleTheme from "@/theme/toogle-theme";
import { Login } from "@mui/icons-material";

export const ResponsiveNavigation = ({ logo, code }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const nav_items_for_tenants = [
    { label: "News", href: "/news" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
    // { label: "Organizaion structure", href: "#" },
    // { label: "Contact", href: "#" },
  ];
  const navItems =
    code === "erp"
      ? [
          { label: "News", href: "/news" },
          { label: "About", href: "/about" },
          { label: "Products", href: "/apps" },
          { label: "Demo", href: "/demo" },
        ]
      : nav_items_for_tenants;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Image
          src={logo}
          alt="Logo"
          width={120}
          height={40}
          style={{ objectFit: "contain" }}
        />
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: theme.palette.text.primary }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            backgroundColor: theme.palette.backgroundSection.main,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            maxHeight: 64,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box sx={{ flexGrow: isMobile ? 1 : 0, mr: 4 }}>
            <Link href="/">
              <Box
                component={"img"}
                src={logo}
                alt="Logo"
                width={120}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ToggleTheme />
            <IconButton
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              <Login />
            </IconButton>
          </Box>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: theme.palette.text.primary,
                ml: "auto",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};
