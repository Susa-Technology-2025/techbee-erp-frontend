import React from "react";
import { Box, Typography, Avatar, Card, CardHeader } from "@mui/material";
import { features, headerText } from "@/lib/constants/susa-features";
import ScrollAnimationWrapper from "./section-wrapper";
import { Variants } from "framer-motion";

const heroVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

const cardColors = [
  "#FF8A8A",
  "#6BAEFF",
  "#5ED5A8",
  "#FFD66B",
  "#B18BFF",
  "#FFA14D",
  "#FF80B5",
  "#D1D1D1",
];

const SusaERPFeatures = () => {
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 4,
        px: 2,
        backgroundColor: "background.paper",
        overflow: "auto",
      }}
    >
      <ScrollAnimationWrapper variants={heroVariants}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h2" // Changed from h3 to h2 for accessibility
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            {headerText}
          </Typography>
        </Box>
      </ScrollAnimationWrapper>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {features.map((feature, index) => {
          const color = cardColors[index % cardColors.length];
          return (
            <Box
              key={index}
              sx={{
                width: 260,
                height: 200,
                p: 2,
                borderRadius: 4,
                position: "relative",
                backgroundColor: "background.paper",
                transition: "all 0.3s ease",
                boxShadow: `0 6px 16px rgba(0, 0, 0, 0.1)`,
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: `0 12px 28px ${color}55`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(circle at top left, ${color}30, transparent 70%)`,
                  zIndex: 0,
                  borderRadius: 4,
                },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  backgroundColor: "transparent",
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: color,
                        width: 50,
                        height: 50,
                        boxShadow: `0 4px 12px ${color}55`,
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { color: "#fff", fontSize: 26 },
                      })}
                    </Avatar>
                  }
                  sx={{
                    p: 0,
                    mb: 1,
                    "& .MuiCardHeader-avatar": {
                      marginRight: 0,
                    },
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: 18,
                    mb: 1,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontSize: 15,
                    px: 1,
                  }}
                >
                  {feature.description.replace(/\*\*(.*?)\*\*/g, "$1")}
                </Typography>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SusaERPFeatures;
