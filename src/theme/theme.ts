"use client";
import { extendTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    section: Palette["primary"];
    backgroundSection: Palette["primary"];
    cardHeader: Palette["primary"];
    cardHeaderStart: string;
    cardHeaderEnd: string;
  }
  interface PaletteOptions {
    section?: PaletteOptions["primary"];
    backgroundSection?: PaletteOptions["primary"];
    cardHeader?: PaletteOptions["primary"];
    cardHeaderStart?: string;
    cardHeaderEnd?: string;
  }
}

export const theme = extendTheme({
  typography: {
    fontFamily: [
      '"Ubuntu"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  colorSchemes: {
    light: {
      palette: {
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
      },
    },
    dark: {
      palette: {
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
      },
    },
  },

  colorSchemeSelector: "class",
});
