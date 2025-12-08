"use client";

import * as React from "react";
import {
  IconButton,
  Popper,
  Paper,
  Box,
  ClickAwayListener,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { useThemeContext } from "@/theme";
import { useTheme } from "@mui/material/styles";

const themeList = [
  "purple",
  "blue",
  "red",
  "green",
  "orange",
  "pink",
  "teal",
  "indigo",
  "cyan",
  "dark",
] as const;

type ThemeName = (typeof themeList)[number];

const themeColors: Record<ThemeName, string> = {
  purple: "#7b1fa2",
  blue: "#1976d2",
  red: "#d32f2f",
  green: "#388e3c",
  orange: "#f57c00",
  pink: "#e91e63",
  teal: "#00796b",
  indigo: "#3f51b5",
  cyan: "#00acc1",
  dark: "#212121",
};

export default function ToggleTheme() {
  const { themeName, setThemeName } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (theme: ThemeName) => {
    setThemeName(theme);
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: "relative" }}>
        <Tooltip title="Change theme">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              color: "text.primary",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            aria-label="Toggle theme"
          >
            <PaletteIcon fontSize={"medium"} />
          </IconButton>
        </Tooltip>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{ zIndex: theme.zIndex.tooltip }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 2,
              borderRadius: 3,
              minWidth: 200,
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              Choose Theme
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 1,
              }}
            >
              {themeList.map((theme) => (
                <IconButton
                  key={theme}
                  onClick={() => handleSelect(theme)}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: themeColors[theme],
                    cursor: "pointer",
                    border:
                      theme === themeName
                        ? "3px solid white"
                        : "1px solid rgba(255,255,255,0.2)",
                    boxShadow:
                      theme === themeName
                        ? `0 0 0 2px ${themeColors[theme]}`
                        : "none",
                    "&:hover": {
                      backgroundColor: themeColors[theme],
                      border: "3px solid white",
                      boxShadow: `0 0 0 2px ${themeColors[theme]}`,
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
