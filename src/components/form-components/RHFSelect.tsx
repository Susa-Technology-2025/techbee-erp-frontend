"use client";

import { TextField, MenuItem } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { SxProps, Theme } from "@mui/material/styles";

type BaseFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
};

export const RHFSelect = ({
  name,
  label,
  options,
  helperText,
  sx,
  ...rest
}: BaseFieldProps & {
  options: (string | number)[];
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          fullWidth
          select
          label={label}
          error={!!error}
          helperText={error?.message || helperText}
          sx={sx}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
