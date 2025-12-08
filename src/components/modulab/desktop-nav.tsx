"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  alpha,
  useTheme,
} from "@mui/material";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import { NestedDropdown, MenuItemData } from "mui-nested-menu";
import Logo from "./logo";
import { NavItem } from "@/components/nav-items/nav-items-utils";
import { navItems } from "@/components/nav-items/nav-links-index";

type SimpleNavObject = {
  id: string;
  name: string;
  emojie: string;
  link: string;
};
const activeNavitems = navItems.filter((item) => item.active === true);
interface Hub extends SimpleNavObject {}
interface Module extends SimpleNavObject {}
interface Entity extends SimpleNavObject {}

const EmojiIcon = ({ emoji }: { emoji: string }) => (
  <Box
    sx={{
      width: 20,
      height: 20,
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {emoji}
  </Box>
);

const transformactiveNavitemsToMenu = (
  items: NavItem[],
  onNavigate: (path: string) => void,
  currentHubName?: string
): MenuItemData => {
  const groupedByHub = items.reduce((acc, item) => {
    if (!acc[item.hub]) {
      acc[item.hub] = [];
    }
    acc[item.hub].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const hubItems: MenuItemData[] = Object.entries(groupedByHub).map(
    ([hub, hubactiveNavitems]) => {
      const hubEntry =
        hubactiveNavitems.find((item) => item.hub === hub && !item.module) ||
        hubactiveNavitems[0];

      const groupedByModule = hubactiveNavitems.reduce((acc, item) => {
        const moduleKey = item.module || "_NO_MODULE";
        if (!acc[moduleKey]) {
          acc[moduleKey] = [];
        }
        acc[moduleKey].push(item);
        return acc;
      }, {} as Record<string, NavItem[]>);

      const moduleItems: MenuItemData[] = Object.entries(groupedByModule)
        .filter(([key]) => key !== "_NO_MODULE")
        .map(([module, moduleactiveNavitems]) => {
          const moduleEntry =
            moduleactiveNavitems.find(
              (item) => item.module === module && !item.entity
            ) || moduleactiveNavitems[0];

          const entityItems: MenuItemData[] = moduleactiveNavitems
            .filter((item) => item.entity)
            .map((entityItem) => ({
              label: entityItem.name,
              leftIcon: <EmojiIcon emoji={entityItem.emojie} />,
              callback: () => onNavigate(entityItem.link),
            }));

          return {
            label: moduleEntry.name,
            leftIcon: <EmojiIcon emoji={moduleEntry.emojie} />,
            callback: () => onNavigate(moduleEntry.link),
            items: entityItems.length > 0 ? entityItems : undefined,
          };
        });

      return {
        label: hubEntry.name,
        leftIcon: <EmojiIcon emoji={hubEntry.emojie} />,
        callback: () => onNavigate(hubEntry.link),
        items: moduleItems.length > 0 ? moduleItems : undefined,
      };
    }
  );

  return {
    label: currentHubName || "Navigation",
    items: hubItems,
  };
};

interface DesktopNavProps {
  selectedHub: Hub | null;
  selectedModule: Module | null;
  selectedEntity: Entity | null;
  onSelectHub: (hub: Hub) => void;
  onSelectModule: (hub: Hub, module: Module) => void;
  onSelectEntity: (hub: Hub, module: Module, entity: Entity) => void;
  onNavigate: (path: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  selectedHub,
  selectedModule,
  selectedEntity,
  onSelectHub,
  onSelectModule,
  onSelectEntity,
  onNavigate,
}) => {
  const theme = useTheme();

  // Get current hub context for the menu label
  const currentHubContext = useMemo(() => {
    if (selectedHub) return selectedHub;

    const activeItem = selectedEntity || selectedModule;
    if (activeItem) {
      const matchingNavItem = activeNavitems.find(
        (item) =>
          item.link === activeItem.link ||
          item.module === activeItem.id ||
          item.entity === activeItem.id
      );
      if (matchingNavItem) {
        const hubEntry = activeNavitems.find(
          (item) => item.hub === matchingNavItem.hub && !item.module
        );
        if (hubEntry) {
          return {
            id: hubEntry.hub,
            name: hubEntry.name,
            emojie: hubEntry.emojie,
            link: hubEntry.link,
          } as Hub;
        }
      }
    }
    return null;
  }, [selectedHub, selectedModule, selectedEntity]);

  // Get current module context (even when only entity is selected)
  const currentModuleContext = useMemo(() => {
    if (selectedModule) return selectedModule;

    if (selectedEntity) {
      const matchingNavItem = activeNavitems.find(
        (item) => item.entity === selectedEntity.id
      );
      if (matchingNavItem && matchingNavItem.module) {
        const moduleEntry = activeNavitems.find(
          (item) =>
            item.module === matchingNavItem.module &&
            item.hub === matchingNavItem.hub &&
            !item.entity
        );
        if (moduleEntry) {
          return {
            id: moduleEntry.module,
            name: moduleEntry.name,
            emojie: moduleEntry.emojie,
            link: moduleEntry.link,
          } as Module;
        }
      }
    }
    return null;
  }, [selectedModule, selectedEntity]);

  const homeLink = activeNavitems.length > 0 ? activeNavitems[0].link : "/";

  const homeMenuItems: MenuItemData = useMemo(() => {
    return transformactiveNavitemsToMenu(
      activeNavitems,
      onNavigate,
      currentHubContext?.name
    );
  }, [onNavigate, currentHubContext]);

  const moduleMenuItems: MenuItemData = useMemo(() => {
    if (!currentModuleContext) return { label: "", items: [] };

    const moduleactiveNavitems = activeNavitems.filter(
      (item) => item.module === currentModuleContext.id && item.entity
    );

    const entityItems: MenuItemData[] = moduleactiveNavitems.map((item) => ({
      label: item.name,
      leftIcon: <EmojiIcon emoji={item.emojie} />,
      callback: () => onNavigate(item.link),
    }));

    return {
      label: currentModuleContext.name,
      items: entityItems,
    };
  }, [currentModuleContext, onNavigate]);

  const baseNavItemStyle = {
    display: "flex",
    alignItems: "center",
    px: 2,
    py: 1.5,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.9rem",
    transition: "background-color 0.2s, transform 0.2s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.action.hover, 0.05),
    },
  };

  const currentNavItemStyle = {
    ...baseNavItemStyle,
    cursor: "default",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "transparent",
    },
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "transparent",
        flex: 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: 0,
        }}
      >
        <Box
          sx={{
            px: 1,
            mx: 1,
            borderRight: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <Logo />
        </Box>
        <Box
          sx={{
            display: "flex",
            px: 2,
            m: 0,
            alignItems: "center",
            height: "100%",
            bgcolor: (theme) => theme.palette.background.paper,
            border: "none",
            boxShadow: 1,
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Home Navigation - Shows all hubs */}
          <NestedDropdown
            ButtonProps={{
              sx: {
                color: "text.primary",
                textTransform: "none",
              },
            }}
            menuItemsData={homeMenuItems}
          >
            <Link href={homeLink} passHref legacyBehavior>
              <Box sx={baseNavItemStyle}>
                <EmojiIcon emoji="🏠" />
                <Typography
                  sx={{ ml: 1.5, fontSize: "0.9rem", fontWeight: 500 }}
                >
                  Home
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{ ml: 0.5, fontSize: 18, opacity: 0.7 }}
                />
              </Box>
            </Link>
          </NestedDropdown>

          {/* Module Navigation - Show when we have a module context */}
          {currentModuleContext && (
            <NestedDropdown
              ButtonProps={{
                sx: {
                  color: "text.primary",
                  textTransform: "none",
                },
              }}
              menuItemsData={moduleMenuItems}
            >
              <Link href={currentModuleContext.link} passHref legacyBehavior>
                <Box sx={baseNavItemStyle}>
                  <EmojiIcon emoji={currentModuleContext.emojie || "📦"} />
                  <Typography
                    sx={{ ml: 1.5, fontSize: "0.9rem", fontWeight: 500 }}
                  >
                    {currentModuleContext.name}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{ ml: 0.5, fontSize: 18, opacity: 0.7 }}
                  />
                </Box>
              </Link>
            </NestedDropdown>
          )}

          {/* Entity Navigation - Show when we have an entity selected */}
          {selectedEntity && (
            <Link href={selectedEntity.link} passHref legacyBehavior>
              <Box sx={currentNavItemStyle}>
                <EmojiIcon emoji={selectedEntity.emojie || "📊"} />
                <Typography
                  sx={{
                    ml: 1.5,
                    fontSize: "0.9rem",
                    color: "text.primary",
                    fontWeight: 600,
                  }}
                >
                  {selectedEntity.name}
                </Typography>
              </Box>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DesktopNav;
