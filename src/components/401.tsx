"use client";

import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Lock, Home, Warning, ExitToApp, Security } from "@mui/icons-material";
import { useEffect, useState } from "react";

const UnauthorizedPage = () => {
  const theme = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 5,
    }));
    setParticles(newParticles);
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0818 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)",
          zIndex: 0,
        },
      }}
    >
      {/* Animated grid background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(18, 16, 36, 0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18, 16, 36, 0.7) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background: "rgba(0, 229, 255, 0.6)",
            boxShadow: "0 0 5px rgba(0, 229, 255, 0.5)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Scanning line effect */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.8), transparent)",
          zIndex: 1,
        }}
        animate={{ y: ["0vh", "100vh"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, md: 6 },
              background: "rgba(15, 12, 41, 0.7)",
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(138, 43, 226, 0.3)",
              boxShadow:
                "0 0 25px rgba(138, 43, 226, 0.2), inset 0 0 15px rgba(0, 229, 255, 0.1)",
            }}
          >
            {/* Binary rain effect */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                opacity: 0.1,
                pointerEvents: "none",
              }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    color: "#00e5ff",
                    fontSize: "14px",
                    left: `${Math.random() * 100}%`,
                    fontFamily: "monospace",
                  }}
                  animate={{
                    y: ["-100%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear",
                  }}
                >
                  {Math.random() > 0.5 ? "1" : "0"}
                </motion.div>
              ))}
            </Box>

            {/* Corner accents */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 40,
                height: 40,
                borderLeft: "2px solid",
                borderTop: "2px solid",
                borderColor: "primary.main",
                borderRadius: "8px 0 0 0",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 40,
                height: 40,
                borderRight: "2px solid",
                borderTop: "2px solid",
                borderColor: "primary.main",
                borderRadius: "0 8px 0 0",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 40,
                height: 40,
                borderLeft: "2px solid",
                borderBottom: "2px solid",
                borderColor: "secondary.main",
                borderRadius: "0 0 0 8px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 40,
                height: 40,
                borderRight: "2px solid",
                borderBottom: "2px solid",
                borderColor: "secondary.main",
                borderRadius: "0 0 8px 0",
              }}
            />

            {/* Main content */}
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Lock
                  sx={{
                    fontSize: 80,
                    color: "primary.main",
                    mb: 2,
                    filter: "drop-shadow(0 0 5px rgba(138, 43, 226, 0.5))",
                  }}
                />
                <motion.div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Security sx={{ fontSize: 30, color: "secondary.main" }} />
                </motion.div>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(45deg, #8A2BE2 30%, #00E5FF 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                  textShadow: "0 0 10px rgba(138, 43, 226, 0.3)",
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: "0.05em",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                ACCESS DENIED
                <motion.span
                  style={{
                    position: "absolute",
                    bottom: -5,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                      "linear-gradient(90deg, transparent, #00E5FF, transparent)",
                  }}
                  animate={{
                    width: ["0%", "100%", "0%"],
                    left: ["0%", "0%", "100%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </Typography>

              <motion.div
                animate={{
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Warning
                    sx={{
                      verticalAlign: "middle",
                      mr: 1,
                      color: "warning.main",
                      fontSize: 30,
                    }}
                  />
                  <Box
                    component="span"
                    sx={{ textShadow: "0 0 10px rgba(255, 193, 7, 0.5)" }}
                  >
                    Authorization Required
                  </Box>
                </Typography>
              </motion.div>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                <Box component="span" sx={{ display: "block", mb: 1 }}>
                  Unauthorized access attempt detected.
                </Box>
                This area is restricted to authorized personnel only. Please
                verify your credentials or contact system administration.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={handleGoHome}
                    sx={{
                      background:
                        "linear-gradient(45deg, #8A2BE2 0%, #4A00E0 100%)",
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: "1rem",
                      boxShadow: "0 5px 15px rgba(138, 43, 226, 0.4)",
                      "&:hover": {
                        boxShadow: "0 8px 20px rgba(138, 43, 226, 0.6)",
                      },
                    }}
                  >
                    Return to Home
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ExitToApp />}
                    onClick={handleGoBack}
                    sx={{
                      border: "2px solid",
                      borderColor: "primary.main",
                      color: "primary.main",
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: "1rem",
                      background: "rgba(138, 43, 226, 0.1)",
                      "&:hover": {
                        borderColor: "primary.light",
                        backgroundColor: "rgba(138, 43, 226, 0.2)",
                        boxShadow: "0 0 15px rgba(138, 43, 226, 0.3)",
                      },
                    }}
                  >
                    Go Back
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                borderRadius: "inherit",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                zIndex: -1,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;
