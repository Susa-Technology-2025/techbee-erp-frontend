"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import DesignServicesRoundedIcon from "@mui/icons-material/DesignServicesRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DashActions from "../dash-actions";

const UnderConstructionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const launchDate = "August 17, 2025";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const featureVariants = {
    hover: {
      y: -5,
      scale: 1.03,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        position: "relative",
        color: theme.palette.text.primary,
        textAlign: "center",
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <motion.div variants={itemVariants}>
          <ConstructionRoundedIcon
            sx={{
              fontSize: isMobile ? 60 : 80,
              color: theme.palette.warning.main,
              mb: 2,
            }}
          />
        </motion.div>
        <DashActions />

        <motion.div variants={itemVariants}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h2"
            gutterBottom
            sx={{ mb: 3, opacity: 0.9 }}
          >
            We're crafting a faster, smoother experience for you
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: isMobile ? "1rem" : "1.1rem",
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            <strong>Everything you use today will still be here</strong> – we're
            just making it better. The new version keeps all your favorite
            features while adding:
          </Typography>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <motion.div variants={featureVariants} whileHover="hover">
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                height: "100%",
              }}
            >
              <DesignServicesRoundedIcon
                color="primary"
                sx={{ fontSize: 40, mb: 1 }}
              />
              <Typography variant="h6" gutterBottom>
                Modern Design
              </Typography>
              <Typography variant="body2">
                Cleaner interface that helps you work faster
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={featureVariants} whileHover="hover">
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                height: "100%",
              }}
            >
              <AccessibilityNewRoundedIcon
                color="secondary"
                sx={{ fontSize: 40, mb: 1 }}
              />
              <Typography variant="h6" gutterBottom>
                Better Accessibility
              </Typography>
              <Typography variant="body2">
                Easier navigation for all users
              </Typography>
            </Box>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic" }}>
            "We appreciate your patience as we build something truly special for
            your business."
          </Typography>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<RocketLaunchRoundedIcon />}
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
            }}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Early Access
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
            }}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See What's Changing
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default UnderConstructionPage;
