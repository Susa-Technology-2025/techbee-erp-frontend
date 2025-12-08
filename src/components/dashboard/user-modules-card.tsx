"use client";
import React, { useState } from "react";
import {
  Typography,
  Card,
  Avatar,
  CardHeader,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function DashboardModuleCard({
  icon: Icon,
  title,
  color,
  path,
  description,
}: any) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Styling for the modal content box
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: "none",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Box
        key={title}
        onClick={handleOpen} // Open modal on click
        sx={{
          width: 110,
          height: 110,
          m: 1,
          p: 1,
          textDecoration: "none",
          display: "block",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "background.paper",
          transition: "all 0.3s ease",
          position: "relative",
          cursor: "pointer", // Indicate it's clickable
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 10px 25px ${color}55`,
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
          },
        }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            textWrap: "wrap",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            backgroundColor: "transparent",
            zIndex: 1,
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
                <Icon sx={{ color: "#fff", fontSize: 26 }} />
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
            variant="subtitle2"
            align="center"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: 14,
              mt: 1,
            }}
          >
            {title}
          </Typography>
        </Card>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="module-modal-title"
        aria-describedby="module-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            id="module-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>
          <Typography id="module-modal-description" sx={{ mt: 2 }}>
            {description}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
