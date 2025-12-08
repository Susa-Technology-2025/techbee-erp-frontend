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

  const isActive =
    normalizedHref === "/"
      ? pathWithoutLocale === "/"
      : pathWithoutLocale.startsWith(normalizedHref);

  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        textDecoration: "none",
        fontWeight: 600,
        fontSize: "0.875rem",

        color: isActive ? "primary.main" : "text.primary",
        position: "relative",
        px: 1,
        py: 0.5,
        borderRadius: 0.5,
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
        "&::after": {
          content: '""',
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: -3,
          height: 1.5,

          width: isActive ? "70%" : 0,
          backgroundColor: "primary.main",
          transition: "width 0.2s ease",
        },
        "&:hover::after": {
          width: "70%",
        },
        "&:hover": {
          color: "primary.main",
          backgroundColor: "transparent",
        },
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default ActiveLink;
