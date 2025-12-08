"use client";
import React, { useMemo } from "react";
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
import { Modulab, modulabs } from "./permissions";
type SimpleNavObject = {
  id: string;
  name: string;
  emojie: string;
  link?: string;
};
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
const transformModulabsToMenu = (
  items: Modulab[],
  onNavigate: (path: string) => void
): MenuItemData => {
  const groupedByHub = items.reduce((acc, item) => {
    if (!acc[item.hub]) {
      acc[item.hub] = [];
    }
    acc[item.hub].push(item);
    return acc;
  }, {} as Record<string, Modulab[]>);
  const hubItems: MenuItemData[] = Object.entries(groupedByHub).map(
    ([hub, hubModulabs]) => {
      const hubEntry =
        hubModulabs.find((item) => item.hub === hub && !item.module) ||
        hubModulabs[0];
      const groupedByModule = hubModulabs.reduce((acc, item) => {
        const moduleKey = item.module || "_NO_MODULE";
        if (!acc[moduleKey]) {
          acc[moduleKey] = [];
        }
        acc[moduleKey].push(item);
        return acc;
      }, {} as Record<string, Modulab[]>);
      const moduleItems: MenuItemData[] = Object.entries(groupedByModule)
        .filter(([key]) => key !== "_NO_MODULE")
        .map(([module, moduleModulabs]) => {
          const moduleEntry =
            moduleModulabs.find(
              (item) => item.module === module && !item.entity
            ) || moduleModulabs[0];
          const entityItems: MenuItemData[] = moduleModulabs
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
    label: "Root Navigation",
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
  onNavigate,
}) => {
  const theme = useTheme();
  const homeMenuItems: MenuItemData = useMemo(() => {
    return transformModulabsToMenu(modulabs, onNavigate);
  }, [onNavigate]);
  const hubMenuItems: MenuItemData = useMemo(() => {
    if (!selectedHub) return { label: "", items: [] };
    const hubModulabs = modulabs.filter((item) => item.hub === selectedHub.id);
    const transformed = transformModulabsToMenu(hubModulabs, onNavigate);
    return {
      label: selectedHub.name,
      items: transformed.items,
    };
  }, [selectedHub, onNavigate]);
  const moduleMenuItems: MenuItemData = useMemo(() => {
    if (!selectedModule) return { label: "", items: [] };
    const moduleModulabs = modulabs.filter(
      (item) =>
        item.hub === selectedHub?.id &&
        item.module === selectedModule.id &&
        item.entity
    );
    const entityItems: MenuItemData[] = moduleModulabs.map((item) => ({
      label: item.name,
      leftIcon: <EmojiIcon emoji={item.emojie} />,
      callback: () => onNavigate(item.link),
    }));
    return {
      label: selectedModule.name,
      items: entityItems,
    };
  }, [selectedHub, selectedModule, onNavigate]);
  const baseNavItemStyle = {
    display: "flex",
    alignItems: "center",
    px: 2,
    py: 1.5,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.9rem",
  };
  const currentNavItemStyle = {
    ...baseNavItemStyle,
    cursor: "default",
    fontWeight: 600,
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
          {}
          <NestedDropdown
            ButtonProps={{
              sx: {
                color: "text.primary",
                textTransform: "none",
              },
            }}
            menuItemsData={{
              label: "Home",
              items: homeMenuItems.items,
            }}
          >
            <Box sx={baseNavItemStyle}>
              <EmojiIcon emoji="🏠" />
              <Typography sx={{ ml: 1.5, fontSize: "0.9rem", fontWeight: 500 }}>
                Home
              </Typography>
              <KeyboardArrowDownIcon
                sx={{ ml: 0.5, fontSize: 18, opacity: 0.7 }}
              />
            </Box>
          </NestedDropdown>
          {}
          {selectedHub &&
            hubMenuItems.items &&
            hubMenuItems.items.length > 0 && (
              <NestedDropdown
                ButtonProps={{
                  sx: {
                    color: "text.primary",
                    textTransform: "none",
                  },
                }}
                menuItemsData={hubMenuItems}
              >
                <Box sx={baseNavItemStyle}>
                  <EmojiIcon emoji={selectedHub.emojie || "🏢"} />
                  <Typography
                    sx={{ ml: 1.5, fontSize: "0.9rem", fontWeight: 500 }}
                  >
                    {selectedHub.name}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{ ml: 0.5, fontSize: 18, opacity: 0.7 }}
                  />
                </Box>
              </NestedDropdown>
            )}
          {}
          {selectedModule &&
            moduleMenuItems.items &&
            moduleMenuItems.items.length > 0 && (
              <NestedDropdown
                ButtonProps={{
                  sx: {
                    color: "text.primary",
                    textTransform: "none",
                  },
                }}
                menuItemsData={moduleMenuItems}
              >
                <Box sx={baseNavItemStyle}>
                  <EmojiIcon emoji={selectedModule.emojie || "📦"} />
                  <Typography
                    sx={{ ml: 1.5, fontSize: "0.9rem", fontWeight: 500 }}
                  >
                    {selectedModule.name}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{ ml: 0.5, fontSize: 18, opacity: 0.7 }}
                  />
                </Box>
              </NestedDropdown>
            )}
          {}
          {selectedEntity && (
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
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default DesktopNav;
