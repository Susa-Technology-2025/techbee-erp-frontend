// src/components/PreviewDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha,
} from "@mui/material";
import { GradientButton } from "./styles";

interface Permission {
  id: string;
  name: string;
}

interface Role {
  name: string;
  description: string;
  isActive: boolean;
}

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedRole: Role | null;
  permissions: Permission[];
  selectedPermissions: Record<string, boolean>;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onClose,
  onSave,
  selectedRole,
  permissions,
  selectedPermissions,
}) => {
  const theme = useTheme();
  const selectedPermissionNames = Object.entries(selectedPermissions)
    .filter(([_, selected]) => selected)
    .map(([id]) => permissions.find((p) => p.id === id)?.name)
    .filter(Boolean);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.9
          )} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Review Role Changes
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
          Please review the changes before saving.
        </Alert>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Role Details
            </Typography>
            <Box sx={{ p: 1, pl: 2 }}>
              <Typography variant="body2">
                <strong>Name:</strong> {selectedRole?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {selectedRole?.description}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{" "}
                {selectedRole?.isActive ? "Active" : "Inactive"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Permissions
            </Typography>
            <Box sx={{ maxHeight: "300px", overflow: "auto", p: 1 }}>
              {selectedPermissionNames.map((name, index) => (
                <Chip
                  key={index}
                  label={name}
                  size="small"
                  sx={{
                    m: 0.5,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "white",
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Total: {selectedPermissionNames.length} permissions selected
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ borderRadius: "50px" }}>
          Cancel
        </Button>
        <GradientButton onClick={onSave}>Confirm Save</GradientButton>
      </DialogActions>
    </Dialog>
  );
};
