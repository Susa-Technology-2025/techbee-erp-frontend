"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Security as SecurityIcon, Add as AddIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { RoleList } from "./_components/RoleList";
import { RoleDetail } from "./_components/RoleDetail";
import { PreviewDialog } from "./_components/PreviewDialog";
import { GlassPaper, GradientButton } from "./_components/styles";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}
interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissionIds: string[];
}

const organizePermissionsByHierarchy = (permissions: Permission[]) => {
  const hierarchy: Record<
    string,
    Record<string, Record<string, Permission[]>>
  > = {};
  if (!permissions) {
    return hierarchy;
  }
  permissions.forEach((permission) => {
    const parts = permission.code.split("_");
    if (parts.length >= 4) {
      const [module, entity, task] = parts;
      if (!hierarchy[module]) hierarchy[module] = {};
      if (!hierarchy[module][entity]) hierarchy[module][entity] = {};
      if (!hierarchy[module][entity][task])
        hierarchy[module][entity][task] = [];
      hierarchy[module][entity][task].push(permission);
    }
  });
  return hierarchy;
};

const RolePermissionManager: React.FC = () => {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
    refetch: refetchRoles,
  } = useDataQuery<Role[]>({
    apiEndPoint: "https://auth.api.techbee.et/api/roles",
  });

  const {
    data: permissionsData,
    isLoading: isPermissionsLoading,
    isError: isPermissionsError,
    refetch: refetchPermissions,
  } = useDataQuery<Permission[]>({
    apiEndPoint: "https://auth.api.techbee.et/api/permissions",
  });

  const { mutate: createRoleMutation, isPending: isCreatingRole } =
    useDataMutation<Role, Omit<Role, "id">>({
      apiEndPoint: "https://auth.api.techbee.et/api/roles",
      method: "POST",
      onSuccess: () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedRole(null);
        refetchRoles();
        setSnackbar({
          open: true,
          message: "Role created successfully!",
          severity: "success",
        });
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: "Error creating role.",
          severity: "error",
        });
      },
    });

  const { mutate: updateRoleMutation, isPending: isUpdatingRole } =
    useDataMutation<Role, Role>({
      apiEndPoint: selectedRole?.id
        ? `https://auth.api.techbee.et/api/roles/${selectedRole.id}`
        : "https://auth.api.techbee.et/api/roles",
      method: "PATCH",
      onSuccess: () => {
        setIsEditing(false);
        setSelectedRole(null);
        refetchRoles();
        setSnackbar({
          open: true,
          message: "Role updated successfully!",
          severity: "success",
        });
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: "Error updating role.",
          severity: "error",
        });
      },
    });

  const { mutate: deleteRoleMutation, isPending: isDeletingRole } =
    useDataMutation<void, string>({
      apiEndPoint: (id) => `https://auth.api.techbee.et/api/roles/${id}`,
      method: "DELETE",
      onSuccess: (_, variables) => {
        if (selectedRole?.id === variables) {
          setSelectedRole(null);
        }
        refetchRoles();
        setSnackbar({
          open: true,
          message: "Role deleted successfully!",
          severity: "success",
        });
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: "Error deleting role.",
          severity: "error",
        });
      },
    });

  const roles = rolesData || [];
  const permissions = permissionsData || [];

  const loading = isRolesLoading || isPermissionsLoading;
  const isCrudLoading = isCreatingRole || isUpdatingRole || isDeletingRole;

  useEffect(() => {
    if (selectedRole) {
      const selected: Record<string, boolean> = {};
      selectedRole.permissionIds.forEach((id) => {
        selected[id] = true;
      });
      setSelectedPermissions(selected);
    } else {
      setSelectedPermissions({});
    }
  }, [selectedRole]);

  const permissionHierarchy = organizePermissionsByHierarchy(permissions);

  const handleSaveRole = () => {
    if (!selectedRole) return;
    const permissionIds = Object.entries(selectedPermissions)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    const rolePayload = {
      ...selectedRole,
      permissionIds,
    };

    if (isCreating) {
      const url = `https://auth.api.techbee.et/api/roles`;
      console.log("Attempting to create role.");
      console.log("Request URL:", url);
      console.log("Payload:", rolePayload);
      createRoleMutation(rolePayload);
    } else {
      const url = `https://auth.api.techbee.et/api/roles/${rolePayload.id}`;
      console.log("Attempting to update role.");
      console.log("Request URL:", url);
      console.log("Payload:", rolePayload);
      updateRoleMutation(rolePayload);
    }
    setPreviewOpen(false);
  };

  const handleCreateNew = () => {
    const newRole: Role = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      permissionIds: [],
    };
    setSelectedRole(newRole);
    setSelectedPermissions({});
    setIsCreating(true);
    setIsEditing(true);
    setActiveTab(0);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleDeleteRole = (roleId: string) => {
    console.log("Attempting to delete role with ID:", roleId);
    deleteRoleMutation(roleId);
  };

  const handleSelectAll = (check: boolean) => {
    const allPermissionIds = permissions.map((p) => p.id);
    const updatedSelection = check
      ? allPermissionIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
      : {};
    setSelectedPermissions(updatedSelection);
  };

  const handleSelectAllInModule = (e: React.MouseEvent, module: string) => {
    e.stopPropagation();
    const modulePermissions = Object.values(permissionHierarchy[module] || {})
      .flatMap(Object.values)
      .flat();
    const allSelected = modulePermissions.every(
      (p: any) => selectedPermissions[p.id]
    );
    const updatedSelection = { ...selectedPermissions };
    modulePermissions.forEach((p: any) => {
      updatedSelection[p.id] = !allSelected;
    });
    setSelectedPermissions(updatedSelection);
  };

  const handleSelectAllInEntity = (
    e: React.MouseEvent,
    module: string,
    entity: string
  ) => {
    e.stopPropagation();
    const entityPermissions = Object.values(
      permissionHierarchy[module]?.[entity] || {}
    ).flat();
    const allSelected = entityPermissions.every(
      (p: any) => selectedPermissions[p.id]
    );
    const updatedSelection = { ...selectedPermissions };
    entityPermissions.forEach((p: any) => {
      updatedSelection[p.id] = !allSelected;
    });
    setSelectedPermissions(updatedSelection);
  };

  const handleSidebarClick = (module: string, entity: string) => {
    setActiveModule(module);
    setActiveEntity(entity);
  };

  if (isRolesLoading || isPermissionsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
        }}
      >
        <Box textAlign="center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <SecurityIcon sx={{ fontSize: 60, color: "white", mb: 2 }} />
          </motion.div>
          <Typography variant="h6" color="white">
            Loading Security Manager...
          </Typography>
          <CircularProgress sx={{ mt: 2, color: "white" }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        // minHeight: "100vh",
        background: `url('images/role-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {(isCreatingRole || isUpdatingRole || isDeletingRole) && (
        <Box sx={{ width: "100%", position: "absolute", top: 0, left: 0 }}>
          <LinearProgress />
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <RoleList
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onEditRole={(role) => {
              setSelectedRole(role);
              setIsEditing(true);
              setIsCreating(false);
              setActiveTab(0);
            }}
            onDeleteRole={handleDeleteRole}
            onCreateNew={handleCreateNew}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <AnimatePresence mode="wait">
            {selectedRole ? (
              <RoleDetail
                selectedRole={selectedRole}
                isEditing={isEditing}
                isCreating={isCreating}
                permissions={permissions}
                selectedPermissions={selectedPermissions}
                permissionHierarchy={permissionHierarchy}
                activeTab={activeTab}
                activeModule={activeModule}
                activeEntity={activeEntity}
                expandedModules={expandedModules}
                onSetActiveTab={setActiveTab}
                onSetSelectedRole={setSelectedRole}
                onSetIsEditing={setIsEditing}
                onSetPreviewOpen={setPreviewOpen}
                onHandlePermissionToggle={handlePermissionToggle}
                onHandleSelectAll={handleSelectAll}
                onHandleSelectAllInModule={handleSelectAllInModule}
                onHandleSelectAllInEntity={handleSelectAllInEntity}
                onHandleSidebarClick={handleSidebarClick}
                onSetExpandedModules={setExpandedModules}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <GlassPaper sx={{ p: 4, textAlign: "center" }}>
                  <SecurityIcon
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No Role Selected
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Select a role from the list or create a new one to get
                    started.
                  </Typography>
                  <GradientButton
                    startIcon={<AddIcon />}
                    onClick={handleCreateNew}
                  >
                    Create New Role
                  </GradientButton>
                </GlassPaper>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onSave={handleSaveRole}
        selectedRole={selectedRole}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default RolePermissionManager;
