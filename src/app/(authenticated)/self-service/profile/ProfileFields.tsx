// src/components/profile/ProfileFields.tsx
"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Grid, TextField, Autocomplete } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  timezoneOptions,
  genderOptions,
  nationalityOptions,
  minAgeDate,
} from "./profileOptions";
import FileUploadWithPreview from "@/components/ReusableFormDrawer/file-upload";

export function ProfileFields() {
  const {
    control,
    formState: { errors, defaultValues },
  } = useFormContext<any>();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FileUploadWithPreview
            folder="avatars"
            fileName={`avatar-${defaultValues.user?.id}`}
            watchField="avatarUrl"
            acceptedFileTypes={["image/*"]}
            label="Profile Picture"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <DatePicker
                label="Date of Birth (Min Age: 13)"
                value={value ? dayjs(value) : null}
                onChange={(date) => onChange(date ? date.toISOString() : null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "standard",
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth?.message,
                  },
                }}
                maxDate={minAgeDate}
                {...restField}
              />
            )}
          />
        </Grid>

        {/* Gender (using Autocomplete) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Autocomplete
                options={genderOptions}
                getOptionLabel={(option) => option}
                value={value || null}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...restField}
                    label="Gender"
                    fullWidth
                    variant="standard"
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Nationality (using Autocomplete) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="nationality"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Autocomplete
                options={nationalityOptions}
                getOptionLabel={(option) => option}
                value={value || null}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...restField}
                    label="Nationality"
                    fullWidth
                    variant="standard"
                    error={!!errors.nationality}
                    helperText={
                      errors.nationality?.message || "e.g., American, British"
                    }
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                variant="standard"
                error={!!errors.phoneNumber}
                helperText={
                  errors.phoneNumber?.message || "Include country code"
                }
                placeholder="+1 (555) 123-4567"
              />
            )}
          />
        </Grid>

        {/* Address (Single-line TextField) */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Address"
                fullWidth
                variant="standard"
                error={!!errors.address}
                helperText={errors.address?.message}
                placeholder="Enter your street address, city, and zip code"
              />
            )}
          />
        </Grid>

        {/* Timezone (using Autocomplete) */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="timezone"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Autocomplete
                options={timezoneOptions}
                getOptionLabel={(option) => option}
                value={value || null}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...restField}
                    label="Timezone"
                    fullWidth
                    variant="standard"
                    error={!!errors.timezone}
                    helperText={
                      errors.timezone?.message || "Select your local timezone"
                    }
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Bio (Single-line TextField) */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bio (Max 500 characters)"
                fullWidth
                variant="standard"
                error={!!errors.bio}
                helperText={
                  errors.bio?.message ||
                  `${field.value?.length || 0}/500 characters`
                }
                placeholder="Briefly tell us about yourself..."
              />
            )}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
