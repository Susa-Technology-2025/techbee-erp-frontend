"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  styled,
  useTheme,
  Box,
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  Typography,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";

const drawerWidth = 256;
const collapsedWidth = 72;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  minHeight: 64,
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const NavItemButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  width: "100%",
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.25, 1),
  fontSize: "0.875rem",
  fontWeight: active ? 600 : 400,
  gap: theme.spacing(2),
  minHeight: 40,

  backgroundColor: active ? theme.palette.action.selected : "transparent",
  color: active ? theme.palette.primary.main : theme.palette.text.primary,

  "&:hover": {
    backgroundColor: active
      ? theme.palette.action.selected
      : theme.palette.action.hover,
  },
}));

const NavItem = ({ link, open }) => {
  const pathname = usePathname();
  const hasChildren = link.children?.length > 0;
  const [expanded, setExpanded] = React.useState(false);

  const isActive = pathname === link.href;
  const isChildActive = link.children?.some((child) => pathname === child.href);

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const buttonContent = (
    <NavItemButton
      onClick={handleClick}
      component={!hasChildren ? Link : "button"}
      href={!hasChildren ? link.href : undefined}
      active={isActive || isChildActive}
      startIcon={link.emoji || <FolderIcon />}
      endIcon={
        hasChildren && open ? (
          expanded ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )
        ) : null
      }
    >
      {open && link.title}
    </NavItemButton>
  );

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        {open ? (
          buttonContent
        ) : (
          <Tooltip title={link.title} placement="right" arrow>
            {buttonContent}
          </Tooltip>
        )}
      </ListItem>

      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: open ? 2 : 0 }}>
            {link.children.map((child, index) => (
              <ChildNavItem key={index} child={child} open={open} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const ChildNavItem = ({ child, open }) => {
  const pathname = usePathname();
  const isActive = pathname === child.href;

  const buttonContent = (
    <NavItemButton
      component={Link}
      href={child.href}
      active={isActive}
      startIcon={child.emoji}
      sx={{
        marginLeft: open ? 2 : 1,
        width: open
          ? `calc(100% - ${useTheme().spacing(3)})`
          : "calc(100% - 16px)",
        fontSize: "0.8125rem",
      }}
    >
      {open && child.title}
    </NavItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      {open ? (
        buttonContent
      ) : (
        <Tooltip title={child.title} placement="right" arrow>
          {buttonContent}
        </Tooltip>
      )}
    </ListItem>
  );
};

const Sidebar = ({ links, title, bottomLinks }) => {
  const [open, setOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader>
        {open && (
          <Typography variant="h6" noWrap component="div" fontWeight={600}>
            {title}
          </Typography>
        )}
        <IconButton onClick={handleDrawerToggle} size="small">
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <List sx={{ flex: 1, py: 1 }}>
          {links.map((link, index) => (
            <NavItem key={index} link={link} open={open} />
          ))}
        </List>

        {bottomLinks.length > 0 && (
          <>
            <Divider />
            <List sx={{ py: 1 }}>
              {bottomLinks.map((link, index) => (
                <NavItem key={index} link={link} open={open} />
              ))}
            </List>
          </>
        )}
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
