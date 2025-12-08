import { Box } from "@mui/material";
import DashActions from "@/components/dash-actions";
import { hrLinks } from "../_constants/hr-links";
import ActiveLinkButton from "./active-link-button";

export default function DesktopHeader() {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        mb: { xs: 3, md: 4 },
        width: { xs: "100%", lg: "90%" },
        mx: "auto",
        display: { xs: "none", lg: "flex" },
        justifyContent: "end",
        alignItems: "center",
        gap: 1,
      }}
    >
      {hrLinks.map((link) => (
        <ActiveLinkButton
          key={link.href}
          href={link.href}
          icon={<link.icon sx={{ fontSize: { xs: 18, md: 20 } }} />}
        >
          {link.text}
        </ActiveLinkButton>
      ))}

      <DashActions />
    </Box>
  );
}
