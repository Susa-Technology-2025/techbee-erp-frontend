"use client";

import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useFormContext } from "react-hook-form";
import { SxProps, Theme } from "@mui/material/styles";

type BaseFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
};

export const RHFInput = ({
  name,
  label,
  helperText,
  sx,
  startAdornment,
  type,
  ...rest
}: BaseFieldProps & { startAdornment?: React.ReactNode } & any) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const actualType = isPasswordField && !showPassword ? "password" : "text";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          fullWidth
          type={actualType}
          value={field.value ?? ""}
          label={label}
          error={!!error}
          helperText={error?.message || helperText}
          sx={sx}
          slotProps={{
            input: {
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : undefined,
              endAdornment: isPasswordField ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      )}
    />
  );
};
