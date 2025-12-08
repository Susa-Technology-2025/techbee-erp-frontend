"use client"
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Collapse,
  Button,
  Avatar,
  Chip,
  useTheme,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { SidebarItem } from './sidebarTypes';
import { useRouter } from 'next/navigation';



interface SidebarProps {
  items?: SidebarItem[];
  bottomItems?: SidebarItem[];
  navbarHeight?: number; // px, default 0
}

const Sidebar: React.FC<SidebarProps> = ({ items = [], bottomItems = [], navbarHeight = 0 }) => {
  const theme = useTheme();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  // --- Floating menu stack for cascading menus ---
  const [floatingMenuStack, setFloatingMenuStack] = useState<Array<{
    open: boolean;
    top: number;
    left: number;
    title: string;
    children: SidebarItem[];
    parentKey: string | null;
  }>>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const floatingMenuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // Track refs for floating menu items at each level
  const floatingMenuItemRefs = useRef<Array<{ [key: string]: HTMLDivElement | null }>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const popoverCloseTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleToggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to open a new floating menu at the correct position (for cascading menus)
  const openFloatingMenuCascading = (item: SidebarItem, key: string, level: number) => {
    // Find the parent menu for this level
    let parentMenu: HTMLDivElement | null = null;
    let itemRef: HTMLDivElement | null = null;
    if (level === 0) {
      parentMenu = sidebarRef.current;
      itemRef = iconRefs.current[key] || null;
    } else {
      parentMenu = floatingMenuRefs.current[level - 1];
      floatingMenuItemRefs.current[level - 1] = floatingMenuItemRefs.current[level - 1] || {};
      itemRef = floatingMenuItemRefs.current[level - 1][key] || null;
    }
    if (!parentMenu || !itemRef) return;
    const parentRect = parentMenu.getBoundingClientRect();
    const itemRect = itemRef.getBoundingClientRect();
    // Position submenu to the right of the parent menu container, aligned with the hovered item
    const left = parentRect.left + parentRect.width;
    const top = itemRect.top;
    setFloatingMenuStack(prev => [
      ...prev.slice(0, level),
      {
        open: true,
        top,
        left,
        title: item.label,
        children: item.children || [],
        parentKey: key,
      },
    ]);
  };

  // Helper to close floating menus from a certain level
  const closeFloatingMenuFromLevel = (level: number) => {
    setFloatingMenuStack(prev => prev.slice(0, level));
  };

  // Animate the floating menu's top position
  useLayoutEffect(() => {
    floatingMenuStack.forEach((menu, idx) => {
      if (!menu.open || !floatingMenuRefs.current[idx]) return;
      floatingMenuRefs.current[idx]!.style.transition = 'top 0.2s cubic-bezier(0.4,0,0.2,1)';
      floatingMenuRefs.current[idx]!.style.top = `${menu.top}px`;
    });
  }, [floatingMenuStack]);

  // Close all floating menus when clicking outside
  useEffect(() => {
    if (!collapsed || floatingMenuStack.length === 0) return;
    function handleDocumentClick(e: MouseEvent) {
      const sidebar = sidebarRef.current;
      const menus = floatingMenuRefs.current.slice(0, floatingMenuStack.length);
      if (
        sidebar && !sidebar.contains(e.target as Node) &&
        menus.every(menu => menu && !menu.contains(e.target as Node))
      ) {
        setFloatingMenuStack([]);
      }
    }
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [collapsed, floatingMenuStack.length]);

  const renderItems = (items: SidebarItem[], depth = 0) => (
    items.map((item, idx) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const isOpen = !!openSections[item.key];
      const isActive = item.isActive ?? false;
      const itemBox = (
        <Box
          ref={el => {
            if (hasChildren) iconRefs.current[item.key] = el as HTMLDivElement | null;
            itemRefs.current[idx] = el as HTMLDivElement | null;
          }}
          tabIndex={0}
          role="menuitem"
          aria-haspopup={hasChildren ? 'true' : undefined}
          aria-expanded={hasChildren ? (collapsed ? floatingMenuStack.some(m => m.parentKey === item.key) : isOpen) : undefined}
          onClick={
            collapsed && hasChildren
              ? () => {
                  // Open first-level floating menu or close if already open
                  if (floatingMenuStack.length > 0 && floatingMenuStack[0].parentKey === item.key) {
                    setFloatingMenuStack([]);
                  } else {
                    openFloatingMenuCascading(item, item.key, 0);
                  }
                }
              : () => {
                  if (collapsed && floatingMenuStack.length > 0) setFloatingMenuStack([]);
                  if (hasChildren) {
                    handleToggleSection(item.key);
                  } else if (item.href) {
                    router.push(item.href);
                    setFloatingMenuStack([]);
                  } else {
                    item.onClick?.();
                    setFloatingMenuStack([]);
                  }
                }
          }
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (collapsed && hasChildren) {
                if (floatingMenuStack.length > 0 && floatingMenuStack[0].parentKey === item.key) {
                  setFloatingMenuStack([]);
                } else {
                  openFloatingMenuCascading(item, item.key, 0);
                }
              } else if (hasChildren) {
                handleToggleSection(item.key);
              } else if (item.href) {
                router.push(item.href);
                setFloatingMenuStack([]);
              } else {
                item.onClick?.();
                setFloatingMenuStack([]);
              }
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setFocusedIndex(i => (i === null ? 0 : Math.min(i + 1, items.length - 1)));
              itemRefs.current[Math.min((focusedIndex ?? 0) + 1, items.length - 1)]?.focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setFocusedIndex(i => (i === null ? 0 : Math.max(i - 1, 0)));
              itemRefs.current[Math.max((focusedIndex ?? 0) - 1, 0)]?.focus();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '90%',
            borderRadius: 2,
            transition: 'background 0.2s',
            cursor: hasChildren || item.onClick ? 'pointer' : 'default',
            '&:hover, &:focus': {
              backgroundColor: theme.palette.action.hover,
              outline: 'none',
              color: theme.palette.primary.main,
              '& svg': { color: theme.palette.primary.main },
            },
            mb: 0.5,
            minHeight: 40,
            pl: collapsed ? 0 : 2 + depth * 2,
            fontWeight: hasChildren ? 600 : 400,
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            bgcolor: isActive ? theme.palette.action.selected : (hasChildren && isOpen ? 'rgba(0,0,0,0.04)' : 'transparent'),
            justifyContent: collapsed ? 'center' : 'flex-start',
            position: 'relative',
            borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
          }}
        >
          <Box
            sx={{
              width: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            <Box sx={{ width: 24, display: 'flex', justifyContent: 'center', color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}>{item.icon}</Box>
          </Box>
          {!collapsed && <Typography variant="body2" sx={{ flex: 1, whiteSpace: 'nowrap', color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}>{item.label}</Typography>}
          {hasChildren && !collapsed && (
            isOpen ? <ExpandLessIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} /> : <ExpandMoreIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
          )}
        </Box>
      );
      return (
        <React.Fragment key={item.key}>
          {collapsed ? (
            <Tooltip title={item.label} placement="right">
              {itemBox}
            </Tooltip>
          ) : itemBox}
          {hasChildren && !collapsed && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              {renderItems(item.children!, depth + 1)}
            </Collapse>
          )}
        </React.Fragment>
      );
    })
  );

  // --- Recursive floating menu rendering for collapsed mode ---
  const renderFloatingMenus = () => (
    floatingMenuStack.map((menu, level) => (
      <Box
        key={level}
        ref={(el: HTMLDivElement | null) => {
          floatingMenuRefs.current[level] = el;
        }}
        role="menu"
        aria-label={menu.title}
        sx={{
          position: 'fixed',
          left: menu.left,
          top: menu.top,
          zIndex: 2000 + level,
          minWidth: 220,
          bgcolor: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
          boxShadow: 8,
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'top 0.2s cubic-bezier(0.4,0,0.2,1)',
        }}
        // Prevent closing when mouse enters the menu
        onMouseEnter={() => {
          if (popoverCloseTimeout.current) {
            clearTimeout(popoverCloseTimeout.current);
            popoverCloseTimeout.current = null;
          }
        }}
        // Delay closing when mouse leaves the menu, only close the child submenu
        onMouseLeave={() => {
          popoverCloseTimeout.current = setTimeout(() => {
            closeFloatingMenuFromLevel(level + 1);
          }, 200);
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: theme.palette.text.secondary, letterSpacing: 1 }}>
          {menu.title.toUpperCase()}
        </Typography>
        {menu.children.map((child, cidx) => {
          const hasChildren = Array.isArray(child.children) && child.children.length > 0;
          return (
            <Box
              key={child.key}
              tabIndex={0}
              role="menuitem"
              ref={el => {
                floatingMenuItemRefs.current[level] = floatingMenuItemRefs.current[level] || {};
                floatingMenuItemRefs.current[level][child.key] = el as HTMLDivElement | null;
              }}
              onClick={() => {
                if (hasChildren) {
                  openFloatingMenuCascading(child, child.key, level + 1);
                } else if (child.href) {
                  router.push(child.href);
                  setFloatingMenuStack([]);
                } else {
                  child.onClick?.();
                  setFloatingMenuStack([]);
                }
              }}
              onMouseEnter={() => {
                if (hasChildren) {
                  openFloatingMenuCascading(child, child.key, level + 1);
                } else {
                  closeFloatingMenuFromLevel(level + 1);
                }
                if (popoverCloseTimeout.current) {
                  clearTimeout(popoverCloseTimeout.current);
                  popoverCloseTimeout.current = null;
                }
              }}
              onMouseLeave={() => {
                if (!hasChildren) {
                  popoverCloseTimeout.current = setTimeout(() => {
                    closeFloatingMenuFromLevel(level + 1);
                  }, 200);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (hasChildren) {
                    openFloatingMenuCascading(child, child.key, level + 1);
                  } else if (child.href) {
                    router.push(child.href);
                    setFloatingMenuStack([]);
                  } else {
                    child.onClick?.();
                    setFloatingMenuStack([]);
                  }
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const next = floatingMenuRefs.current[level]?.querySelectorAll('[role="menuitem"]')[cidx + 1] as HTMLElement;
                  next?.focus();
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  const prev = floatingMenuRefs.current[level]?.querySelectorAll('[role="menuitem"]')[cidx - 1] as HTMLElement;
                  prev?.focus();
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  closeFloatingMenuFromLevel(level);
                  if (level > 0) {
                    // Focus parent menu item
                    const parentMenu = floatingMenuRefs.current[level - 1];
                    const parentIdx = menu.parentKey ? menu.children.findIndex(i => i.key === menu.parentKey) : 0;
                    const el = parentMenu?.querySelectorAll('[role="menuitem"]')[parentIdx] as HTMLElement | undefined;
                    el?.focus();
                  }
                }
              }}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                fontWeight: 600,
                color: theme.palette.text.primary,
                '&:hover, &:focus': {
                  backgroundColor: theme.palette.action.hover,
                  outline: 'none',
                },
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {child.label}
              {hasChildren && <ExpandMoreIcon fontSize="small" sx={{ color: theme.palette.text.secondary, ml: 1 }} />}
            </Box>
          );
        })}
      </Box>
    ))
  );

  return (
    <Box
      ref={sidebarRef}
      role="menu"
      onClick={e => {
        if (e.target === sidebarRef.current) {
          setFloatingMenuStack([]);
        }
      }}
      sx={{
        position: 'fixed',
        top: navbarHeight + 10,
        height: navbarHeight ? `calc(100vh - ${navbarHeight}px)` : '100vh',
        width: collapsed ? 56 : 260,
        bgcolor: theme.palette.background.paper,
        borderBottomRightRadius: 16,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s',
      }}
    >
      {/* Collapse Toggle */}
      <Box
        onClick={() => setCollapsed((prev) => !prev)}
        sx={{
          cursor: 'pointer',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-end',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {collapsed ? (
          <MenuIcon sx={{ color: 'text.primary' }} />
        ) : (
          <ChevronLeftIcon sx={{ color: 'text.primary' }} />
        )}
      </Box>
      {/* Header */}
      {!collapsed && (
        <Box sx={{ p: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, background: 'url(/images/Susa.png) no-repeat center center', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',  height: 100 }}>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginLeft: 2 }}>
            <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>{user.name[0]}</Avatar>
            <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
          </Box> */}
          {/* <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600 }}
            fullWidth
          >
            <Box sx={{ flex: 1, textAlign: 'left' }}>Get Started</Box>
            <Typography variant="caption" color="text.secondary">0% complete</Typography>
          </Button> */}
        </Box>
      )}
      {!collapsed && <Divider sx={{ my: 1 }} />}
      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        {renderItems(items)}
        {!collapsed && <Divider sx={{ my: 2 }} />}
      </Box>
      {/* Bottom Section */}
      <Box sx={{ pb: 2, mt: 'auto' }}>
        {renderItems(bottomItems)}
      </Box>
      {/* Cascading Floating Menus for Collapsed Parent Items */}
      {collapsed && floatingMenuStack.length > 0 && renderFloatingMenus()}
    </Box>
  );
};

export default Sidebar; 