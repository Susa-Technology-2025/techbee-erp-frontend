import { Box, IconButton } from "@mui/material";
import BackButton from "@/components/go-back-button";
import GlobalSearch from "./global-search/GlobalSearch";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Link from "next/link";
import { Help, Home } from "@mui/icons-material";
import ApprovalTasks from "./approval/approve-icon";
import { NavbarAuth } from "./public-navbar/navbar-auth";

export default () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        ml: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BackButton />
      <GlobalSearch />
      <ApprovalTasks />

      {/* <SelectLanguage /> */}
      <IconButton component={Link} href="/dashboard">
        <Home />
      </IconButton>
      <IconButton component={Link} href="/tutorials">
        <Help />
      </IconButton>
      <NavbarAuth />
    </Box>
  );
};
