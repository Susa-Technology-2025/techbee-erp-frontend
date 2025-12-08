"use client";
import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/navigation';
import { NAVBAR_HEIGHT } from '@/theme/navbar-config';
import Logo from '@/components/app-bar/nav-logo';
import DashActions, { DashActionItems } from '@/components/dash-actions';
import { NavbarProps , NavbarItem} from './navbarTypes';


const Navbar: React.FC<NavbarProps> = ({
  items = [],
  leftItems = [],
  title,
  titleStyle,
  itemsPosition = 'center',
  showLogo = true,
  showDashActions = true,
  dashActions = { GlobalSearch: true, BackButton: true, ToggleTheme: true, AuthMenu: true },
  height = NAVBAR_HEIGHT,
}) => {
  const router = useRouter();
  const [dropdownAnchor, setDropdownAnchor] = useState<null | { idx: number; anchor: HTMLElement | null }>(null);

  const handleDropdownOpen = (idx: number, event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchor({ idx, anchor: event.currentTarget });
  };
  const handleDropdownClose = () => {
    setDropdownAnchor(null);
  };
  const handleNavigate = (link?: string) => {
    if (link) router.push(link);
    handleDropdownClose();
  };

  const renderItems = (items: NavbarItem[]) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
      {(Array.isArray(items) ? items : []).map((item, idx) => {
        const isDropdown = !!item.dropdown && item.dropdown.length > 0;
        const isOpen = dropdownAnchor && dropdownAnchor.idx === idx;
        return (
          <Box key={item.label} sx={{ position: 'relative' }}>
            {isDropdown ? (
              <Button
                endIcon={<KeyboardArrowDownIcon />}
                onClick={e => handleDropdownOpen(idx, e)}
                sx={{
                  color: isOpen ? 'primary.main' : 'text.primary',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  bgcolor: isOpen ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  fontSize: { xs: 14, md: 16 },
                }}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                onClick={() => handleNavigate(item.link)}
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  fontSize: { xs: 14, md: 16 },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {item.label}
              </Button>
            )}
            {isDropdown && (
              <Menu
                anchorEl={dropdownAnchor?.anchor}
                open={!!isOpen}
                onClose={handleDropdownClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: 4,
                    bgcolor: 'background.paper',
                  },
                }}
              >
                {item.dropdown!.map((sub, subIdx) => (
                  <MenuItem
                    key={sub.label}
                    onClick={() => handleNavigate(sub.link)}
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {sub.label}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        );
      })}
    </Box>
  );

  const shouldShowLogo = showLogo && !title;
  const shouldShowDashActions = showDashActions && itemsPosition !== 'right';

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 1, md: 4 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.paper',
        boxShadow: 2,
        position: 'relative',
        zIndex: 1000,
        maxHeight: height,
        overflow: 'hidden',
      }}
    >
      {/* Left: Logo, Title, or Items */}
      <Box sx={{ 
        flex: '0 1 auto', 
        display: 'flex', 
        alignItems: 'center', 
        minWidth: 48,
        gap: 2
      }}>
        {shouldShowLogo && <Logo />}
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: 18, md: 20 },
              ...titleStyle,
            }}
          >
            {title}
          </Typography>
        )}
        {leftItems.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {renderItems(leftItems)}
          </Box>
        )}
      </Box>
      
      {/* Center: Items (only when itemsPosition is 'center') */}
      {itemsPosition === 'center' && (
        <Box sx={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, overflow: 'hidden'}}>
          <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
            {renderItems(items)}
          </Box>
        </Box>
      )}
      
      {/* Right: DashActions or Items (when itemsPosition is 'right') */}
      <Box sx={{ 
        flex: '0 1 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        minWidth: 48,
        marginRight: itemsPosition === 'right' ? 0 : 7 
      }}>
        {itemsPosition === 'right' ? (
          renderItems(items)
        ) : (
          shouldShowDashActions && <DashActions {...dashActions} />
        )}
      </Box>
    </Box>
  );
};

export default Navbar; 