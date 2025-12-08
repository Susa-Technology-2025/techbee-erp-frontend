"use client";
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

const organizationData = {
  erpVersion: "TechBee ERP version 0.0, Test environment",
  activeUsers: 247,
  companyInfo: {
    name: "NexGen Innovations",
    address: "123 Tech Boulevard, San Francisco, CA 94103",
    phone: "+1 (415) 555-0123",
    email: "info@nexgen.com",
    established: "2018",
  },
  defaultLanguage: "English (US)",
  enabledModules: ["HR Management"],
  securityPolicy: {
    passwordExpiry: 90,
    twoFactor: false,
    sessionTimeout: 15,
    encryption: "AES-256",
  },
};

const LanguageOptions = [
  "English (US)",
  "English (UK)",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese (Simplified)",
  "Arabic",
];

const ModuleOptions = [
  "HR Management",
  "Inventory",
  "Accounting",
  "CRM",
  "Project Management",
  "Reporting",
  "Supply Chain",
  "E-commerce",
  "Manufacturing",
  "Quality Control",
];

const SecurityPolicyCard = ({ title, value, unit, icon }) => (
  <Card
    component={motion.div}
    whileHover={{ scale: 1.02 }}
    sx={{
      height: "100%",
      background: "linear-gradient(145deg, #f5f7ff 0%, #e8ecf1 100%)",
      borderRadius: 2,
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center", p: 2.5 }}>
      <Box sx={{ mr: 2, color: "primary.main" }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight="600">
          {value} {unit}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const SettingsPage = () => {
  const [language, setLanguage] = useState(organizationData.defaultLanguage);
  const [modules, setModules] = useState(organizationData.enabledModules);
  const [twoFactor, setTwoFactor] = useState(
    organizationData.securityPolicy.twoFactor
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleModule = (module) => {
    if (module.startsWith("HR")) {
      if (modules.includes(module)) {
        setModules(modules.filter((m) => m !== module));
      } else {
        setModules([...modules, module]);
      }
    }
  };

  const handleSave = () => {
    setSaveSuccess(true);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                System Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <Typography variant="body2">ERP</Typography>
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ERP Version
                  </Typography>
                  <Typography variant="h6">
                    {organizationData.erpVersion}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Security Policy
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <SecurityPolicyCard
                    title="Password Expiry"
                    value={organizationData.securityPolicy.passwordExpiry}
                    unit="days"
                    icon="🔒"
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <SecurityPolicyCard
                    title="Session Timeout"
                    value={organizationData.securityPolicy.sessionTimeout}
                    unit="minutes"
                    icon="⏱️"
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <SecurityPolicyCard
                    title="Encryption"
                    value={organizationData.securityPolicy.encryption}
                    unit=""
                    icon="🔑"
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={twoFactor}
                          onChange={() => setTwoFactor(!twoFactor)}
                          color="primary"
                        />
                      }
                      label="Two-Factor Authentication"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Enabled Hub Modules
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {ModuleOptions.map((module) => (
                  <Chip
                    key={module}
                    label={module}
                    clickable
                    color={modules.includes(module) ? "primary" : "default"}
                    onClick={() => toggleModule(module)}
                    variant={modules.includes(module) ? "filled" : "outlined"}
                    sx={{
                      mb: 1,
                      transform: modules.includes(module)
                        ? "scale(1.05)"
                        : "scale(1)",
                      transition: "transform 0.2s",
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          <Typography variant="body1" fontWeight="500">
            🎉 Settings saved successfully!
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default SettingsPage;
