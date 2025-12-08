"use client";
import React, { useState } from "react";
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
  Tooltip,
  useTheme,
  Checkbox,
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
  FileUpload,
  Build,
  AccessTime,
  FileCopy,
  CheckCircle,
  Cancel,
  WarningAmber,
  Person,
  Business,
  Calculate,
  Badge,
  Assignment,
  ListAlt,
  Shield,
  TuneOutlined,
  Power,
  Dataset,
  ShieldOutlined,
  PieChartOutline,
  FileDownload,
  BuildOutlined,
  Schedule,
  Share,
  ContentCopy,
  Add,
  ManageAccounts,
} from "@mui/icons-material";
import { useAddRoleModal } from "./add_role_modal";
import AddRoleModal from "./add_role_modal";

type PermissionStatus = "granted" | "denied" ;

const roleTabs = [
  {
    key: "admin",
    label: "Administrator",
    icon: <AdminPanelSettings />,
    header: { icon: <AdminPanelSettings />, text: "Administrator Permissions" },
  },
  {
    key: "manager",
    label: "Manager",
    icon: <Business />,
    header: { icon: <Business />, text: "Manager Permissions" },
  },
  {
    key: "accountant",
    label: "Accountant",
    icon: <Calculate />,
    header: { icon: <Calculate />, text: "Accountant Permissions" },
  },
  {
    key: "sales",
    label: "Sales Agent",
    icon: <Badge />,
    header: { icon: <Badge />, text: "Sales Agent Permissions" },
  },
  {
    key: "inventory",
    label: "Inventory Clerk",
    icon: <Assignment />,
    header: { icon: <Assignment />, text: "Inventory Clerk Permissions" },
  },

  
];

const permissionCategories = [
  {
    icon: <People sx={{ color: "primary.main" }} />,
    label: "User Management",
    permissions: [
      { icon: <PersonAdd sx={{ color: "primary.main" }}/>, name: "Create Users", status: "granted" as PermissionStatus },
      { icon: <EditIcon sx={{ color: "primary.main" }}/>, name: "Edit Users", status: "granted" as PermissionStatus },
      { icon: <PersonRemove sx={{ color: "primary.main" }}/>, name: "Delete Users", status: "granted" as PermissionStatus },
      { icon: <VpnKey sx={{ color: "primary.main" }}/>, name: "Reset Passwords", status: "denied" as PermissionStatus },
    ],
  },
  {
    icon: <BarChart sx={{ color: "primary.main" }} />,
    label: "Financial Management",
    permissions: [
      { icon: <ReceiptLong sx={{ color: "primary.main" }}/>, name: "View Financial Reports", status: "granted" as PermissionStatus },
      { icon: <MonetizationOn sx={{ color: "primary.main" }}/>, name: "Process Payments", status: "granted" as PermissionStatus },
      { icon: <Description sx={{ color: "primary.main" }}/>, name: "Create Invoices", status: "granted" as PermissionStatus },
      { icon: <Balance sx={{ color: "primary.main" }}/>, name: "Approve Budgets", status: "granted" as PermissionStatus },
    ],
  },
  {
    icon: <Inventory sx={{ color: "primary.main" }} />,
    label: "Inventory Control",
    permissions: [
      { icon: <Inventory2 sx={{ color: "primary.main" }}/>, name: "Add Products", status: "granted" as PermissionStatus },
      { icon: <EditIcon sx={{ color: "primary.main" }}/>, name: "Edit Products", status: "granted" as PermissionStatus },
      { icon: <Warehouse sx={{ color: "primary.main" }}/>, name: "Manage Warehouses", status: "granted" as PermissionStatus },
      { icon: <SyncAlt sx={{ color: "primary.main" }}/>, name: "Adjust Stock Levels", status: "granted" as PermissionStatus },
    ],
  },
  {
    icon: <ShoppingCart sx={{ color: "primary.main" }} />,
    label: "Sales & CRM",
    permissions: [
      { icon: <Description sx={{ color: "primary.main" }}/>, name: "Create Orders", status: "granted" as PermissionStatus },
      { icon: <LocalOffer sx={{ color: "primary.main" }}/>, name: "Manage Discounts", status: "granted" as PermissionStatus },
      { icon: <Assessment sx={{ color: "primary.main" }}/>, name: "View Sales Analytics", status: "granted" as PermissionStatus },
      { icon: <Group sx={{ color: "primary.main" }}/>, name: "Manage Customers", status: "granted" as PermissionStatus },
    ],
  },
  {
    icon: <Settings sx={{ color: "primary.main" }} />,
    label: "System Settings",
    permissions: [
      { icon: <Tune sx={{ color: "primary.main" }}/>, name: "Configure Modules", status: "granted" as PermissionStatus },
      { icon: <Extension sx={{ color: "primary.main" }}/>, name: "Manage Integrations", status: "granted" as PermissionStatus },
      { icon: <Storage sx={{ color: "primary.main" }}/>, name: "Backup & Restore", status: "granted" as PermissionStatus },
      { icon: <Security sx={{ color: "primary.main" }}/>, name: "Security Settings", status: "granted" as PermissionStatus },
    ],
  },
  {
    icon: <PieChart sx={{ color: "primary.main" }} />,
    label: "Reporting",
    permissions: [
      { icon: <FileDownload sx={{ color: "primary.main" }}/>, name: "Generate Reports", status: "granted" as PermissionStatus },
      { icon: <BuildOutlined sx={{ color: "primary.main" }}/>, name: "Customize Reports", status: "granted" as PermissionStatus },
      { icon: <Schedule sx={{ color: "primary.main" }}/>, name: "Schedule Reports", status: "granted" as PermissionStatus },
      { icon: <Share sx={{ color: "primary.main" }}/>, name: "Export Reports", status: "granted" as PermissionStatus },
    ],
  },
];



const statusBg: Record<PermissionStatus, string> = {
  granted: "#e8f5e9",
  denied: "#ffebee",
  // partial: "#fff8e1",
};

const statusColor: Record<PermissionStatus, string> = {
  granted: "#2e7d32",
  denied: "#c62828",
  // partial: "#f57f17",
};
const statusIcons: Record<PermissionStatus, React.ReactElement> = {
  granted: <CheckCircle sx={{ color: "primary.main" }} fontSize="small" />,
  denied:  <Box sx={{ width: 14, height: 14, borderRadius: "50%",background: statusBg.denied, border: `1px solid ${statusColor.denied}` }} /> ,
  // partial: <WarningAmber sx={{ color: "primary.main" }} fontSize="small" />,
};

export default function RoleCard() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  // Deep copy to avoid mutating the original
  const [editPermissions, setEditPermissions] = useState(() =>
    permissionCategories.map(cat => ({
      ...cat,
      permissions: cat.permissions.map(perm => ({ ...perm })),
    }))
  );

  const handleTogglePermission = (catIdx: number, permIdx: number) => {
    setEditPermissions(prev => {
      const updated = prev.map((cat, i) =>
        i === catIdx
          ? {
              ...cat,
              permissions: cat.permissions.map((perm, j) =>
                j === permIdx
                  ? {
                      ...perm,
                      status: perm.status === "granted" ? ("denied" as PermissionStatus) : ("granted" as PermissionStatus),
                    }
                  : perm
              ),
            }
          : cat
      );
      return updated;
    });
  };

  const handleCheckboxChange = (catIdx: number, permIdx: number, checked: boolean) => {
    setEditPermissions(prev => {
      const updated = prev.map((cat, i) =>
        i === catIdx
          ? {
              ...cat,
              permissions: cat.permissions.map((perm, j) =>
                j === permIdx
                  ? {
                      ...perm,
                      status: checked ? ("granted" as PermissionStatus) : ("denied" as PermissionStatus),
                    }
                  : perm
              ),
            }
          : cat
      );
      return updated;
    });
  };

  const handleEditClick = () => {
    if (editing) {
      // Save: just exit edit mode, keep current state
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const { open: addRoleModalOpen, handleOpen: handleOpenAddRoleModal, handleClose: handleCloseAddRoleModal } = useAddRoleModal();

  const handleAddRole = (newRole: any) => {
    console.log("New role created:", newRole);
    // In a real app, you would add this role to your state/backend
    alert(`Role "${newRole.name}" created successfully!`);
  };

  return (
    <Box sx={{ px: 5, mx: "auto", mb: 6,}}>
      {/* <Typography>You can Cretae Roles here</Typography> */}
      <Card
        sx={{
          width: '100%',
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mb: 7
        }}
      >
        <CardHeader
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${theme.palette.cardHeaderStart}, ${theme.palette.cardHeaderEnd})`,
            color: "primary.main",
            py: 3,
            px: 4
          }}
          title={
            <Box display="flex" alignItems="center" gap={1.5}>
              {roleTabs[tab].header.icon}
              <Typography variant="h6" fontWeight={700} color="inherit">
                {roleTabs[tab].header.text}
              </Typography>
            </Box>
          }

          subheader={
            <Typography color="text.secondary" sx={{ opacity: 0.9, mt: 0.5 }}>
              Each role has specific permissions that control access to different modules and features within the ERP system.
            </Typography>
          }
          action={
            <Box>
                          <Button
              variant="contained"
              startIcon={<ManageAccounts/>}
              sx={{
                background: "primary.main",
                color: "white",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 2,
                textTransform: "none",
                ml: 2,
                minWidth: 120,
              }}
              onClick={handleOpenAddRoleModal}
            >
              Manage user Roles
            </Button>
                        <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: "primary.main",
                color: "white",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 2,
                textTransform: "none",
                ml: 2,
                minWidth: 120,
              }}
              onClick={handleOpenAddRoleModal}
            >
              Add Role
            </Button>
            </Box>

          }
        />
        <Box
          sx={{
            background: theme.palette.cardHeaderStart,
            overflowX: "auto",
            whiteSpace: "nowrap",            
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 56,
              // No width here!
            }}
          >
            {roleTabs.map((role, idx) => (
              <Tab
                key={role.key}
                label={role.label}
                icon={role.icon}
                iconPosition="start"
                sx={{
                  minWidth: 120,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  color: tab === idx ? "primary.main" : "#6c757d",
                  borderBottom: tab === idx ? "3px solid primary.main" : "3px solid transparent",
                  background: tab === idx ? "rgba(52,152,219,0.05)" : "inherit",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </Tabs>
        </Box>
        <CardContent sx={{ p: 4, display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "stretch" }}>
          {editPermissions.map((cat, i) => (
            <Box
              key={cat.label}
              sx={{
                flex: "1 1 300px",
                minWidth: 280,
                maxWidth: 360,
                background: theme.palette.cardHeaderStart,
                borderRadius: 2,
                p: 2.5,
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                border: "1px solid #edf2f7",
                transition: "transform 0.3s, box-shadow 0.3s",
                display: "flex",
                flexDirection: "column",
                mb: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={2} pb={1.5} borderBottom="1px solid #e2e8f0">
                <Avatar sx={{ bgcolor: "#e3f2fd", width: 42, height: 42, borderRadius: 2 }}>
                  {cat.icon}
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700} color="#2d3748">
                  {cat.label}
                </Typography>
              </Box>
              <List disablePadding>
                {cat.permissions.map((perm, j) => (
                  <ListItem
                    key={perm.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.2,
                      borderBottom: j === cat.permissions.length - 1 ? "none" : "1px dashed #e2e8f0",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: "primary.main" }}>{perm.icon}</ListItemIcon>
                    <ListItemText
                      primary={perm.name}
                      primaryTypographyProps={{ fontSize: 16, color: "#4a5568" }}
                    />
                    {editing ? (
                      <Checkbox
                        checked={perm.status === "granted"}
                        onChange={e => handleCheckboxChange(i, j, e.target.checked)}
                        color="success"
                        sx={{ ml: 1, "&.Mui-checked": { color: "primary.main" } }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: statusBg[perm.status],
                          color: statusColor[perm.status],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          ml: 1,
                        }}
                      >
                        {statusIcons[perm.status]}
                      </Box>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </CardContent>
        <CardActions
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.cardHeaderStart}, ${theme.palette.cardHeaderEnd})`,
            borderTop: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            px: 4,
            py: 3,
          }}
        >
          <Box display="flex" gap={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ color: "primary.main" }} fontSize="small" />
              <Typography fontSize={14} color="#6c757d">Permission Granted</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 14, height: 14, borderRadius: "50%", background: statusBg.denied, border: `1px solid ${statusColor.denied}` }} />
              <Typography fontSize={14} color="#6c757d">Permission Denied</Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1} className="actions">
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2, fontWeight: 600, px: 3, background: "primary.main", color: "white", boxShadow: 2, textTransform: "none" }}
              onClick={handleEditClick}
            >
              {editing ? "Save" : "Edit Permissions"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              sx={{ borderRadius: 2, fontWeight: 600, px: 3, color: "primary.main", borderColor: "primary.main", background: theme.palette.background.default, ml: 1, textTransform: "none" }}
              onClick={() => alert("Copy Role feature would open here. You can duplicate this role to create a new one.")}
            >
              Copy Role
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* Add Role Modal */}
      <AddRoleModal
        open={addRoleModalOpen}
        onClose={handleCloseAddRoleModal}
        onSave={handleAddRole}
      />
    </Box>
  );
}
