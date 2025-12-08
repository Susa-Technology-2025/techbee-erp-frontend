"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  useController,
  useFormContext,
  FieldValues,
  Path,
} from "react-hook-form";
import { Autocomplete, TextField, CircularProgress, Chip } from "@mui/material";

interface OptionType {
  id: string;
  name?: string;
  [key: string]: any;
}

interface RHFMultiAutocompleteProps<
  TFormValues extends FieldValues,
  TFetcherData
> {
  name: Path<TFormValues>;
  fetcher: () => {
    data?: TFetcherData[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
  };
  getOptionLabel: (option: OptionType) => string;
  getOptionValue: (option: OptionType) => string;
  label: string;
  helperText?: string;
  sx?: object;
  initialDisplayValue?: string[];
}

export function RHFMultiAutocomplete<
  TFormValues extends FieldValues,
  TFetcherData extends OptionType
>({
  name,
  fetcher,
  getOptionLabel,
  getOptionValue,
  label,
  helperText,
  sx,
  initialDisplayValue,
}: RHFMultiAutocompleteProps<TFormValues, TFetcherData>) {
  const { control } = useFormContext<TFormValues>();
  const {
    field: { value, onChange, ...field },
    fieldState: { error },
  } = useController({ name, control });

  const { data: fetchedOptions = [], isLoading, isFetching } = fetcher();
  const [open, setOpen] = useState(false);

  const selectedOptions = useMemo(() => {
    if (
      !Array.isArray(value) ||
      value.length === 0 ||
      fetchedOptions.length === 0
    ) {
      return [];
    }
    return value
      .map((id: string) =>
        fetchedOptions.find((option) => getOptionValue(option) === id)
      )
      .filter(Boolean) as TFetcherData[];
  }, [value, fetchedOptions, getOptionValue]);

  useEffect(() => {
    if (
      initialDisplayValue &&
      fetchedOptions.length > 0 &&
      (!value || value.length === 0)
    ) {
      const initialIds = initialDisplayValue
        .map((displayLabel) => {
          const foundOption = fetchedOptions.find(
            (option) => getOptionLabel(option) === displayLabel
          );
          return foundOption ? getOptionValue(foundOption) : null;
        })
        .filter(Boolean) as string[];

      if (initialIds.length > 0) {
        onChange(initialIds);
      }
    }
  }, [
    initialDisplayValue,
    fetchedOptions,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
  ]);

  return (
    <Autocomplete
      {...field}
      multiple
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={fetchedOptions}
      loading={isLoading || isFetching}
      value={selectedOptions}
      onChange={(_, newValue) => {
        onChange(newValue.map(getOptionValue));
      }}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) =>
        getOptionValue(option) === getOptionValue(val)
      }
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            key={getOptionValue(option)}
            sx={{ m: 0.5 }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="normal"
          fullWidth
          error={!!error}
          helperText={error ? error.message : helperText}
          color="secondary"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading || isFetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      )}
      sx={sx}
    />
  );
}
