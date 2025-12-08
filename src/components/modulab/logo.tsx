"use client";

import React from "react";
import { Box, CardMedia } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { usePathname } from "next/navigation";

const Logo: React.FC = () => {
  const session = useSelector((state: RootState) => state.session);
  const pathname = usePathname();
  const logoUrl =
    session.tenantCode === "default"
      ? "https://2img.net/h/www.finanzzas.com/wp-content/uploads/DefaultLogo.png"
      : session.organization.logo;

  if (!logoUrl || pathname === "/dashboard") {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        flexShrink: 0,
        height: 40,
        minWidth: 160,
        maxWidth: 160,
        minHeight: 40,
        maxHeight: 40,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        image={logoUrl}
        alt={`${session.organization.name || "Organization"} logo`}
        sx={{
          width: "auto",
          borderRadius: 2,
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default Logo;
