"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { themes, ThemeName } from "./themes";

const ThemeContext = createContext<{
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}>({
  themeName: "purple",
  setThemeName: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: ThemeName;
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  const changeTheme = (name: ThemeName) => {
    setThemeName(name);
    const isSecure =
      typeof window !== "undefined" && window.location.protocol === "https:";

    document.cookie = `theme=${name}; path=/; SameSite=Lax${
      isSecure ? "; Secure" : ""
    }`;
  };

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName: changeTheme }}>
      <MuiThemeProvider theme={themes[themeName]}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
