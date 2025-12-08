"use client";

import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { SxProps, Theme } from "@mui/material/styles";

type BaseFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
};

export const RHFDatePicker = ({
  name,
  label,
  helperText,
  sx,
}: BaseFieldProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value =
          field.value instanceof Date && !isNaN(field.value.getTime())
            ? field.value.toISOString().substring(0, 10)
            : "";

        return (
          <TextField
            name={field.name}
            onBlur={field.onBlur}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(val ? new Date(val) : null);
            }}
            value={value}
            error={!!error}
            helperText={error?.message || helperText}
            label={label}
            type="date"
            fullWidth
            inputRef={field.ref}
            sx={sx}
          />
        );
      }}
    />
  );
};
