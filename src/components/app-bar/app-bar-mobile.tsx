"use client";
import { useEffect, useState } from "react";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { navbarLinks } from "@/lib/constants/navbar-links";
import AuthMenu from "./auth-menu";
import SelectLanguage from "../select-language";
import ToogleTheme from "../../theme/toogle-theme";
import LoginRegister from "./login-register-mobile";
import Link from "next/link";
import Logo from "./nav-logo";
import { useTranslation } from "react-i18next";
import { session } from "@/lib/auth/session";
import GlobalSearch from "../global-search/GlobalSearch";

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [loged, setLoged] = useState(false);
  const toggleDrawer = () => setOpen((prev) => !prev);
  useEffect(() => {
    session().then((res) => setLoged(res.loggedIn));
  }, []);

  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          height: 34,
          m: 0,
          display: { xs: "flex", lg: "none" },
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "background.paper",
        }}
      >
        <Logo />
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {loged && <GlobalSearch />}

          <ToogleTheme />
          {/* <SelectLanguage /> */}
          <IconButton
            onClick={toggleDrawer}
            size="large"
            edge="end"
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>

          {loged && <AuthMenu />}
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        keepMounted={false}
      >
        <Box
          sx={{
            width: 280,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          ></Box>

          <Stack spacing={2} sx={{ px: 2, py: 3 }}>
            {navbarLinks.map((link, index) => (
              <Typography
                key={index}
                component={Link}
                href={link.href}
                onClick={toggleDrawer}
                sx={{
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "text.primary",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>
          <Box sx={{ borderTop: "1px solid gray" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "start",

              p: 1,
            }}
          >
            {!loged && <LoginRegister />}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
