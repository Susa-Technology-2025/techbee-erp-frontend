"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
  FormGroup,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { timezoneOptions, localeOptions } from "./organizationOptions"; // Assuming path
import FileUploadWithPreview from "@/components/ReusableFormDrawer/file-upload";

const FieldSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Box sx={{ mb: 4, mt: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Grid container spacing={3}>
      {children}
    </Grid>
  </Box>
);

export function OrganizationFields() {
  const {
    control,
    formState: { errors, defaultValues },
    watch,
  } = useFormContext<any>();

  const organizationCode = watch("code");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={0}>
        {/* ======================= 1. General Information ======================= */}
        <FieldSection title="General Information">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Organization Code"
              value={organizationCode || ""}
              fullWidth
              variant="standard"
              disabled
              helperText="This code is non-editable and unique to your organization."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Organization Name"
                  fullWidth
                  variant="standard"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FileUploadWithPreview
              folder="logos"
              fileName={`${organizationCode}-${defaultValues?.id}-logo`}
              watchField="logoUrl"
              acceptedFileTypes={["image/*"]}
              label=" Company Logo"
            />
          </Grid>
        </FieldSection>

        {/* ======================= 2. Contact & Location Information ======================= */}
        <FieldSection title="Contact & Location Information">
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="metadata.email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Email"
                  fullWidth
                  variant="standard"
                  error={!!errors.metadata?.email}
                  helperText={errors.metadata?.email?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="metadata.phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Phone Number"
                  fullWidth
                  variant="standard"
                  error={!!errors.metadata?.phoneNumber}
                  helperText={
                    errors.metadata?.phoneNumber?.message ||
                    "Include country code"
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="metadata.address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Address"
                  fullWidth
                  variant="standard"
                  error={!!errors.metadata?.address}
                  helperText={errors.metadata?.address?.message}
                />
              )}
            />
          </Grid>
        </FieldSection>

        {/* ======================= 3. System Configuration ======================= */}
        <FieldSection title="System Configuration">
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="tenantConfig.timezone"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <Autocomplete
                  options={timezoneOptions}
                  getOptionLabel={(option) => option}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...restField}
                      label="Timezone"
                      fullWidth
                      variant="standard"
                      error={!!errors.tenantConfig?.timezone}
                      helperText={
                        errors.tenantConfig?.timezone?.message ||
                        "Select your organization's timezone"
                      }
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="tenantConfig.locale"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <Autocomplete
                  options={localeOptions}
                  getOptionLabel={(option) => option}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...restField}
                      label="Locale"
                      fullWidth
                      variant="standard"
                      error={!!errors.tenantConfig?.locale}
                      helperText={
                        errors.tenantConfig?.locale?.message ||
                        "Select the preferred language/region format"
                      }
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="tenantConfig.maxEmployees"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Max Employees"
                  fullWidth
                  variant="standard"
                  type="number"
                  error={!!errors.tenantConfig?.maxEmployees}
                  helperText={
                    errors.tenantConfig?.maxEmployees?.message ||
                    "Set the maximum number of employee accounts (Optional)"
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  value={field.value ?? ""}
                />
              )}
            />
          </Grid>
        </FieldSection>

        {/* ======================= 4. Fiscal Year Settings ======================= */}
        <FieldSection title="Fiscal Year Settings">
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="tenantConfig.fiscalYearStart"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <DatePicker
                  {...restField}
                  label="Fiscal Year Start"
                  value={value ? dayjs(value) : null}
                  onChange={(date) => onChange(date ? date.toDate() : null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      error: !!errors.tenantConfig?.fiscalYearStart,
                      helperText:
                        errors.tenantConfig?.fiscalYearStart?.message ||
                        "Select the fiscal year start date",
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="tenantConfig.fiscalYearEnd"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <DatePicker
                  {...restField}
                  label="Fiscal Year End"
                  value={value ? dayjs(value) : null}
                  onChange={(date) => onChange(date ? date.toDate() : null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      error: !!errors.tenantConfig?.fiscalYearEnd,
                      helperText:
                        errors.tenantConfig?.fiscalYearEnd?.message ||
                        "Select the fiscal year end date",
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormGroup sx={{ mt: 2 }}>
              <Controller
                name="tenantConfig.allowOrgStructure"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value || false}
                        onChange={field.onChange}
                      />
                    }
                    label="Allow Organizational Structure"
                  />
                )}
              />
              <Controller
                name="tenantConfig.requireCompanyNode"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value || false}
                        onChange={field.onChange}
                      />
                    }
                    label="Require Top-Level Company Node"
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </FieldSection>
      </Grid>
    </LocalizationProvider>
  );
}
