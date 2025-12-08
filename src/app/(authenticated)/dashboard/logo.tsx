"use client";

import React from "react";
import { Box, CardMedia } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export const DashLogo: React.FC = () => {
  const session = useSelector((state: RootState) => state.session);
  const logoUrl =
    session.tenantCode === "default"
      ? "https://2img.net/h/www.finanzzas.com/wp-content/uploads/DefaultLogo.png"
      : session.organization.logo;

  if (!logoUrl) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        flexShrink: 0,
        height: 160,
        minWidth: 200,
        maxWidth: 200,
        minHeight: 160,
        maxHeight: 160,
        overflow: "hidden",
        bgcolor: "section.main",
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
