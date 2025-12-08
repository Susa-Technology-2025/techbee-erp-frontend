"use client";

import { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";

export const DeleteButtonWithDialog = ({
  selectedRows,
  apiEndPoint,
  onClose,
}: any) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isSingleRowSelected = selectedRows.length === 1;
  const selectedRow = isSingleRowSelected ? selectedRows[0] : null;

  const deleteMutation = useDataMutation({
    apiEndPoint: selectedRow
      ? `${apiEndPoint}/${selectedRow.original.id}`
      : apiEndPoint,
    method: "DELETE",
    onSuccessInvalidate: true,
    getBody: () => undefined,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAlertMessage(null);
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(undefined);
      setAlertMessage({
        type: "success",
        text: "Item deleted successfully.",
      });
    } catch (error) {
      setAlertMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete item. Please try again.",
      });
    }
  };

  // auto close dialog 3 seconds after showing alert
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (!isSingleRowSelected) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Selected">
        <span>
          <IconButton onClick={handleOpen} disabled={deleteMutation.isPending}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          {alertMessage ? (
            <Alert severity={alertMessage.type}>{alertMessage.text}</Alert>
          ) : (
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogContentText>
          )}
        </DialogContent>
        {!alertMessage && (
          <DialogActions>
            <Button onClick={handleClose} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              autoFocus
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
