"use client";

import { useMemo } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/material";
import { type FieldLevelMeta } from "@/lib/schemas/types";

type AutocompleteFieldProps = {
  value: any;
  onChange: (val: any) => void;
  helperText: string | undefined;
  meta: FieldLevelMeta;
  error: boolean;
  label: string;
  required: boolean;
  disabled: boolean;
};

export function StaticAutocomplete({
  value,
  onChange,
  meta,
  helperText,
  error,
  label,
  required,
  disabled,
}: AutocompleteFieldProps) {
  const { autoComplete } = meta.formRelated;

  if (!autoComplete || autoComplete.async) return <Box />;

  const options = autoComplete.options ?? [];

  const mappedValue = useMemo(() => {
    if (!value) return autoComplete.multiple ? [] : null;
    if (autoComplete.multiple) {
      return (value as any[])
        .map((v) => options.find((o) => autoComplete.getOptionsValue(o) === v))
        .filter(Boolean);
    } else {
      return (
        options.find((o) => autoComplete.getOptionsValue(o) === value) || null
      );
    }
  }, [value, options, autoComplete]);

  return (
    <Autocomplete
      multiple={autoComplete.multiple}
      options={options}
      disableCloseOnSelect={autoComplete.multiple}
      disabled={disabled}
      getOptionLabel={autoComplete.getOptionsLabel}
      isOptionEqualToValue={(option, val) =>
        autoComplete.getOptionsValue(option) ===
        autoComplete.getOptionsValue(val)
      }
      value={mappedValue}
      onChange={(_, newValue) => {
        if (autoComplete.multiple) {
          onChange(
            (newValue as any[]).map((v) => autoComplete.getOptionsValue(v))
          );
        } else {
          onChange(newValue ? autoComplete.getOptionsValue(newValue) : null);
        }
      }}
      // The fix is here: destructure 'key' from props and pass it directly to <li>
      renderOption={({ key, ...restProps }, option) => (
        <li key={key} {...restProps}>
          {autoComplete.getOptionsLabel(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={meta.formRelated.placeholder}
          helperText={helperText}
          error={error}
          variant="standard"
          required={required}
        />
      )}
    />
  );
}
