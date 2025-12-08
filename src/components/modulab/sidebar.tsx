"use client";
import React, { useMemo, useState, useRef } from "react";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Popover,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Folder as DefaultCategoryIcon,
  Settings,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { NavItem } from "../nav-items/nav-items-utils";
import { getCurrentModule } from "./sidebar-utils";
import ModernSidebarListItem from "./SidebarListItem";
import { navigationItems } from "../nav-items/nav-items-utils";

// Import React Icons
import {
  FaFolder,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaDatabase,
  FaCalendar,
  FaEnvelope,
  FaShoppingCart,
  FaMoneyBill,
  FaBell,
  FaUserCircle,
  FaHome,
  FaBriefcase,
  FaProjectDiagram,
  FaClipboardList,
  FaChartLine,
  FaWrench,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";

const UNCATEGORIZED_KEY = "Other";
const SETTINGS_KEY = "Settings";
const CONFIGURATION_KEY = "settings";

type CurrentModuleContext = {
  id: string;
  name: string;
  hub: string;
  navItems: NavItem[];
};

// Array of React Icons to use as fallback
const REACT_ICONS = [
  FaFolder,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaDatabase,
  FaCalendar,
  FaEnvelope,
  FaShoppingCart,
  FaMoneyBill,
  FaBell,
  FaUserCircle,
  FaHome,
  FaBriefcase,
  FaProjectDiagram,
  FaClipboardList,
  FaChartLine,
  FaWrench,
  FaShieldAlt,
  FaKey,
];

const getModulenavItems = (pathname: string): CurrentModuleContext | null => {
  const currentModule = getCurrentModule(pathname);
  if (!currentModule) return null;
  let modulenavItems = navigationItems.filter(
    (item) =>
      item.module === currentModule.id &&
      item.hub === currentModule.hub &&
      item.entity
  );
  return {
    id: currentModule.id,
    name: currentModule.name,
    hub: currentModule.hub,
    navItems: modulenavItems,
  };
};

// Function to get a deterministic icon for a category
const getCategoryIcon = (category: string, navItems?: NavItem[]) => {
  // If navItems is provided and the first item has a categoryIcon, use it
  if (navItems && navItems.length > 0 && navItems[0].categoryIcon) {
    const IconComponent = navItems[0].categoryIcon;
    return <IconComponent />;
  }

  // Otherwise, use a deterministic icon based on the category name
  const iconIndex =
    category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    REACT_ICONS.length;
  const IconComponent = REACT_ICONS[iconIndex];
  return <IconComponent />;
};

export default function MiniSidebarDrawer() {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [popoverAnchor, setPopoverAnchor] = useState<{
    element: HTMLElement;
    category: string;
  } | null>(null);
  const theme = useTheme();
  const pathname = usePathname();
  const currentModuleContext = useMemo(() => {
    return getModulenavItems(pathname);
  }, [pathname]);

  const { groupednavItems, sortedCategories, configurationItems } =
    useMemo(() => {
      if (!currentModuleContext)
        return {
          groupednavItems: {},
          sortedCategories: [],
          configurationItems: [],
        };

      const groups: Record<string, NavItem[]> = {};
      const configurationGroup: NavItem[] = [];

      currentModuleContext.navItems.forEach((NavItem) => {
        const groupKey = NavItem.category || UNCATEGORIZED_KEY;

        if (groupKey === CONFIGURATION_KEY) {
          configurationGroup.push(NavItem);
        } else {
          (groups[groupKey] ??= []).push(NavItem);
        }
      });

      let categories = Object.keys(groups);
      categories.sort((a, b) => {
        if (a === SETTINGS_KEY) return 1;
        if (b === SETTINGS_KEY) return -1;
        return a.localeCompare(b);
      });

      return {
        groupednavItems: groups,
        sortedCategories: categories,
        configurationItems: configurationGroup,
      };
    }, [currentModuleContext]);

  const toggleCategory = (category: string, event?: React.MouseEvent) => {
    if (!open && event) {
      setPopoverAnchor({
        element: event.currentTarget as HTMLElement,
        category,
      });
      return;
    }
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleAllCategories = () => {
    const allCategories = [...sortedCategories];
    if (configurationItems.length > 0) {
      allCategories.push(CONFIGURATION_KEY);
    }

    if (expandedCategories.size === allCategories.length) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(allCategories));
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const isPopoverOpen = Boolean(popoverAnchor);

  if (!currentModuleContext) return null;

  return (
    <Box
      sx={{
        width: open ? 280 : 64,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 48,
          }}
        >
          {open && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontSize: "1.1rem",
                pl: 1,
              }}
            >
              {currentModuleContext.name} {}
            </Typography>
          )}
          <Tooltip
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            placement="right"
          >
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Categories */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ py: 0 }}>
          {/* Regular Categories */}
          {sortedCategories.map((category) => {
            const navItems = groupednavItems[category];
            if (!navItems || navItems.length === 0) return null;
            return (
              <Box key={category}>
                <ListItem disablePadding>
                  <Tooltip
                    title={
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {category}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {navItems.length} item
                          {navItems.length !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    }
                    placement="right"
                    arrow
                    enterDelay={500}
                    leaveDelay={200}
                  >
                    <ListItemButton
                      onClick={(event) => toggleCategory(category, event)}
                      sx={{
                        minHeight: 48,
                        overflow: "hidden",
                        px: open ? 2 : 1.5,
                        justifyContent: open ? "initial" : "center",
                        position: "relative",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: "center",
                          color: theme.palette.primary.main,
                          position: "relative",
                        }}
                      >
                        {open && (
                          <Box
                            sx={{
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 24,
                              height: 24,
                            }}
                          >
                            {getCategoryIcon(category, navItems)}
                          </Box>
                        )}
                        {!open && (
                          <Box
                            sx={{
                              fontSize: "1.25rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                            }}
                          >
                            {getCategoryIcon(category, navItems)}
                            {navItems.length > 1 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: -1,
                                  right: -1,
                                  backgroundColor: theme.palette.error.main,
                                  color: theme.palette.error.contrastText,
                                  borderRadius: "50%",
                                  width: 15,
                                  height: 15,
                                  fontSize: "0.8rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {navItems.length > 9 ? "9+" : navItems.length}
                              </Box>
                            )}
                          </Box>
                        )}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {category}
                              </Typography>
                            }
                          />
                          {expandedCategories.has(category) ? (
                            <ExpandLess fontSize="small" />
                          ) : (
                            <ExpandMore fontSize="small" />
                          )}
                        </>
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                <Collapse
                  in={open && expandedCategories.has(category)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    }}
                  >
                    {navItems.map((NavItem) => (
                      <ModernSidebarListItem
                        key={NavItem.link}
                        NavItem={NavItem}
                        open={open}
                        nested
                      />
                    ))}
                  </List>
                </Collapse>
                {open && <Divider />}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Configuration Category - ALWAYS at the bottom with Expand All button */}
      <Box sx={{ mt: "auto" }}>
        {/* Configuration Category */}
        {configurationItems.length > 0 && (
          <Box key={CONFIGURATION_KEY}>
            <ListItem disablePadding>
              <Tooltip
                title={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {CONFIGURATION_KEY}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {configurationItems.length} item
                      {configurationItems.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                }
                placement="right"
                arrow
                enterDelay={500}
                leaveDelay={200}
              >
                <ListItemButton
                  onClick={(event) => toggleCategory(CONFIGURATION_KEY, event)}
                  sx={{
                    minHeight: 48,
                    overflow: "hidden",
                    px: open ? 2 : 1.5,
                    justifyContent: open ? "initial" : "center",
                    position: "relative",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      color: theme.palette.primary.main,
                      position: "relative",
                    }}
                  >
                    {open && (
                      <Box
                        sx={{
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                        }}
                      >
                        <FaCog />
                      </Box>
                    )}
                    {!open && configurationItems.length > 0 && (
                      <Box
                        sx={{
                          fontSize: "1.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <FaCog />
                        {configurationItems.length > 1 && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: -1,
                              right: -1,
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.error.contrastText,
                              borderRadius: "50%",
                              width: 15,
                              height: 15,
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {configurationItems.length > 9
                              ? "9+"
                              : configurationItems.length}
                          </Box>
                        )}
                      </Box>
                    )}
                  </ListItemIcon>

                  {/* This is the hover label you wanted - only for Configuration */}
                  {!open && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: "100%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        ml: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        boxShadow: 2,
                        opacity: 0,
                        transition: "all 0.2s ease",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        zIndex: theme.zIndex.tooltip,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: -6,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 0,
                          borderTop: "6px solid transparent",
                          borderBottom: "6px solid transparent",
                          borderRight: `6px solid ${theme.palette.divider}`,
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: -5,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderRight: `5px solid ${theme.palette.background.paper}`,
                        },
                      }}
                      className="category-label"
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: "0.75rem",
                        }}
                      >
                        {CONFIGURATION_KEY}
                      </Typography>
                    </Box>
                  )}

                  {open && (
                    <>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {CONFIGURATION_KEY}
                          </Typography>
                        }
                      />
                      {expandedCategories.has(CONFIGURATION_KEY) ? (
                        <ExpandLess fontSize="small" />
                      ) : (
                        <ExpandMore fontSize="small" />
                      )}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <Collapse
              in={open && expandedCategories.has(CONFIGURATION_KEY)}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                {configurationItems.map((NavItem) => (
                  <ModernSidebarListItem
                    key={NavItem.link}
                    NavItem={NavItem}
                    open={open}
                    nested
                  />
                ))}
              </List>
            </Collapse>
            {open && <Divider />}
          </Box>
        )}

        {/* Expand All Button - Always below Configuration */}
        {(sortedCategories.length > 1 || configurationItems.length > 0) && (
          <Box
            sx={{
              p: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            {open && (
              <ListItemButton
                onClick={toggleAllCategories}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.primary.main,
                        textAlign: "center",
                      }}
                    >
                      {expandedCategories.size ===
                      sortedCategories.length +
                        (configurationItems.length > 0 ? 1 : 0)
                        ? "Collapse All"
                        : "Expand All"}
                    </Typography>
                  }
                />
              </ListItemButton>
            )}
          </Box>
        )}
      </Box>

      <style jsx>{`
        .category-label {
          opacity: 0;
        }
        .MuiListItemButton-root:hover .category-label {
          opacity: 1;
        }
      `}</style>

      <Popover
        open={isPopoverOpen}
        anchorEl={popoverAnchor?.element}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            width: 280,
            maxHeight: 400,
            overflow: "auto",
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          },
        }}
      >
        {popoverAnchor && (
          <Box>
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  {getCategoryIcon(
                    popoverAnchor.category,
                    popoverAnchor.category === CONFIGURATION_KEY
                      ? configurationItems
                      : groupednavItems[popoverAnchor.category]
                  )}
                </Box>
                {popoverAnchor.category}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  ml: 4,
                }}
              >
                {popoverAnchor.category === CONFIGURATION_KEY
                  ? configurationItems.length
                  : groupednavItems[popoverAnchor.category]?.length || 0}{" "}
                items
              </Typography>
            </Box>
            <List sx={{ py: 1 }}>
              {(popoverAnchor.category === CONFIGURATION_KEY
                ? configurationItems
                : groupednavItems[popoverAnchor.category] || []
              ).map((NavItem) => (
                <ModernSidebarListItem
                  key={NavItem.link}
                  NavItem={NavItem}
                  open={true}
                  onClick={handlePopoverClose}
                />
              ))}
            </List>
          </Box>
        )}
      </Popover>
    </Box>
  );
}
