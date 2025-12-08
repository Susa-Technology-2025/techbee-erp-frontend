import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Fade in={!!message} timeout={600}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2.5,
          boxShadow: "0 4px 20px rgba(255, 0, 0, 0.2)",
          background: "linear-gradient(145deg, #ff4d4d, #b30000)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 6px 25px rgba(255, 0, 0, 0.35)",
          },
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 36, color: "white" }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
            Something Went Wrong
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {message}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default ErrorMessage;
