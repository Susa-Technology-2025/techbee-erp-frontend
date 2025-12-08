// payroll-period-selector.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface PayrollPeriodSelectorProps {
  methods: UseFormReturn<any>;
  formMode: "create" | "edit";
  defaultValues?: any;
}

export const PayrollPeriodSelector: React.FC<PayrollPeriodSelectorProps> = ({
  methods,
  formMode,
  defaultValues,
}) => {
  const session = useSelector((state: RootState) => state.session);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [periods, setPeriods] = useState<any[]>([]);

  // Fetch payroll periods
  const { data: periodsResponse, isLoading: periodsLoading } =
    useDataQuery<any>({
      apiEndPoint: "https://api.techbee.et/api/hr/payrollPeriods",
      enabled: !!session,
      noFilter: true,
    });

  // Extract periods data from response
  useEffect(() => {
    if (periodsResponse) {
      const periodsData =
        periodsResponse.data ||
        periodsResponse.content ||
        periodsResponse.items ||
        periodsResponse.result ||
        [];
      setPeriods(periodsData);
    }
  }, [periodsResponse]);

  // Handle period selection
  const handlePeriodChange = (event: any) => {
    const periodId = event.target.value;
    const period = periods.find((p) => p.id === periodId);

    setSelectedPeriod(period);

    if (period) {
      // Auto-fill period start and end dates
      methods.setValue(
        "periodStart",
        formatDateForDateTimeLocal(period.startDate),
        { shouldValidate: true }
      );
      methods.setValue(
        "periodEnd",
        formatDateForDateTimeLocal(period.endDate),
        { shouldValidate: true }
      );
    }
  };

  // Format date for datetime-local input
  const formatDateForDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Period Selection */}
      <FormControl fullWidth variant="standard">
        <InputLabel>Payroll Period</InputLabel>
        <Select
          value={selectedPeriod?.id || ""}
          onChange={handlePeriodChange}
          label="Payroll Period"
          disabled={periodsLoading}
        >
          {periodsLoading ? (
            <MenuItem disabled>Loading periods...</MenuItem>
          ) : periods.length === 0 ? (
            <MenuItem disabled>No payroll periods available</MenuItem>
          ) : (
            periods.map((period) => (
              <MenuItem key={period.id} value={period.id}>
                {period.name} ({formatDateForDisplay(period.startDate)} -{" "}
                {formatDateForDisplay(period.endDate)})
              </MenuItem>
            ))
          )}
        </Select>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Select a payroll period to auto-fill the dates, or manually set the
          dates below
        </Typography>
      </FormControl>

      {/* Selected Period Info */}
      {selectedPeriod && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Selected:</strong> {selectedPeriod.name}
            <br />
            <strong>Description:</strong> {selectedPeriod.description}
            <br />
            <strong>Fiscal Year:</strong> {selectedPeriod.fiscalYearEc}
          </Typography>
        </Alert>
      )}

      {/* Date Inputs */}
      <Stack direction="row" spacing={2}>
        <TextField
          label="Period Start"
          type="datetime-local"
          value={methods.watch("periodStart") || ""}
          onChange={(e) =>
            methods.setValue("periodStart", e.target.value, {
              shouldValidate: true,
            })
          }
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!methods.formState.errors.periodStart}
          variant="standard"
          helperText={
            methods.formState.errors.periodStart?.message ||
            "Start date of the payroll period"
          }
        />

        <TextField
          label="Period End"
          type="datetime-local"
          value={methods.watch("periodEnd") || ""}
          onChange={(e) =>
            methods.setValue("periodEnd", e.target.value, {
              shouldValidate: true,
            })
          }
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!methods.formState.errors.periodEnd}
          variant="standard"
          helperText={
            methods.formState.errors.periodEnd?.message ||
            "End date of the payroll period"
          }
        />
      </Stack>

      {/* Validation Note */}
      {(methods.watch("periodStart") || methods.watch("periodEnd")) && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          <Typography variant="caption">
            You can manually adjust the dates if needed. Only the start and end
            dates will be saved to the database.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
