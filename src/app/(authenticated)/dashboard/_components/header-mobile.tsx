"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Avatar,
  Typography,
  Button,
  Divider,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import CloseIcon from "@mui/icons-material/Close";
import DashActions from "@/components/dash-actions";
import Link from "next/link";

interface DashboardHeaderMobileProps {
  user: {
    name: string;
    profilePicture: string;
  };
}

export default function DashboardHeaderMobile({
  user,
}: DashboardHeaderMobileProps) {
  const drawerWidth = 240;
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {user.name}
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Button
          component={Link}
          href="/dashboard"
          startIcon={<SpaceDashboardRoundedIcon />}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            backgroundColor: "primary.main",
            color: "background.default",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Dashboard
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: { xs: "flex", lg: "none" } }}>
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
      <Toolbar />
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
            backgroundColor: "background.paper",
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
