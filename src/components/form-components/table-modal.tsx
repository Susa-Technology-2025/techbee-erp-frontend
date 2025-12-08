"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface TableModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const TableModal: React.FC<TableModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {children} {/* This renders the form content */}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}{" "}
      {/* This renders the action buttons */}
    </Dialog>
  );
};

export default TableModal;
