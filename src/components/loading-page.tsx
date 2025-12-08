import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "section.main",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          p: 4,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          boxShadow: "0 0 30px rgba(138, 43, 226, 0.4)",
        }}
      >
        <CircularProgress
          size={80}
          thickness={2}
          sx={{
            color: "rgba(255,255,255,0.1)",
            position: "absolute",
          }}
        />
        <CircularProgress
          size={80}
          thickness={2}
          sx={{
            animationDuration: "1.8s",
            color: "#8a2be2",
            "& circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>

      <Typography
        variant="h5"
        sx={{
          mt: 4,
          color: "#fff",
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          textShadow: "0 0 10px rgba(138, 43, 226, 0.7)",
        }}
      >
        Loading
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 3,
          "& > div": {
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#8a2be2",
            animation: "pulse 1.4s infinite ease-in-out",
            "&:nth-of-type(2)": { animationDelay: "0.2s" },
            "&:nth-of-type(3)": { animationDelay: "0.4s" },
          },
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(0.8)", opacity: 0.5 },
            "50%": { transform: "scale(1.2)", opacity: 1 },
          },
        }}
      >
        <div />
        <div />
        <div />
      </Box>
    </Box>
  );
};

export default LoadingPage;
