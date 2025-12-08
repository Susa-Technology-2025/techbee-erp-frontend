"use client";
import * as React from "react";
import {
  Box,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "../nav-items/nav-items-utils";
interface NavItemWithUI extends NavItem {
  disabled?: boolean;
  description?: string;
  badge?: string;
}
interface SidebarListItemProps {
  NavItem: NavItemWithUI;
  open: boolean;
  nested?: boolean;
  onClick: any;
}
export default function ModernSidebarListItem({
  NavItem,
  open,
  nested = false,
  onClick,
}: SidebarListItemProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const link = NavItem.link;
  const name = NavItem.name;
  const emojie = NavItem.emojie;
  const isDisabled = NavItem.disabled;
  const description = NavItem.description;
  const badge = NavItem.badge;
  const enhancedIsActive = React.useMemo(() => {
    if (pathname === link) return true;
    if (link !== "/" && pathname.startsWith(link)) {
      return true;
    }
    return false;
  }, [pathname, link]);
  const menuItemContent = (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={onClick}
        component={isDisabled ? "div" : Link}
        href={isDisabled ? "" : link}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
          pl: nested ? 4 : 2.5,
          mx: nested ? 1 : 0,
          my: 0.5,
          borderRadius: 2,
          backgroundColor: enhancedIsActive
            ? alpha(theme.palette.primary.main, 0.12)
            : "transparent",
          border: enhancedIsActive
            ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            : `1px solid transparent`,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: enhancedIsActive
              ? alpha(theme.palette.primary.main, 0.18)
              : alpha(theme.palette.action.hover, 0.08),
            borderColor: enhancedIsActive
              ? alpha(theme.palette.primary.main, 0.3)
              : alpha(theme.palette.primary.main, 0.1),
            transform: "translateY(-1px)",
            boxShadow: theme.shadows[1],
          },
          "&::before": enhancedIsActive
            ? {
                content: '""',
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 4,
                height: "60%",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "0 2px 2px 0",
              }
            : {},
          "&:active": {
            transform: "translateY(0)",
          },
        }}
        disabled={isDisabled}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : "auto",
            justifyContent: "center",
            color: enhancedIsActive
              ? theme.palette.primary.main
              : isDisabled
              ? theme.palette.text.disabled
              : theme.palette.text.secondary,
            transition: "color 0.2s ease",
            fontSize: "1.25rem",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          {}
          {emojie && (
            <Box
              component="span"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: isDisabled ? "grayscale(0.5)" : "none",
              }}
            >
              {emojie}
            </Box>
          )}
        </ListItemIcon>
        {open && (
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: enhancedIsActive ? 600 : 400,
                    color: isDisabled
                      ? theme.palette.text.disabled
                      : enhancedIsActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    fontSize: "0.875rem",
                    lineHeight: 1.3,
                    transition: "all 0.2s ease",
                  }}
                >
                  {name} {}
                </Typography>
                {}
                {badge && (
                  <Chip
                    label={badge}
                    size="small"
                    color="primary"
                    sx={{
                      height: 20,
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      ml: 1,
                    }}
                  />
                )}
              </Box>
            }
            secondary={
              description ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: isDisabled
                      ? theme.palette.text.disabled
                      : theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    lineHeight: 1.2,
                    mt: 0.25,
                    display: "block",
                  }}
                >
                  {description}
                </Typography>
              ) : null
            }
          />
        )}
        {}
        {isDisabled && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              borderRadius: 2,
              cursor: "not-allowed",
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
  if (!open) {
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {name} {}
            </Typography>
            {description && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {description}
              </Typography>
            )}
            {isDisabled && (
              <Typography
                variant="caption"
                sx={{ color: "warning.main", display: "block", mt: 0.5 }}
              >
                Coming soon
              </Typography>
            )}
          </Box>
        }
        placement="right"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[3],
              maxWidth: 200,
            },
          },
          arrow: {
            sx: {
              color: theme.palette.background.paper,
              "&::before": {
                border: `1px solid ${theme.palette.divider}`,
              },
            },
          },
        }}
      >
        {menuItemContent}
      </Tooltip>
    );
  }
  return menuItemContent;
}
