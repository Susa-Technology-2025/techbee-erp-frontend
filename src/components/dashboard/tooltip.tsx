"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Button from "@mui/material/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import WorkIcon from "@mui/icons-material/Work";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MessageIcon from "@mui/icons-material/Message";

const actions = [
  { icon: <AssignmentIcon />, name: "Submit Leave" },
  { icon: <ReceiptIcon />, name: "View Payslip" },
  { icon: <QueryBuilderIcon />, name: "Log Hours" },
  { icon: <WorkIcon />, name: "My Tasks" },
  { icon: <EventNoteIcon />, name: "Attendance" },
  { icon: <MessageIcon />, name: "Message HR" },
];

export default function CustomizedSpeedDial() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ height: "100vh", position: "fixed" }}>
      <SpeedDial
        ariaLabel="ERP Actions"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map(({ icon, name }) => (
          <Box
            key={name}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(20px)",
              transition: "all 0.3s ease",
              pointerEvents: open ? "auto" : "none",
            }}
          >
            <SpeedDialAction icon={icon} onClick={handleClose} sx={{ mr: 1 }} />
            <Button
              variant="contained"
              startIcon={icon}
              onClick={handleClose}
              sx={{
                whiteSpace: "nowrap",
                pointerEvents: open ? "auto" : "none",
              }}
            >
              {name}
            </Button>
          </Box>
        ))}
      </SpeedDial>
    </Box>
  );
}
