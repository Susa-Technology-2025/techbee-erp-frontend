// src/components/organization/OrganizationSummary.tsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Settings,
  CalendarToday,
  Language,
  People,
  Business,
} from "@mui/icons-material";
import dayjs from "dayjs";

function FieldItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
        {icon && <Box sx={{ color: "primary.main", mt: 0.5 }}>{icon}</Box>}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          <Typography variant="body2" fontWeight="medium" sx={{ mt: 0.5 }}>
            {value || "—"}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}

function StatusChip({
  value,
  positive,
}: {
  value: boolean;
  positive?: boolean;
}) {
  return (
    <Chip
      label={value ? "Yes" : "No"}
      size="small"
      color={value ? (positive ? "success" : "primary") : "default"}
      variant={value ? "filled" : "outlined"}
    />
  );
}

const getMetadataValue = (data: any, key: string) => data?.metadata?.[key];
const getConfigValue = (data: any, key: string) => data?.tenantConfig?.[key];

export function OrganizationSummary({ data }: any) {
  if (!data) return null;

  const fiscalYearStart = getConfigValue(data, "fiscalYearStart");
  const fiscalYearEnd = getConfigValue(data, "fiscalYearEnd");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        opacity: "0.9",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Box
          component="img"
          src={data.logoUrl}
          sx={{
            height: 80,
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            objectFit: "contain",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: 600,
            color: "text.secondary",
            bgcolor: "section.main",
          }}
          className="rounded-xl p-3"
          alt={`${data.name} Logo`}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />

        {/* Fallback content */}
        {!data.logoUrl && (
          <Box
            sx={{
              width: 80,
              height: 80,
              border: "3px solid",
              borderColor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {data.name?.[0]?.toUpperCase() || "O"}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {data.name || "Organization Details"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              bgcolor: "primary.50",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              display: "inline-block",
              mt: 1,
            }}
          >
            {data.code}
          </Typography>
        </Box>
      </Box>
      {/* Contact & Location Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.primary",
          }}
        >
          <Business fontSize="small" />
          Contact & Location
        </Typography>

        <Grid container spacing={2}>
          <FieldItem
            label="Email"
            value={getMetadataValue(data, "email")}
            icon={<Email fontSize="small" />}
          />
          <FieldItem
            label="Phone"
            value={getMetadataValue(data, "phoneNumber")}
            icon={<Phone fontSize="small" />}
          />
          <FieldItem
            label="Address"
            value={getMetadataValue(data, "address")}
            icon={<LocationOn fontSize="small" />}
          />
        </Grid>
      </Box>
      {/* System Configuration Section */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.primary",
          }}
        >
          <Settings fontSize="small" />
          System Configuration
        </Typography>

        <Grid container spacing={2}>
          <FieldItem
            label="SaaS Organization"
            value={<StatusChip value={data.isSaaS} positive />}
          />
          <FieldItem
            label="Timezone"
            value={getConfigValue(data, "timezone")}
            icon={<Language fontSize="small" />}
          />
          <FieldItem label="Locale" value={getConfigValue(data, "locale")} />
          <FieldItem
            label="Max Employees"
            value={getConfigValue(data, "maxEmployees") || "Unlimited"}
            icon={<People fontSize="small" />}
          />
          <FieldItem
            label="Org Structure"
            value={
              <StatusChip
                value={getConfigValue(data, "allowOrgStructure")}
                positive
              />
            }
          />
          <FieldItem
            label="Requires Company Node"
            value={
              <StatusChip value={getConfigValue(data, "requireCompanyNode")} />
            }
          />

          {fiscalYearStart && (
            <FieldItem
              label="Fiscal Year Start"
              value={dayjs()
                .month(fiscalYearStart.month)
                .date(fiscalYearStart.day)
                .format("MMM D")}
              icon={<CalendarToday fontSize="small" />}
            />
          )}
          {fiscalYearEnd && (
            <FieldItem
              label="Fiscal Year End"
              value={dayjs()
                .month(fiscalYearEnd.month)
                .date(fiscalYearEnd.day)
                .format("MMM D")}
              icon={<CalendarToday fontSize="small" />}
            />
          )}
        </Grid>
      </Box>
    </Paper>
  );
}
