"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useState, SyntheticEvent, useEffect, useMemo } from "react";
import { Autocomplete, Box, TextField, CircularProgress } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";

type RTKQueryHook<ResultType> = () => {
  data?: ResultType[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  currentData?: ResultType[];
};

type RHFAutocompleteProps<T extends FieldValues, Option> = {
  name: Path<T>;
  fetcher: RTKQueryHook<Option>;
  getOptionLabel: (option: Option) => string;
  getOptionValue: (option: Option) => string;
  helperText?: string;
  sx?: SxProps<Theme>;
  onSelected?: (option: Option | null) => void;
  initialDisplayValue?: string;
  label?: string;
  isOptionEqualToValue?: (option: Option, value: Option) => boolean;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: string },
    option: Option
  ) => React.ReactNode;
};

export function RHFAutocomplete<T extends FieldValues, Option>({
  name,
  fetcher,
  getOptionLabel,
  getOptionValue,
  helperText,
  sx,
  onSelected,
  initialDisplayValue,
  label = "Select",
  isOptionEqualToValue = (option, value) =>
    getOptionValue(option) === getOptionValue(value),
  renderOption = (props, option) => {
    const { key, ...rest } = props;
    return (
      <Box component="li" key={key} {...rest}>
        {getOptionLabel(option)}
      </Box>
    );
  },
}: RHFAutocompleteProps<T, Option>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [allOptions, setAllOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [initialized, setInitialized] = useState(false);

  const { data, isLoading, isError, refetch, currentData } = fetcher();

  const initialValue = useMemo(
    () => control._formValues[name],
    [control._formValues, name]
  );

  useEffect(() => {
    const options = currentData || data || [];
    if (options && Array.isArray(options)) {
      setAllOptions(options);
      setFilteredOptions(options);

      if (initialValue && !initialDisplayValue) {
        const foundOption = options.find(
          (option: Option) => getOptionValue(option) === initialValue
        );
        if (foundOption) {
          setInputValue(getOptionLabel(foundOption));
        }
      }

      setInitialized(true);
    }
  }, [
    data,
    currentData,
    initialValue,
    initialDisplayValue,
    getOptionValue,
    getOptionLabel,
  ]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions(allOptions);
    } else {
      const searchTerm = inputValue.toLowerCase();
      const filtered = allOptions.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(searchTerm)
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, allOptions, getOptionLabel]);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange: rhfOnChange, ref },
        fieldState: { error },
      }) => {
        const currentSelectedValue: Option | null = useMemo(() => {
          if (!initialized) return null;

          if (!value) return null;

          const foundOption = allOptions.find(
            (option) => getOptionValue(option) === value
          );

          if (foundOption) return foundOption;

          if (initialDisplayValue) {
            return {
              [getOptionValue({} as Option)]: value,
              [getOptionLabel({} as Option)]: initialDisplayValue,
            } as unknown as Option;
          }

          return null;
        }, [
          value,
          allOptions,
          initialDisplayValue,
          getOptionValue,
          initialized,
        ]);

        return (
          <Autocomplete
            open={open}
            onOpen={() => {
              setOpen(true);
              refetch();
            }}
            onClose={() => setOpen(false)}
            loading={isLoading}
            options={filteredOptions}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            onInputChange={(event: SyntheticEvent, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
            onChange={(_, newValue) => {
              const newValueId = newValue ? getOptionValue(newValue) : "";
              rhfOnChange(newValueId);
              if (onSelected) {
                onSelected(newValue);
              }
            }}
            value={currentSelectedValue}
            multiple={false}
            inputValue={inputValue}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                inputRef={ref}
                error={!!error}
                helperText={error?.message || helperText}
                label={label}
                sx={sx}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={renderOption}
            filterOptions={(options) => options}
          />
        );
      }}
    />
  );
}
