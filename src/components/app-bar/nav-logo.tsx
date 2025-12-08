import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { SusaIcon } from "./SusaIcon";

export default function Logo() {
  return (
    <Box
      component={Link}
      aria-label="TechBee ERP homepage"
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        p: 1,
        borderRadius: 1,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <SusaIcon />
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          background: `linear-gradient(to right, section.main, primary.dark)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "section.main",
          letterSpacing: 0.8,
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textWrap: "nowrap",
          overflow: "auto",
          display: { xs: "none", sm: "block" },
        }}
      >
        TechBee ERP
      </Typography>
    </Box>
  );
}
