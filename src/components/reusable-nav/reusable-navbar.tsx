import { Box } from "@mui/material";
import DashActions from "@/components/dash-actions";
import ActiveLinkButton from "@/components/reusable-nav/active-links";

export default function ReusableNavbar({
  navLinks,
}: {
  navLinks: {
    href: string;
    emoji: string;
    title: string;
  }[];
}) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "95%",
        mx: "auto",
        py: 1,
        display: { xs: "none", lg: "flex" },
        justifyContent: "flex-end",
        gap: 1,
        zIndex: 100,
      }}
    >
      {navLinks.map((link) => (
        <ActiveLinkButton
          key={link.href}
          href={link.href}
          emoji={link.emoji}
          title={link.title}
        />
      ))}

      <DashActions />
    </Box>
  );
}
