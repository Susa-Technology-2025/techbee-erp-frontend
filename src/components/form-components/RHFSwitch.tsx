"use client";

import { Checkbox, FormControlLabel, Typography, Box } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export const RHFSwitch = ({
  name,
  label,
  description,
  sx,
}: {
  name: string;
  label: string;
  description?: string;
  sx?: any;
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={
            <Box>
              <Typography variant="body1">{label}</Typography>
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Box>
          }
          sx={sx}
        />
      )}
    />
  );
};
