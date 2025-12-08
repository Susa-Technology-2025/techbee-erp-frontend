import { Box } from "@mui/material";
import DashActions from "@/components/dash-actions";
import { hrLinks } from "@/app/(authenticated)/hr/_constants/hr-links";
import ActiveLinkButton from "@/app/(authenticated)/hr/_components/active-link-button";

export default function DashboardHeader() {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "100%",
        mx: "auto",
        display: { xs: "none", lg: "flex" },
        justifyContent: "end",
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
