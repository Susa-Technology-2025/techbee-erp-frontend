import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";

type DeleteConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemDescription?: string;
  message?: { type: "success" | "error"; text: string } | null;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  itemDescription = "this item",
  message = null,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete {itemDescription}? This action cannot
          be undone.
        </DialogContentText>
        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
      </DialogContent>
      {message?.type === "success" ? null : (
        <DialogActions>
          <Button onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
            loading={isDeleting}
          >
            delete
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DeleteConfirmationModal;
