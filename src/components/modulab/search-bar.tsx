"use client";
import { NavItem } from "@/components/nav-items/nav-items-utils";
import { navigationItems } from "@/components/nav-items/nav-items-utils";
import React, { useState, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  alpha,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";

const navItems = navigationItems.filter((item) => item.active === true);
export const searchNavItems = (query: string): NavItem[] => {
  if (!query.trim()) return [];
  const searchTerm = query.toLowerCase().trim();
  const results: NavItem[] = [];
  navItems.forEach((item) => {
    const isMatch =
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm)) ||
      item.link.toLowerCase().includes(searchTerm);
    if (isMatch) {
      results.push(item);
    }
  });
  return results.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase() === searchTerm;
    const bNameMatch = b.name.toLowerCase() === searchTerm;
    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;
    return a.name.localeCompare(b.name);
  });
};
interface SearchResultItemProps {
  result: NavItem;
  onNavigate: () => void;
  getColor: () => string;
}
const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onNavigate,
  getColor,
}) => {
  const theme = useTheme();
  const isDisabled = result.active === false;
  const itemColor = getColor();
  const simpleBreadcrumb = [
    result.hub,
    result.module,
    result.category,
    result.entity,
  ].filter((part): part is string => !!part);
  return (
    <ListItemButton
      component={isDisabled ? "div" : Link}
      href={isDisabled ? undefined : result.link}
      onClick={isDisabled ? undefined : onNavigate}
      disabled={isDisabled}
      sx={{
        borderRadius: 2,
        mb: 1,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.paper,
          0.8
        )} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(itemColor, 0.3),
          ...(!isDisabled && {
            background: `linear-gradient(135deg, ${alpha(
              itemColor,
              0.05
            )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          }),
        },
        "&:last-child": {
          mb: 0,
        },
        "&.Mui-disabled": {
          opacity: 0.6,
          background: alpha(theme.palette.action.disabled, 0.1),
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ minWidth: 48, mr: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(itemColor, 0.1),
            color: itemColor,
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {result.emojie}
        </Box>
      </Box>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Typography variant="subtitle1" fontWeight="600" noWrap>
              {result.name}
            </Typography>
            {isDisabled && (
              <Chip
                label="On Development"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.warning.main,
                  color: theme.palette.warning.main,
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {result.description}
            </Typography>
            {simpleBreadcrumb.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {simpleBreadcrumb.join(" › ")}
              </Typography>
            )}
          </Box>
        }
      />
      <Box sx={{ minWidth: 32, color: "text.secondary" }}>
        <LaunchIcon fontSize="small" />
      </Box>
    </ListItemButton>
  );
};
interface SearchDialogOnlyProps {
  open: boolean;
  onClose: () => void;
}
const SearchDialog: React.FC<SearchDialogOnlyProps> = ({ open, onClose }) => {
  const [inputValue, setInputValue] = useState("");
  const deferredQuery = useDeferredValue(inputValue);
  const theme = useTheme();
  const searchResults = useMemo(() => {
    return searchNavItems(deferredQuery);
  }, [deferredQuery]);
  const handleNavigation = () => {
    onClose();
    setInputValue("");
  };
  const getConsistentColor = () => theme.palette.primary.main;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
          backdropFilter: "blur(20px)",
          minHeight: "60vh",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.02
          )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="600">
            Search Navigation
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          {}
          <TextField
            placeholder="Search navigation links..."
            variant="outlined"
            fullWidth
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>
        {}
        <Box sx={{ px: 3, pb: 3, maxHeight: "45vh", overflowY: "auto" }}>
          {inputValue ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} for "{deferredQuery}"
              {inputValue !== deferredQuery && (
                <Chip
                  label="Searching..."
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Start typing to search available navigation links...
            </Typography>
          )}
          {deferredQuery && searchResults.length === 0 && (
            <Box
              textAlign="center"
              py={8}
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.5
                )} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                borderRadius: 2,
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: 48,
                  color: theme.palette.text.disabled,
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try different keywords or check for typos
              </Typography>
            </Box>
          )}
          {searchResults.length > 0 && (
            <List sx={{ p: 0 }}>
              {searchResults.map((result) => (
                <SearchResultItem
                  key={result.link}
                  result={result}
                  onNavigate={handleNavigation}
                  getColor={getConsistentColor}
                />
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
interface GlobalSearchProps {
  buttonProps?: React.ComponentProps<typeof IconButton>;
}
export const GlobalSearch: React.FC<GlobalSearchProps> = ({ buttonProps }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Search"
        size="large"
        {...buttonProps}
      >
        <SearchIcon />
      </IconButton>
      <SearchDialog open={open} onClose={handleClose} />
    </>
  );
};
export default GlobalSearch;
