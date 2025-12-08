import { AppBar, Toolbar, Stack, Box, Grid } from "@mui/material";
import { navbarLinks } from "@/lib/constants/navbar-links";
import AuthMenu from "./auth-menu";
import SelectLanguage from "../select-language";
import ToogleTheme from "../../theme/toogle-theme";
import Logo from "./nav-logo";
import LoginRegister from "./login-register";
import ActiveLink from "./avtive-link";
import { session } from "@/lib/auth/session";
import GlobalSearch from "../global-search/GlobalSearch";

export default async function DesktopNavbar() {
  const { loggedIn } = await session();
  return (
    <AppBar
      sx={{
        backgroundColor: "background.paper",
        display: { xs: "none", lg: "block" },
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(8px)",
        zIndex: 1500,
      }}
    >
      <Toolbar
        sx={{
          mx: "auto",
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "60px",
        }}
      >
        <Logo />

        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {navbarLinks.map((link, index) => (
            <Box key={index}>
              <ActiveLink href={link.href}>{link.label}</ActiveLink>
            </Box>
          ))}
        </Stack>

        <Grid
          container
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{
            flexWrap: "nowrap",
            overflow: "auto",
            scrollbarWidth: "none",
          }}
        >
          {loggedIn && <GlobalSearch />}
          <ToogleTheme />
          {/* <SelectLanguage /> */}
          {!loggedIn ? <LoginRegister /> : <AuthMenu />}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
