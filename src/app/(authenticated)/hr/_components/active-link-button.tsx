"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, SxProps, Theme } from "@mui/material";
import { hrLinks } from "../_constants/hr-links";

interface ActiveLinkButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
  sx?: SxProps<Theme>;
}

const ActiveLinkButton: React.FC<ActiveLinkButtonProps> = ({
  href,
  children,
  icon,
  sx,
}) => {
  const pathname = usePathname();
  const pathWithoutLocale = pathname;
  // const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  let longestMatch = "";
  for (const link of hrLinks) {
    if (
      pathWithoutLocale === link.href ||
      pathWithoutLocale.startsWith(link.href + "/")
    ) {
      if (link.href.length > longestMatch.length) {
        longestMatch = link.href;
      }
    }
  }

  const isActive = href === longestMatch;

  return (
    <Button
      component={Link}
      href={href}
      startIcon={icon}
      variant="text"
      sx={{
        fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
        textTransform: "none",
        px: { xs: 1.5, md: 2 },
        py: { xs: 0.5, md: 0.7 },
        borderRadius: "14px",
        backdropFilter: "blur(8px)",
        backgroundColor: isActive ? "black" : "backgroundSection.main",
        color: isActive ? "white" : "backgroundSection.contrastText",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "section.main",
          color: "section.contrastText",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default ActiveLinkButton;
