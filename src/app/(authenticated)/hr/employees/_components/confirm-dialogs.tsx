import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';

export interface ConfirmDialogProps {
  open: boolean;
  employee: { firstName?: string; lastName?: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({ open, employee, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to permanently delete {employee?.firstName} {employee?.lastName}?
          <Box component="span" fontWeight="bold" display="block" mt={1}>
            This action cannot be undone.
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Confirm Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ConfirmDeactivateDialog({ open, employee, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deactivation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to deactivate {employee?.firstName} {employee?.lastName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Confirm Deactivate</Button>
      </DialogActions>
    </Dialog>
  );
} 