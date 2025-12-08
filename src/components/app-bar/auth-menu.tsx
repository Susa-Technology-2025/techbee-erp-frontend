"use client";

import { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Box,
  Divider,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import { Logout, Dashboard, HomeRepairService, Settings, Person } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { sessionActions } from "@/lib/store/global-state/auth/auth-slice";

export default function AuthMenu() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.session);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getUserInitials = () => {
    if (!session.user) return "U";
    return session.user.firstName?.[0] + session.user.fatherName?.[0] || "U";
  };

  const menuBorderRadius = (theme.shape.borderRadius as number) * 3;
  const itemBorderRadius = (theme.shape.borderRadius as number) * 2;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleMenuOpen}
        disableRipple
        sx={{
          p: 0,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <Avatar
          src={session.user?.avatar || `https://picsum.photos/seed/678/200`}
          alt={session.user?.firstName}
          sx={{
            width: 28,
            height: 28,
            border: `2px solid ${theme.palette.background.paper}`,
            boxShadow: theme.shadows[1],
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          {getUserInitials()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: 300,
              borderRadius: menuBorderRadius,
              boxShadow: theme.shadows[10],
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
              background: theme.palette.background.paper,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 3,
            background: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={session.user?.avatar || `https://picsum.photos/seed/678/200`}
              alt={session.user?.firstName}
              sx={{
                width: 60,
                height: 60,
                border: `2px solid ${theme.palette.primary.light}`,
                boxShadow: theme.shadows[1],
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {getUserInitials()}
            </Avatar>

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {session.user?.username || "User Name"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.2 }}
              >
                {session.organization?.name || "Organization"}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                {(session.permissions || ["User"]).map((role, index) => (
                  <Chip
                    key={index}
                    label={role}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.action.selected,
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: "0.65rem",
                      height: 20,
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 1.5 }}>
          <MenuItem
            component={Link}
            href="/dashboard"
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: itemBorderRadius,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: theme.palette.action.hover },
            }}
          >
            <Dashboard
              sx={{ color: theme.palette.primary.main, fontSize: 22, mr: 2 }}
            />

            <Box>
              <Typography variant="body1" fontWeight={500}>
                Dashboard
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Access your workspace
              </Typography>
            </Box>
          </MenuItem>


          <MenuItem
            component={Link}
            href="/employee-portal"
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: itemBorderRadius,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <HomeRepairService
              sx={{
                color: theme.palette.primary.main,
                fontSize: 22,
                mr: 2,
              }}
            />

            <Box>
              <Typography variant="body1" fontWeight={500}>
                Self Service
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage your personal tasks
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem
            component={Link}
            href="/settings"
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: itemBorderRadius,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <Settings
              sx={{
                color: theme.palette.primary.main,
                fontSize: 22,
                mr: 2,
              }}
            />

            <Box>
              <Typography variant="body1" fontWeight={500}>
                General Setting
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Configure system preferences
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            component={Link}
            href="/dashboard/profile"
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: itemBorderRadius,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <Person
              sx={{
                color: theme.palette.primary.main,
                fontSize: 22,
                mr: 2,
              }}
            />
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Profile
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage your account
              </Typography>
            </Box>
          </MenuItem>

          <Divider sx={{ my: 1.5 }} />

          <MenuItem
            onClick={() => {
              handleMenuClose();
              dispatch(sessionActions.clearSession());
              router.push("/");
            }}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: itemBorderRadius,
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: theme.palette.error.light + "15" },
            }}
          >
            <Logout
              sx={{ color: theme.palette.error.main, fontSize: 22, mr: 2 }}
            />
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Sign Out
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Securely end your session
              </Typography>
            </Box>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
}
