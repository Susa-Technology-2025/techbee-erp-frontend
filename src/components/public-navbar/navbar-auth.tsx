"use client";
import SessionProvider from "@/lib/store/global-state/auth/session-provider";
import { RootState } from "@/lib/store/store";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
  Portal,
} from "@mui/material";
import {
  Logout,
  Dashboard,
  Settings,
  Person,
  Error as ErrorIcon,
  Login,
} from "@mui/icons-material";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useState } from "react";
import ToggleTheme from "@/theme/toogle-theme";
const AuthMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    mutate: logout,
    isPending,
    isSuccess,
    isError,
    error,
  } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/auth/auth/logout",
    method: "POST",
    onSuccess: () => {
      setShowSuccess(true);
      setAnchorEl(null);
      window.location.reload();
    },
  });
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout({});
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
  };
  const avatar = useSelector((state: RootState) => state.session?.user?.avatar);
  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Avatar
          src={avatar ?? "P"}
          sx={{ width: 30, height: 30 }}
          alt="Profile"
        >
          {avatar ? null : "P"}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {}
        <MenuItem
          component={Link}
          href="/dashboard"
          onClick={handleMenuClose}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Dashboard</Typography>
          </ListItemText>
        </MenuItem>
        {}
        <MenuItem
          component={Link}
          href="/self-service"
          onClick={handleMenuClose}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Self Service</Typography>
          </ListItemText>
        </MenuItem>
        {}
        <MenuItem
          onClick={handleLogout}
          disabled={isPending}
          sx={{
            py: 1.5,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ListItemIcon>
            {isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Logout fontSize="small" color="inherit" />
            )}
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">
              {isPending ? "Logging out..." : "Logout"}
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      <Portal>
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={handleSuccessClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" onClose={handleSuccessClose}>
            Logged out successfully!
          </Alert>
        </Snackbar>
        <Snackbar
          open={isError}
          autoHideDuration={5000}
          onClose={() => {}}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="error" icon={<ErrorIcon />} onClose={() => {}}>
            Logout failed: {error?.message || "Something went wrong"}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};
const AuthComponent = () => {
  const { loggedIn } = useSelector((state: RootState) => state.session);
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ToggleTheme />
      {loggedIn ? (
        <AuthMenu />
      ) : (
        <IconButton component={Link} href="/auth">
          <Login />
        </IconButton>
      )}
    </Box>
  );
};
export const NavbarAuth = () => {
  return (
    <SessionProvider>
      <AuthComponent />
    </SessionProvider>
  );
};
