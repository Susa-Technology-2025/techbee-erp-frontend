import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: `"Ubuntu", "Segoe UI", sans-serif`,
};

export const themes = {
  blue: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#2196f3" },
      secondary: { main: "#03a9f4" },
      section: {
        main: "#0b579f",
        contrastText: "#ffffff",
        light: "#64b5f6",
        dark: "#115293",
      },
      backgroundSection: {
        main: "#f0f7ff",
        contrastText: "#0d0d0d",
        light: "#e1efff",
        dark: "#a3c2ff",
      },
      cardHeaderStart: "#f8fafc",
      cardHeaderEnd: "#f1f5f9",
    },
  }),
  red: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#f44336" },
      secondary: { main: "#ef5350" },
      section: {
        main: "#c62828",
        contrastText: "#ffffff",
        light: "#ef5350",
        dark: "#8e0000",
      },
      backgroundSection: {
        main: "#ffebee",
        contrastText: "#0d0d0d",
        light: "#ffcdd2",
        dark: "#d32f2f",
      },
    },
  }),
  green: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#4caf50" },
      secondary: { main: "#81c784" },
      section: {
        main: "#2e7d32",
        contrastText: "#ffffff",
        light: "#66bb6a",
        dark: "#1b5e20",
      },
      backgroundSection: {
        main: "#e8f5e9",
        contrastText: "#0d0d0d",
        light: "#c8e6c9",
        dark: "#388e3c",
      },
    },
  }),
  purple: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#9c27b0" },
      secondary: { main: "#ba68c8" },
      section: {
        main: "#4A2368",
        contrastText: "#ffffff",
        light: "#ab47bc",
        dark: "#4a0072",
      },
      backgroundSection: {
        main: "#f3e5f5",
        contrastText: "#0d0d0d",
        light: "#e1bee7",
        dark: "#8e24aa",
      },
    },
  }),
  orange: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#ff9800" },
      secondary: { main: "#ffb74d" },
      section: {
        main: "#ef6c00",
        contrastText: "#ffffff",
        light: "#ffa726",
        dark: "#e65100",
      },
      backgroundSection: {
        main: "#fff3e0",
        contrastText: "#0d0d0d",
        light: "#ffe0b2",
        dark: "#fb8c00",
      },
    },
  }),
  pink: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#e91e63" },
      secondary: { main: "#f06292" },
      section: {
        main: "#ad1457",
        contrastText: "#ffffff",
        light: "#f48fb1",
        dark: "#880e4f",
      },
      backgroundSection: {
        main: "#fce4ec",
        contrastText: "#0d0d0d",
        light: "#f8bbd0",
        dark: "#d81b60",
      },
    },
  }),
  teal: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#009688" },
      secondary: { main: "#4db6ac" },
      section: {
        main: "#00695c",
        contrastText: "#ffffff",
        light: "#26a69a",
        dark: "#004d40",
      },
      backgroundSection: {
        main: "#e0f2f1",
        contrastText: "#0d0d0d",
        light: "#b2dfdb",
        dark: "#00796b",
      },
    },
  }),
  indigo: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#3f51b5" },
      secondary: { main: "#7986cb" },
      section: {
        main: "#283593",
        contrastText: "#ffffff",
        light: "#5c6bc0",
        dark: "#1a237e",
      },
      backgroundSection: {
        main: "#e8eaf6",
        contrastText: "#0d0d0d",
        light: "#c5cae9",
        dark: "#3949ab",
      },
    },
  }),
  cyan: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#00bcd4" },
      secondary: { main: "#4dd0e1" },
      section: {
        main: "#00838f",
        contrastText: "#ffffff",
        light: "#4dd0e1",
        dark: "#006064",
      },
      backgroundSection: {
        main: "#e0f7fa",
        contrastText: "#0d0d0d",
        light: "#b2ebf2",
        dark: "#00acc1",
      },
    },
  }),
  dark: createTheme({
    typography: baseTypography,
    palette: {
      mode: "dark",
      primary: { main: "#1e88e5" },
      secondary: { main: "#90caf9" },
      section: {
        main: "#1E3A8A",
        contrastText: "#E0E7FF",
        light: "#3B4CCA",
        dark: "#142661",
      },
      backgroundSection: {
        main: "#0d1443",
        contrastText: "#f0f7ff",
        light: "#1a237e",
        dark: "#000a54",
      },
      cardHeaderStart: "#1a1a1a",
      cardHeaderEnd: "#2d2d2d",
    },
  }),
  sunset: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#ff7043" }, // deep orange
      secondary: { main: "#ffb74d" }, // light orange
      section: {
        main: "#ff8a65",
        contrastText: "#fff3e0",
        light: "#ffd180",
        dark: "#d84315",
      },
      backgroundSection: {
        main: "#fff3e0",
        contrastText: "#4e342e",
        light: "#ffe0b2",
        dark: "#ff7043",
      },
    },
  }),
  aqua: createTheme({
    typography: baseTypography,
    palette: {
      mode: "light",
      primary: { main: "#00bcd4" }, // cyan
      secondary: { main: "#4dd0e1" }, // light cyan
      section: {
        main: "#26c6da",
        contrastText: "#e0f7fa",
        light: "#b2ebf2",
        dark: "#00838f",
      },
      backgroundSection: {
        main: "#e0f7fa",
        contrastText: "#006064",
        light: "#b2ebf2",
        dark: "#00acc1",
      },
    },
  }),
};

export type ThemeName = keyof typeof themes;
