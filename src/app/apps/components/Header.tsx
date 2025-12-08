"use client";
import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import {
  Bolt as BoltIcon,
  ShowChart as ChartIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

const Header = () => {
  return (
    <Box sx={{ mb: 6, py: 6, textAlign: "center" }}>
      <Fade in={true} timeout={800}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Power Your Business with TechBee ERP
        </Typography>
      </Fade>

      {/* Value Metrics */}
      <Fade in={true} timeout={1200}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 3,
            mt: 4,
            "& > div": {
              display: "flex",
              alignItems: "center",
              "& svg": {
                mr: 1,
                color: "primary.main",
              },
            },
          }}
        >
          <Box>
            <BoltIcon />
            <Typography>30% average efficiency gain</Typography>
          </Box>
          <Box>
            <ChartIcon />
            <Typography>45% faster reporting</Typography>
          </Box>
          <Box>
            <BusinessIcon />
            <Typography>24/7 support</Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Header;
