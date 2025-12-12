"use client";

import {
  Modal,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Paper,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { EmploymentDetailsTab } from "./emp-details";
import { ContractsTab } from "./contracts";
import { DocumentsTab } from "./documents";
import { PayslipsTab } from "./payslip";
import { BankAccounts } from "./bank-accounts";
import { PositionHistory } from "@/app/(authenticated)/hr/_schemas/position-history";
import { PositionHistoryDetailsTab } from "./positionHistory";
import { FamilyTab } from "./family";

interface DetailModalProps {
  open: boolean;
  handleClose: () => void;
  row: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: any }) => {
  const getDisplayValue = (val: any) => {
    if (typeof val === "object" && val !== null) {
      if ("name" in val) {
        return val.name;
      }
      return "N/A";
    }
    return val || "N/A";
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{getDisplayValue(value)}</Typography>
    </Box>
  );
};

// Start of the individual tab components

// Tabs configuration array
const tabs = [
  {
    label: "Employment Details",
    component: EmploymentDetailsTab,
  },
  {
    label: "Contracts",
    component: ContractsTab,
  },
  {
    label: "Documents",
    component: DocumentsTab,
  },
  {
    label: "Payslips",
    component: PayslipsTab,
  },
  {
    label: "Position History",
    component: PositionHistoryDetailsTab,
  },
  {
    label: "Bank Accounts",
    component: BankAccounts,
  },
  {
    label: "Family Dependents",
    component: FamilyTab,
  },
];

export const EmployeeDetailModal = ({
  open,
  handleClose,
  row,
}: DetailModalProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!row) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        console.log("Closing from EmployeeDetailModal");
        handleClose();
      }}
      aria-labelledby="employee-detail-modal-title"
      aria-describedby="employee-detail-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "75%", lg: "60%" },
          height: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            id="employee-detail-modal-title"
            variant="h6"
            component="h2"
          >
            Employee Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            alt={`${row.firstName} ${row.lastName}`}
            src={`https://picsum.photos/seed/${row.id}/200`}
            sx={{ width: 80, height: 80, mr: 3 }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {row.firstName} {row.grandFatherName} {row.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {row.employeeCode}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label={row.status} color="primary" size="small" />
            </Box>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          <Box sx={{ flexShrink: 0, width: 200, mr: 2 }}>
            <Paper
              elevation={3}
              sx={{ p: 2, height: "100%", overflowY: "auto" }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Stack spacing={1}>
                <DetailItem
                  label="Full Name"
                  value={`${row.firstName} ${row.fatherName} ${row.grandFatherName}`}
                />
                <DetailItem label="Gender" value={row.gender} />
                <DetailItem
                  label="Date of Birth"
                  value={
                    row.dateOfBirth
                      ? new Date(row.dateOfBirth).toLocaleDateString()
                      : "N/A"
                  }
                />
                <DetailItem label="Marital Status" value={row.maritalStatus} />
                <DetailItem label="Email" value={row.email} />
                <DetailItem label="Phone Number" value={row.phoneNumber} />
              </Stack>
            </Paper>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              display: "flex",
              maxWidth: "100%",
              overflowX: "hidden",
              flexDirection: "column",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                flexGrow: 1,
                display: "flex",

                flexDirection: "column",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="employee details tabs"
                  variant="scrollable"
                >
                  {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                  ))}
                </Tabs>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  width: 1,
                  overflowX: "auto",
                }}
              >
                {tabs.map((tab, index) => (
                  <TabPanel key={index} value={value} index={index}>
                    {<tab.component row={row} />}
                  </TabPanel>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
