"use client";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export default ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        minWidth: 0,
        pr: { xs: 1, sm: 2, md: 1 },
        width: "100%",
        transition: "padding 0.2s",
        position: "relative",
      }}
    >
      {children}
    </Box>
  );
};
