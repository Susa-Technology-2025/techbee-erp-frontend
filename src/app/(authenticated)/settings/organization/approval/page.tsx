"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Group as GroupIcon,
  AccountTree as FlowIcon,
  TransferWithinAStation as DelegationIcon,
  Celebration as CelebrationIcon,
} from "@mui/icons-material";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { approvalDocumentTypeSchema } from "@/lib/schemas/core/approval-doc-type";
import { approvalGroupSchema } from "@/lib/schemas/core/approval-group";
import { approvalFlowSchema } from "@/lib/schemas/core/approval-policy";
import { delegationSchema } from "@/lib/schemas/core/delegation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MultiTabDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Show surprise when switching to the last tab (Delegation)
    if (newValue === 3) {
      setShowSurprise(true);
      setTimeout(() => setShowSurprise(false), 3000);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="approval management tabs"
        >
          <Tab icon={<DocumentIcon />} label="Document Types" id="tab-0" />
          <Tab icon={<GroupIcon />} label="Approval Groups" id="tab-1" />
          <Tab icon={<FlowIcon />} label="Approval Flows" id="tab-2" />
          <Tab icon={<DelegationIcon />} label="Delegations" id="tab-3" />
        </Tabs>
      </AppBar>

      <TabPanel value={tabValue} index={0}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <DocumentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Approval Document Types
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage different types of documents that require approval in your
              organization. Define the properties and requirements for each
              document type.
            </Typography>
            <MaterialTableWrapper schema={approvalDocumentTypeSchema} />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <GroupIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Approval Groups
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Create and manage groups of users who can participate in approval
              processes. Assign roles and permissions to control access levels.
            </Typography>
            <MaterialTableWrapper schema={approvalGroupSchema} />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <FlowIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Approval Flows
              </Typography>
              <Chip
                label="Advanced"
                color="secondary"
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Design multi-step approval workflows with conditional paths and
              parallel approvals. Customize each step with specific requirements
              and validations.
            </Typography>
            <MaterialTableWrapper schema={approvalFlowSchema} />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <DelegationIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Delegations
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set up temporary delegations of approval authority when team
              members are unavailable. Manage effective dates and permission
              scopes for delegated approvals.
            </Typography>
            <MaterialTableWrapper schema={delegationSchema} />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Surprise Celebration Animation */}
      <Zoom in={showSurprise} timeout={1000}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Fade in={showSurprise} timeout={2000}>
            <Typography
              variant="h1"
              component="div"
              sx={{
                background:
                  "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🎉 Focus! 🎊
            </Typography>
          </Fade>
        </Box>
      </Zoom>
    </Container>
  );
}
