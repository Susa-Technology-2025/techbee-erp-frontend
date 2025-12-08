"use client";
import React, { useCallback, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  useTheme,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  AdminPanelSettings,
  People,
  PersonAdd,
  Edit as EditIcon,
  PersonRemove,
  VpnKey,
  BarChart,
  MonetizationOn,
  ReceiptLong,
  Balance,
  Inventory,
  Inventory2,
  Warehouse,
  SyncAlt,
  ShoppingCart,
  Description,
  LocalOffer,
  Assessment,
  Group,
  Settings,
  Tune,
  Extension,
  Storage,
  Security,
  PieChart,
  FileDownload,
  BuildOutlined,
  Schedule,
  Share,
  ContentCopy,
  Add,
  Close,
  CheckCircle,
} from "@mui/icons-material";

type PermissionStatus = "granted" | "denied";

// Define permission categories
const permissionCategories = [
  {
    label: "User Management",
    icon: <People />,
    permissions: [
      { name: "View Users", icon: <People /> },
      { name: "Create Users", icon: <PersonAdd /> },
      { name: "Edit Users", icon: <EditIcon /> },
      { name: "Delete Users", icon: <PersonRemove /> },
    ],
  },
  {
    label: "Role Management",
    icon: <VpnKey />,
    permissions: [
      { name: "View Roles", icon: <VpnKey /> },
      { name: "Create Roles", icon: <Add /> },
      { name: "Edit Roles", icon: <EditIcon /> },
      { name: "Delete Roles", icon: <Close /> },
    ],
  },
  {
    label: "Dashboard",
    icon: <BarChart />,
    permissions: [
      { name: "View Dashboard", icon: <BarChart /> },
      { name: "Export Reports", icon: <FileDownload /> },
    ],
  },
  {
    label: "Finance",
    icon: <MonetizationOn />,
    permissions: [
      { name: "View Financial Reports", icon: <Assessment /> },
      { name: "Manage Invoices", icon: <ReceiptLong /> },
      { name: "Manage Payments", icon: <Balance /> },
    ],
  },
  {
    label: "Inventory",
    icon: <Inventory />,
    permissions: [
      { name: "View Inventory", icon: <Inventory /> },
      { name: "Manage Products", icon: <Inventory2 /> },
      { name: "Manage Warehouses", icon: <Warehouse /> },
      { name: "Stock Movements", icon: <SyncAlt /> },
    ],
  },
  {
    label: "Sales",
    icon: <ShoppingCart />,
    permissions: [
      { name: "View Sales", icon: <ShoppingCart /> },
      { name: "Create Orders", icon: <Add /> },
      { name: "Manage Customers", icon: <Group /> },
    ],
  },
  {
    label: "Settings",
    icon: <Settings />,
    permissions: [
      { name: "System Settings", icon: <Tune /> },
      { name: "Module Configuration", icon: <Extension /> },
    ],
  },
];

const statusBg: Record<PermissionStatus, string> = {
  granted: "#e8f5e9",
  denied: "#ffebee",
};

const statusColor: Record<PermissionStatus, string> = {
  granted: "#2e7d32",
  denied: "#c62828",
};

const statusIcons: Record<PermissionStatus, React.ReactElement> = {
  granted: <CheckCircle sx={{ color: "primary.main" }} fontSize="small" />,
  denied: (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: statusBg.denied,
        border: `1px solid ${statusColor.denied}`,
      }}
    />
  ),
};

export const useAddRoleModal = () => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);
    
    return {
      open,
      handleOpen,
      handleClose,
    };
  };

   export type AddRoleModalProps<T> = {
    open: boolean;
    onClose: () => void;
    onSave: any;
  }
// Add Role Modal Component
const AddRoleModal = ({ open, onClose, onSave }: AddRoleModalProps<any>) => {
  const theme = useTheme();
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: boolean;
  }>({});

  const handleTogglePermission = (permissionName: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: !prev[permissionName],
    }));
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      alert("Please enter a role name");
      return;
    }
    onSave({
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          background: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.cardHeaderStart}, ${theme.palette.cardHeaderEnd})`,
          color: "primary.main",
          mb: 4,
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Add sx={{ color: "primary.main" }} />
          <Typography variant="h6" fontWeight={700}>
            Create New Role
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3}}>
          <Box sx={{ flex: 1, minWidth: 0, mt: 2}}>
            <TextField
              fullWidth
              label="Role Name"
              variant="outlined"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 2, background: theme.palette.background.default },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2, background: theme.palette.background.default },
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Assign Permissions
            </Typography>
            <Box
              sx={{
                height: "300px",
                overflowY: "auto",
                p: 2,
                background: theme.palette.background.default,
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              {permissionCategories.map((category: any) => (
                <Box key={category.label} mb={3}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: "#e3f2fd",
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                      }}
                    >
                      {category.icon}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {category.label}
                    </Typography>
                  </Box>

                  {category.permissions.map((permission: any) => (
                    <ListItem
                      key={permission.name}
                      sx={{
                        py: 0.5,
                        pl: 2,
                        pr: 1,
                        borderRadius: 1,
                        "&:hover": { background: "rgba(0, 0, 0, 0.03)" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: "primary.main" }}>
                        {permission.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={permission.name}
                        primaryTypographyProps={{ fontSize: 14 }}
                      />
                      <Checkbox
                        size="small"
                        checked={!!selectedPermissions[permission.name]}
                        onChange={() => handleTogglePermission(permission.name)}
                        color="primary"
                        sx={{ p: 0.5 }}
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1.5 }} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, background: theme.palette.background.default }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
            color: "text.secondary",
            borderColor: "divider",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
            background: "primary.main",
            color: "white",
            boxShadow: 2,
          }}
        >
          Create Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoleModal;