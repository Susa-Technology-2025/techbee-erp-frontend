import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { Box } from "@mui/material";

const drawerWidth = 240;

const drawerTransition = (theme: Theme, duration: number) =>
  theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration,
  });

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: drawerTransition(
    theme,
    theme.transitions.duration.enteringScreen
  ),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: `calc(${theme.spacing(7)} + 1px)`,
  transition: drawerTransition(theme, theme.transitions.duration.leavingScreen),
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled(Box)(({ theme }) => ({
  ...theme.mixins.toolbar,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  backgroundColor: theme.palette.backgroundSection.main,
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const mixin = open ? openedMixin(theme) : closedMixin(theme);
  return {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...mixin,
    "& .MuiDrawer-paper": mixin,
  };
});
