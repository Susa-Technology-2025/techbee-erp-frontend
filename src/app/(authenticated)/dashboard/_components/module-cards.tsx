"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Skeleton,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  isActive: boolean;
  isSubscribed: boolean;
  isSubModule: boolean;
  underMaintainance: boolean;
  otherScenario: boolean;
  parentModule?: string;
  packageCategory:
    | "free"
    | "starter"
    | "basic"
    | "pro"
    | "premium"
    | "enterprise"
    | "trial"
    | "startups"
    | "nonprofits";
  rolesAllowed: string[];
  allRolesAllowed: boolean;
  userRoles?: string[];
  isLoading: boolean;
}

const PACKAGE_COLORS = {
  free: "#4caf50",
  starter: "#8bc34a",
  basic: "#cddc39",
  pro: "#2196f3",
  premium: "#ff9800",
  enterprise: "#ff5722",
  trial: "#9e9e9e",
  startups: "#00bcd4",
  nonprofits: "#607d8b",
};

export default function ModuleCard({
  title,
  description,
  icon,
  href = "#",
  color = "#1976d2",
  isActive = true,
  isSubscribed = false,
  isSubModule = false,
  underMaintainance: underMaintenance,
  otherScenario = false,
  parentModule,
  packageCategory = "free",
  rolesAllowed = [],
  allRolesAllowed = false,
  userRoles = [],
  isLoading,
}: ModuleCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const hasAccess =
    allRolesAllowed ||
    rolesAllowed.length === 0 ||
    userRoles?.some((role) => rolesAllowed.includes(role));
  const isRestricted = !isActive || underMaintenance || !hasAccess;
  const isClickable = isSubscribed && !isRestricted;

  const packageColor = PACKAGE_COLORS[packageCategory] || color;

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        width={200}
        height={200}
        sx={{ borderRadius: 2 }}
      />
    );
  }

  const showMenu = !hasAccess || isSubscribed;
  const menuText = isSubscribed ? `Upgrade` : "Subscribe";

  const menuHref = "/plan";

  const tooltipTitle = (
    <Box sx={{ p: 1, maxWidth: 240 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
        <Box
          component="span"
          sx={{
            ml: 1,
            fontSize: "0.7rem",
            color: packageColor,
            textTransform: "capitalize",
          }}
        >
          {packageCategory}
        </Box>
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {description}
      </Typography>

      {!isActive && (
        <Box
          sx={{
            mt: 1,
            p: 0.5,
            bgcolor: "rgba(0,0,0,0.03)",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">🚀 On the Horizon</Typography>
        </Box>
      )}

      {underMaintenance && (
        <Box
          sx={{
            mt: 1,
            p: 0.5,
            bgcolor: "rgba(255,152,0,0.1)",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">⚠️ Under maintenance</Typography>
        </Box>
      )}

      {!hasAccess && !underMaintenance && (
        <Box
          sx={{
            mt: 1,
            p: 0.5,
            bgcolor: "rgba(0,0,0,0.03)",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">
            🔒 Requires {packageCategory} plan
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        width: 200,
        height: 200,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        bgcolor: "background.paper",
        boxShadow: `0 4px 8px ${
          theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"
        }`,
        ...(isRestricted && {
          opacity: 0.6,
          filter: "grayscale(100%)",
          cursor: "not-allowed",
          "&:hover": {
            transform: "none",
            boxShadow: `0 4px 8px ${
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.2)"
                : "rgba(0,0,0,0.1)"
            }`,
          },
        }),
        ...(!isRestricted && {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 16px ${
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.3)"
                : "rgba(0,0,0,0.1)"
            }`,
          },
        }),
      }}
    >
      {/* Lock/Unlock Icon */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: isClickable ? "#2196f3" : "text.secondary",
        }}
      >
        {isClickable ? (
          <LockOpenOutlinedIcon fontSize="large" />
        ) : (
          <LockOutlinedIcon fontSize="large" />
        )}
      </Box>

      {/* Status badge */}
      <Chip
        label={packageCategory}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          fontSize: 12,
          height: 24,
          bgcolor: packageColor,
          color: theme.palette.getContrastText(packageColor),
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      />

      {/* Main emoji icon - now the only clickable element */}
      <Tooltip title={tooltipTitle} placement="top" arrow>
        <Box
          component={isClickable ? Link : "div"}
          href={isClickable ? href : undefined}
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontSize: 36,
            mb: 1.5,
            boxShadow: `0 4px 12px ${
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.3)"
                : "rgba(0,0,0,0.1)"
            }`,
            cursor: isClickable ? "pointer" : "default",
          }}
        >
          {icon}
        </Box>
      </Tooltip>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          fontSize: 16,
          textAlign: "center",
          color: !isRestricted ? "text.primary" : "text.secondary",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      {isSubModule && parentModule && (
        <Typography
          variant="caption"
          sx={{
            color: !isRestricted ? "text.secondary" : "text.disabled",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {parentModule}
        </Typography>
      )}

      {/* Upgrade/Subscribe menu */}
      {showMenu && (
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            right: 4,
          }}
        >
          <IconButton
            aria-label="menu options"
            aria-controls={openMenu ? "card-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleMenuClick}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="card-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "menu-button",
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              href={menuHref}
            >
              {menuText}
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
}

function getNextPackage(currentPackage: string): string {
  const packageHierarchy = [
    "free",
    "starter",
    "basic",
    "pro",
    "premium",
    "enterprise",
  ];

  const currentIndex = packageHierarchy.indexOf(currentPackage);
  if (currentIndex === -1 || currentIndex === packageHierarchy.length - 1) {
    return "higher plan";
  }
  return packageHierarchy[currentIndex + 1];
}
