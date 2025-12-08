"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Tabs,
  Chip,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  IconButton,
  ListItemButton,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { StyledTabs, StyledTab, GradientButton, GlassPaper } from "./styles";
import { PermissionList } from "./PermissionList";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";

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

interface RoleDetailProps {
  selectedRole: Role | null;
  permissions: Permission[];
  permissionHierarchy: any;
  setSnackbar: (options: {
    open: boolean;
    message: string;
    severity: "success" | "error";
  }) => void;
  onSetSelectedRole: (role: Role | null) => void;
}

const getFilteredPermissions = (
  permissionHierarchy: any,
  activeModule: string | null,
  activeEntity: string | null
) => {
  if (!activeModule || !activeEntity) {
    return [];
  }
  const entities = permissionHierarchy[activeModule];
  if (!entities) return [];
  const tasks = entities[activeEntity];
  if (!tasks) return [];
  return Object.values(tasks).flat();
};

export const RoleDetail: React.FC<RoleDetailProps> = ({
  selectedRole,
  permissions,
  permissionHierarchy,
  setSnackbar,
  onSetSelectedRole,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(!!selectedRole?.id);
  const [isCreating, setIsCreating] = useState(!selectedRole?.id);
  const [roleForm, setRoleForm] = useState(
    selectedRole || {
      id: "",
      name: "",
      description: "",
      isActive: true,
      permissionIds: [],
    }
  );
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (selectedRole && selectedRole.id) {
      setRoleForm(selectedRole);
      setIsEditing(true);
      setIsCreating(false);
      const selected: Record<string, boolean> = {};
      selectedRole.permissionIds.forEach((id) => {
        selected[id] = true;
      });
      setSelectedPermissions(selected);
    } else {
      setRoleForm({
        id: "",
        name: "",
        description: "",
        isActive: true,
        permissionIds: [],
      });
      setIsEditing(true);
      setIsCreating(true);
      setSelectedPermissions({});
    }
    setActiveTab(0);
  }, [selectedRole]);

  useEffect(() => {
    if (alert.open && alert.severity === "success") {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
        onSetSelectedRole(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (alert.open && alert.severity === "error") {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.open, alert.severity, onSetSelectedRole]);

  const { mutate: createRoleMutation, isPending: isCreatingRole } =
    useDataMutation<Role, Omit<Role, "id">>({
      apiEndPoint: "https://auth.api.techbee.et/api/roles",
      method: "POST",
      onSuccess: () => {
        setAlert({
          open: true,
          message: "Role created successfully!",
          severity: "success",
        });
      },
      onError: (error) => {
        setAlert({
          open: true,
          message:
            error instanceof Error
              ? error.message
              : "Error creating role. Please try again.",
          severity: "error",
        });
      },
      invalidateQueryKey: ["data", "https://auth.api.techbee.et/api/roles"],
    });

  const { mutate: updateRoleMutation, isPending: isUpdatingRole } =
    useDataMutation<Role, Omit<Role, "id">>({
      apiEndPoint: roleForm.id
        ? `https://auth.api.techbee.et/api/roles/${roleForm.id}`
        : "https://auth.api.techbee.et/api/roles",
      method: "PATCH",
      onSuccess: () => {
        setAlert({
          open: true,
          message: "Role updated successfully!",
          severity: "success",
        });
      },
      onError: (error) => {
        setAlert({
          open: true,
          message:
            error instanceof Error
              ? error.message
              : "Error updating role. Please try again.",
          severity: "error",
        });
      },
      invalidateQueryKey: ["data", "https://auth.api.techbee.et/api/roles"],
    });

  const handleSaveRole = () => {
    if (!roleForm) return;

    const payload = {
      name: roleForm.name,
      description: roleForm.description,
      isActive: roleForm.isActive,
      permissionIds: Object.keys(selectedPermissions).filter(
        (id) => selectedPermissions[id]
      ),
    };

    if (isCreating) {
      createRoleMutation(payload);
    } else if (isEditing) {
      updateRoleMutation(payload);
    }
  };

  const handleCancelEdit = () => {
    onSetSelectedRole(null);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
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

  const isModuleSelected = (module: string) => {
    const modulePermissions = Object.values(permissionHierarchy[module] || {})
      .flatMap(Object.values)
      .flat();
    if (modulePermissions.length === 0) return false;
    return modulePermissions.every((p: any) => selectedPermissions[p.id]);
  };

  const isModuleIndeterminate = (module: string) => {
    const modulePermissions = Object.values(permissionHierarchy[module] || {})
      .flatMap(Object.values)
      .flat();
    if (modulePermissions.length === 0) return false;
    const selectedCount = modulePermissions.filter(
      (p: any) => selectedPermissions[p.id]
    ).length;
    return selectedCount > 0 && selectedCount < modulePermissions.length;
  };

  const isEntitySelected = (module: string, entity: string) => {
    const entityPermissions = Object.values(
      permissionHierarchy[module]?.[entity] || {}
    ).flat();
    if (entityPermissions.length === 0) return false;
    return entityPermissions.every((p: any) => selectedPermissions[p.id]);
  };

  const isEntityIndeterminate = (module: string, entity: string) => {
    const entityPermissions = Object.values(
      permissionHierarchy[module]?.[entity] || {}
    ).flat();
    if (entityPermissions.length === 0) return false;
    const selectedCount = entityPermissions.filter(
      (p: any) => selectedPermissions[p.id]
    ).length;
    return selectedCount > 0 && selectedCount < entityPermissions.length;
  };

  const isAllSelected = permissions.every((p) => selectedPermissions[p.id]);
  const isAllIndeterminate =
    permissions.some((p) => selectedPermissions[p.id]) && !isAllSelected;

  const filteredPermissions = getFilteredPermissions(
    permissionHierarchy,
    activeModule,
    activeEntity
  );

  return (
    <motion.div
      key={selectedRole?.id || "new-role"}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <GlassPaper sx={{ p: 2 }}>
        <Box sx={{ width: "100%" }}>
          <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: "12px 12px 0 0",
            }}
          >
            <StyledTabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <StyledTab label="General" />
              <StyledTab
                label="Permissions"
                disabled={!isEditing && !isCreating}
              />
            </StyledTabs>
          </AppBar>
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Role Name"
                    value={roleForm.name}
                    disabled={!isEditing && !isCreating}
                    onChange={(e) =>
                      setRoleForm({
                        ...roleForm,
                        name: e.target.value,
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    label="Description"
                    value={roleForm.description}
                    disabled={!isEditing && !isCreating}
                    onChange={(e) =>
                      setRoleForm({
                        ...roleForm,
                        description: e.target.value,
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={roleForm.isActive}
                        disabled={!isEditing && !isCreating}
                        onChange={(e) =>
                          setRoleForm({
                            ...roleForm,
                            isActive: e.target.checked,
                          })
                        }
                        color="primary"
                      />
                    }
                    label={<Typography variant="body2">Active</Typography>}
                  />
                </Grid>
                {!isEditing && !isCreating && (
                  <Grid size={{ xs: 12 }}>
                    <GradientButton
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Role
                    </GradientButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          {activeTab === 1 && (
            <Box sx={{ display: "flex", height: "500px" }}>
              <Box
                sx={{
                  width: "250px",
                  borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: "auto",
                  background: alpha(theme.palette.background.paper, 0.5),
                }}
              >
                <List dense component="nav">
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isAllIndeterminate}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">Select All</Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                  {Object.entries(permissionHierarchy).map(
                    ([module, entities]: [string, any]) => (
                      <React.Fragment key={module}>
                        <ListItemButton>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Checkbox
                              checked={isModuleSelected(module)}
                              indeterminate={isModuleIndeterminate(module)}
                              onClick={(e) =>
                                handleSelectAllInModule(e, module)
                              }
                              color="primary"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">{module}</Typography>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedModules((prev) => ({
                                ...prev,
                                [module]: !prev[module],
                              }));
                            }}
                          >
                            {expandedModules[module] ? (
                              <ExpandLessIcon fontSize="small" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" />
                            )}
                          </IconButton>
                        </ListItemButton>
                        {expandedModules[module] && (
                          <List component="div" disablePadding>
                            {Object.entries(entities).map(([entity, tasks]) => (
                              <ListItemButton
                                key={entity}
                                sx={{
                                  pl: 4,
                                }}
                                onClick={() =>
                                  handleSidebarClick(module, entity)
                                }
                                selected={
                                  activeModule === module &&
                                  activeEntity === entity
                                }
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Checkbox
                                    edge="start"
                                    checked={isEntitySelected(module, entity)}
                                    indeterminate={isEntityIndeterminate(
                                      module,
                                      entity
                                    )}
                                    onClick={(e) =>
                                      handleSelectAllInEntity(e, module, entity)
                                    }
                                    color="primary"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2">
                                      {entity}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
                            ))}
                          </List>
                        )}
                      </React.Fragment>
                    )
                  )}
                </List>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {activeModule && (
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Chip
                        label={activeModule}
                        size="small"
                        sx={{
                          mr: 1,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: "white",
                        }}
                      />{" "}
                      /{" "}
                      <Chip
                        label={activeEntity}
                        size="small"
                        sx={{
                          ml: 1,
                          background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.success.main})`,
                          color: "white",
                        }}
                      />
                    </Typography>
                  </Box>
                )}
                <PermissionList
                  permissions={filteredPermissions as Permission[]}
                  selectedPermissions={selectedPermissions}
                  onTogglePermission={handlePermissionToggle}
                  activeModule={activeModule}
                  activeEntity={activeEntity}
                />
              </Box>
            </Box>
          )}
          {(isEditing || isCreating) && (
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {alert.open && (
                <Alert
                  severity={alert.severity as "success" | "error"}
                  sx={{ width: "100%" }}
                >
                  {alert.message}
                </Alert>
              )}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  sx={{ borderRadius: "50px" }}
                  disabled={isCreatingRole || isUpdatingRole}
                >
                  Cancel
                </Button>
                <GradientButton
                  startIcon={<SaveIcon />}
                  onClick={handleSaveRole}
                  loading={isCreatingRole || isUpdatingRole}
                >
                  Save
                </GradientButton>
              </Box>
            </Box>
          )}
        </Box>
      </GlassPaper>
    </motion.div>
  );
};
