"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, Box } from "@mui/material";

interface ActiveLinkButtonProps {
  href: string;
  emoji?: string;
  title?: string;
}

const ActiveLinkButton: React.FC<ActiveLinkButtonProps> = ({
  href,
  emoji,
  title,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      component={Link}
      href={href}
      variant="text"
      sx={{
        textTransform: "none",
        fontWeight: "bolder",
        px: { xs: 1, md: 1.5 },
        py: { xs: 0.4, md: 0.5 },
        borderRadius: "10px",
        backdropFilter: "blur(8px)",
        backgroundColor: isActive ? "black" : undefined,
        color: isActive ? "white" : "text.primary",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "section.main",
          color: "section.contrastText",
        },
        gap: 1,
      }}
    >
      {emoji && (
        <Box component="span" sx={{ display: "inline-flex" }}>
          {emoji}
        </Box>
      )}
      {title && <Box component="span">{title}</Box>}
    </Button>
  );
};

export default ActiveLinkButton;
