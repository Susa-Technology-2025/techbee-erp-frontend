// src/components/RoleList.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
  ListItemButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { GlassPaper, AnimatedListItem } from "./styles";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface RoleListProps {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  onEditRole: (role: Role) => void;
  onCreateNew: () => void;
  setSnackbar: (options: {
    open: boolean;
    message: string;
    severity: "success" | "error";
  }) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  selectedRole,
  onSelectRole,
  onEditRole,
  onCreateNew,
  setSnackbar,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [dialogAlert, setDialogAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (openDialog) {
      setDialogAlert(null);
    }
  }, [openDialog]);

  const handleCloseModal = () => {
    setOpenDialog(false);
    setRoleToDelete(null);
  };

  const { mutate: deleteRoleMutation, isPending: isDeletingRole } =
    useDataMutation<void, { id: string }>({
      apiEndPoint: `https://auth.api.techbee.et/api/roles/${roleToDelete?.id}`,
      method: "DELETE",
      onSuccess: () => {
        setDialogAlert({
          open: true,
          message: "Role deleted successfully!",
          severity: "success",
        });
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      },
      onError: (error) => {
        setDialogAlert({
          open: true,
          message:
            error instanceof Error
              ? error.message
              : "Error deleting role. Please try again.",
          severity: "error",
        });
      },
      invalidateQueryKey: ["data", "https://auth.api.techbee.et/api/roles"],
    });

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation({ id: roleToDelete.id });
    }
  };

  return (
    <>
      <GlassPaper sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="600">
            Roles
          </Typography>
          <Tooltip title="Add New Role">
            <IconButton
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
              onClick={onCreateNew}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
          <List dense>
            {roles.map((role) => (
              <AnimatedListItem
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ListItemButton
                  selected={selectedRole?.id === role.id}
                  onClick={() => onSelectRole(role)}
                  sx={{
                    borderRadius: "12px",
                    mb: 1,
                    background:
                      selectedRole?.id === role.id
                        ? `linear-gradient(45deg, ${alpha(
                            theme.palette.primary.main,
                            0.1
                          )}, ${alpha(theme.palette.secondary.main, 0.1)})`
                        : "transparent",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${alpha(
                        theme.palette.primary.main,
                        0.05
                      )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentIcon
                      fontSize="small"
                      color={role.isActive ? "primary" : "disabled"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="600">
                        {role.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption">
                        {role.description}
                      </Typography>
                    }
                  />
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRole(role);
                      }}
                      sx={{
                        color: theme.palette.primary.main,
                        "&:hover": {
                          background: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                      disabled={isDeletingRole}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(role);
                      }}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          background: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                      disabled={isDeletingRole}
                    >
                      {isDeletingRole && roleToDelete?.id === role.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </ListItemButton>
              </AnimatedListItem>
            ))}
          </List>
        </Box>
      </GlassPaper>
      <Dialog
        open={openDialog}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          {dialogAlert && (
            <Alert
              severity={dialogAlert.severity}
              sx={{ mb: 2, borderRadius: "8px" }}
            >
              {dialogAlert.message}
            </Alert>
          )}
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the role "
            {roleToDelete?.name || "..."}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="primary"
            disabled={isDeletingRole || dialogAlert?.severity === "success"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={isDeletingRole || dialogAlert?.severity === "success"}
          >
            {isDeletingRole ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
