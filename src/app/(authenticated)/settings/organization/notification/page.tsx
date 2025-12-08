"use client";
import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import {
  notificationDocumentTypeSchema,
  notificationPolicySchema,
  notificationChannelConfigSchema,
  notificationEventCatalogSchema,
  notificationRecipientSchema,
} from "@/lib/schemas/notification";
const schemaConfigs = [
  {
    key: "channelConfig",
    label: "Channel Config",
    schema: notificationChannelConfigSchema,
  },
  {
    key: "documentType",
    label: "Document Type",
    schema: notificationDocumentTypeSchema,
  },
  { key: "policy", label: "Policy", schema: notificationPolicySchema },

  {
    key: "eventCatalog",
    label: "Event Catalog",
    schema: notificationEventCatalogSchema,
  },

  { key: "recipient", label: "Recipient", schema: notificationRecipientSchema },
];
export default function NotificationSchemasPage() {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="notification schemas tabs"
        >
          {schemaConfigs.map((config, index) => (
            <Tab
              key={config.key}
              label={config.label}
              id={`schema-tab-${index}`}
              aria-controls={`schema-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>
      {schemaConfigs.map((config, index) => (
        <div
          key={config.key}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`schema-tabpanel-${index}`}
          aria-labelledby={`schema-tab-${index}`}
        >
          {activeTab === index && (
            <Box sx={{ p: 3 }}>
              <MaterialTableWrapper schema={config.schema} />
            </Box>
          )}
        </div>
      ))}
    </Box>
  );
}
