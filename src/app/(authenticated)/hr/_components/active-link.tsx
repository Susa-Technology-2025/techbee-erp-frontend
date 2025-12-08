"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography, SxProps, Theme } from "@mui/material";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({ href, children, sx }) => {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
  const normalizedHref = href === "/" ? "/" : href;

  const isActive = pathWithoutLocale === normalizedHref;

  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        position: "relative",
        textWrap: "nowrap",
        px: 2,
        py: 1,
        fontSize: "0.875rem",
        fontWeight: 500,
        color: isActive ? "primary.main" : "text.primary",
        textDecoration: "none",
        transition: "color 0.3s ease",
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 2,
          width: isActive ? "100%" : 0,
          backgroundColor: "primary.main",
          transition: "width 0.3s ease",
        },
        "&:hover": {
          color: "primary.main",
        },
        "&:hover::after": {
          width: "100%",
        },
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default ActiveLink;
