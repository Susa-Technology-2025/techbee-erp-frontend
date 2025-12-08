// DynamicPopoverWrapper.jsx (Reusable Popover Shell)

import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { FaPlus } from "react-icons/fa";

const DynamicPopoverWrapper = ({ onClose, title, children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: 288, // w-72
        maxHeight: "50vh",
        overflowY: "auto",
        scrollbarWidth: "thin",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 1,
        boxShadow: theme.shadows[10],
      }}
    >
      {/* Dynamic Popover Header */}
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: theme.palette.divider,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
        }}
      >
        <h3 className="font-semibold text-sm">{title}</h3>
        <button
          onClick={onClose}
          style={{ color: theme.palette.text.secondary }}
          className="hover:text-white transition"
        >
          <FaPlus className="rotate-45 w-4 h-4" />
        </button>
      </Box>

      {/* Dynamic Content Body (No padding here, padding is inside the child content) */}
      {children}
    </Box>
  );
};

export default DynamicPopoverWrapper;
