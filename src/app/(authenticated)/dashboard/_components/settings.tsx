"use client";
import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Divider,
  Box,
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
} from "@mui/material";
import {
  Security,
  AttachMoney,
  People,
  Business,
  Storage,
} from "@mui/icons-material";
import {
  initialModulePermissions,
  initialSettings,
  ModulePermission,
  ModulePermissions,
  Setting,
} from "@/lib/constants/settings";
import { Role } from "@/lib/auth/protected-routes";

const OrganizationSettings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [modulePermissions, setModulePermissions] = useState<ModulePermissions>(
    initialModulePermissions
  );
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeModuleTab, setActiveModuleTab] = useState<string>("employee");
  const approverRoles = [
    "HR Manager",
    "Department Head",
    "Team Lead",
    "CEO",
    "Finance Manager",
    "Asset Manager",
  ];
  const handleSettingChange = (index: number, newValue: any) => {
    const updatedSettings = [...settings];
    updatedSettings[index].value = newValue;
    setSettings(updatedSettings);
  };
  const handlePermissionChange = (
    module: string,
    role: string,
    permission: keyof Omit<ModulePermission, "fourEyeEnabled" | "approverRole">,
    value: boolean
  ) => {
    const updatedPermissions = { ...modulePermissions };
    (updatedPermissions[module][role][permission] as boolean) = value;
    setModulePermissions(updatedPermissions);
  };
  const handleFourEyeToggle = (
    module: string,
    role: string,
    value: boolean
  ) => {
    const updatedPermissions = { ...modulePermissions };
    updatedPermissions[module][role].fourEyeEnabled = value;

    if (!value) {
      updatedPermissions[module][role].approve = false;
    }
    setModulePermissions(updatedPermissions);
  };
  const handleApproverRoleChange = (
    module: string,
    role: string,
    value: string
  ) => {
    const updatedPermissions = { ...modulePermissions };
    updatedPermissions[module][role].approverRole = value as Role;
    setModulePermissions(updatedPermissions);
  };
  const handleSave = () => {
    const allSettings = {
      systemSettings: settings,
      modulePermissions: modulePermissions,
    };
    console.log("Saved Settings:", JSON.stringify(allSettings, null, 2));
    alert("Settings saved successfully!");
  };
  const handleReset = () => {
    setSettings(initialSettings);
    setModulePermissions(initialModulePermissions);
  };
  const getSettingValue = (settingName: string): any => {
    const setting = settings.find((s) => s.settingName === settingName);
    return setting ? setting.value : null;
  };
  const renderSetting = (setting: Setting, index: number) => {
    if (setting.dependsOn && !getSettingValue(setting.dependsOn)) {
      return null;
    }
    return (
      <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              {setting.settingIcon}
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                {setting.settingName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {setting.settingDescription}
            </Typography>
            {typeof setting.value === "boolean" ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={setting.value as boolean}
                    onChange={(e) =>
                      handleSettingChange(index, e.target.checked)
                    }
                  />
                }
                label={setting.value ? "Enabled" : "Disabled"}
              />
            ) : (
              <FormControl fullWidth>
                {setting.values ? (
                  <>
                    <InputLabel>{setting.settingName}</InputLabel>
                    <Select
                      value={setting.value}
                      label={setting.settingName}
                      onChange={(e) =>
                        handleSettingChange(index, e.target.value)
                      }
                    >
                      {setting.values.map((option, i) => (
                        <MenuItem key={i} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <Typography>{String(setting.value)}</Typography>
                )}
              </FormControl>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Paper
      sx={{
        width: "80vw",
        p: 2,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, newValue: number) => setActiveTab(newValue)}
      >
        <Tab label="General" icon={<Business />} />
        <Tab label="Security" icon={<Security />} />
        <Tab label="Modules" icon={<People />} />
        <Tab label="Finance" icon={<AttachMoney />} />
        <Tab label="Data" icon={<Storage />} />
      </Tabs>
      <Divider sx={{ my: 2 }} />
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {settings
            .filter((setting) => setting.category === "General")
            .map((setting, index) => renderSetting(setting, index))}
        </Grid>
      )}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {settings
            .filter(
              (setting) =>
                setting.category === "Security" ||
                setting.category === "Compliance"
            )
            .map((setting, index) => renderSetting(setting, index))}
        </Grid>
      )}
      {activeTab === 2 && (
        <div>
          <Typography variant="h6" gutterBottom>
            Module Access Control
          </Typography>
          <Typography variant="body1">
            The 4-Eye Principle ensures checks and balances by requiring two
            authorized users to review or approve sensitive operations—such as
            financial transactions, data access, or policy changes—to reduce
            errors, fraud, and security risks.
          </Typography>
          <Tabs
            value={activeModuleTab}
            onChange={(_, newValue: string) => setActiveModuleTab(newValue)}
            aria-label="module tabs"
            sx={{ mb: 3 }}
          >
            {Object.keys(modulePermissions).map((moduleName) => (
              <Tab
                key={moduleName}
                label={moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}
                value={moduleName}
              />
            ))}
          </Tabs>
          {Object.entries(modulePermissions).map(([module, roles]) => (
            <div
              key={module}
              hidden={activeModuleTab !== module}
              role="tabpanel"
            >
              {activeModuleTab === module && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="h6">
                              {module.charAt(0).toUpperCase() + module.slice(1)}{" "}
                              Module
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {module === "employee" &&
                                "Employee records and HR operations"}
                              {module === "assets" &&
                                "Company assets and inventory management"}
                              {module === "finance" &&
                                "Financial transactions and accounting"}
                            </Typography>
                          </Box>
                          <Chip
                            label={
                              Object.values(roles).some((r) => r.fourEyeEnabled)
                                ? "Approvals Required"
                                : "Direct Access"
                            }
                            color={
                              Object.values(roles).some((r) => r.fourEyeEnabled)
                                ? "success"
                                : "default"
                            }
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: "backgroundSection.main",
                            color: "backgroundSection.contrastText",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Module-wide Settings
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={Object.values(roles).some(
                                  (r) => r.fourEyeEnabled
                                )}
                                onChange={(e) => {
                                  Object.keys(roles).forEach((role) => {
                                    handleFourEyeToggle(
                                      module,
                                      role,
                                      e.target.checked
                                    );
                                  });
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography>Enable 4-Eye Principle</Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Requires approvals for critical changes in
                                  this module
                                </Typography>
                              </Box>
                            }
                            sx={{ mb: 2 }}
                          />
                        </Box>
                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                          Role-Specific Permissions
                        </Typography>
                        {Object.entries(roles).map(([role, permissions]) => (
                          <Box
                            key={role}
                            sx={{
                              mt: 2,
                              p: 2,
                              border: "1px solid #eee",
                              borderRadius: 1,

                              backgroundColor: permissions.fourEyeEnabled
                                ? "backgroundSection.main"
                                : "inherit",
                              color: permissions.fourEyeEnabled
                                ? "backgroundSection.contrastText"
                                : "inherit",
                            }}
                          >
                            <Typography fontWeight="medium">
                              {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                              Access
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 3,
                                mt: 2,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Basic Permissions
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    mt: 1,
                                  }}
                                >
                                  {(["view", "edit", "delete"] as const).map(
                                    (permission) => (
                                      <FormControlLabel
                                        key={permission}
                                        control={
                                          <Checkbox
                                            checked={permissions[permission]}
                                            onChange={(e) =>
                                              handlePermissionChange(
                                                module,
                                                role,
                                                permission,
                                                e.target.checked
                                              )
                                            }
                                          />
                                        }
                                        label={
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {permission}
                                            {permission === "delete" && (
                                              <Typography
                                                variant="caption"
                                                color="error.main"
                                                sx={{ ml: 1 }}
                                              >
                                                (Dangerous)
                                              </Typography>
                                            )}
                                          </Box>
                                        }
                                      />
                                    )
                                  )}
                                </Box>
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Approval Settings
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={permissions.fourEyeEnabled}
                                        onChange={(e) =>
                                          handleFourEyeToggle(
                                            module,
                                            role,
                                            e.target.checked
                                          )
                                        }
                                        size="small"
                                      />
                                    }
                                    label={
                                      <Typography variant="body2">
                                        Require approval
                                        {permissions.fourEyeEnabled && (
                                          <Typography
                                            variant="caption"
                                            display="block"
                                            color="text.secondary"
                                          >
                                            Changes will need verification
                                          </Typography>
                                        )}
                                      </Typography>
                                    }
                                    sx={{ mb: 1 }}
                                  />
                                  {permissions.fourEyeEnabled && (
                                    <FormControl
                                      fullWidth
                                      size="small"
                                      sx={{ mt: 1 }}
                                    >
                                      <InputLabel>Approver Role</InputLabel>
                                      <Select
                                        value={permissions.approverRole || ""}
                                        label="Approver Role"
                                        onChange={(e) =>
                                          handleApproverRoleChange(
                                            module,
                                            role,
                                            e.target.value
                                          )
                                        }
                                      >
                                        {approverRoles.map((roleOption, i) => (
                                          <MenuItem key={i} value={roleOption}>
                                            {roleOption}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </div>
          ))}
        </div>
      )}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          {settings
            .filter((setting) => setting.category === "Finance")
            .map((setting, index) => renderSetting(setting, index))}
        </Grid>
      )}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          {settings
            .filter(
              (setting) =>
                setting.category === "Data" ||
                setting.category === "Integration"
            )
            .map((setting, index) => renderSetting(setting, index))}
        </Grid>
      )}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Paper>
  );
};
export default OrganizationSettings;
