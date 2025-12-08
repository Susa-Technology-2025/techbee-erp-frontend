import {
  Autocomplete,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useCallback, useMemo } from "react";

interface MRTAsyncAutoCompleteProps {
  value: any;
  onChange: (newValue: any) => void;
  onInputChange: (newInputValue: string) => void;
  options: any[];
  loading: boolean;
  getOptionLabel: (option: any) => string;
  getOptionValue: (option: any) => any;
  label: string;
  onCreate?: (inputValue: string) => void;
  currentInputValue: string;
  error?: boolean;
  helperText?: string;
  valueIsObject?: boolean;
}

export const MRTAsyncAutoComplete = ({
  value,
  onChange,
  onInputChange,
  options,
  loading,
  getOptionLabel,
  getOptionValue,
  label,
  onCreate,
  currentInputValue,
  error,
  helperText,
  valueIsObject = true,
}: MRTAsyncAutoCompleteProps) => {
  const idToFind = useMemo(
    () => (valueIsObject && value ? getOptionValue(value) : value),
    [valueIsObject, value, getOptionValue]
  );
  const selectedOption = useMemo(
    () =>
      options.find((opt) => opt && getOptionValue(opt) === idToFind) || null,
    [options, getOptionValue, idToFind]
  );

  const showCreateOption = useMemo(
    () => onCreate && !loading,
    [onCreate, loading]
  );

  const filterOptions = useCallback(
    (options, { inputValue }) => {
      if (!inputValue) {
        return options;
      }
      return options.filter((option) => {
        // Handle the special 'create-new' option directly
        if (option.id === "create-new") {
          return option.name.toLowerCase().includes(inputValue.toLowerCase());
        }

        const optionLabel = getOptionLabel(option);
        // Ensure optionLabel is a string before calling toLowerCase()
        if (typeof optionLabel !== "string") {
          return false;
        }

        return optionLabel.toLowerCase().startsWith(inputValue.toLowerCase());
      });
    },
    [getOptionLabel]
  );

  const filteredOptions = useMemo(
    () =>
      showCreateOption
        ? [
            { id: "create-new", name: `Create new "${currentInputValue}"` },
            ...options,
          ]
        : options,
    [showCreateOption, currentInputValue, options]
  );

  const handleGetOptionLabel = useCallback(
    (option: any) => {
      if (typeof option === "string") return option;
      if (option.id === "create-new") return option.name;
      return getOptionLabel(option);
    },
    [getOptionLabel]
  );

  const handleInputChange = useCallback(
    (event: any, newInputValue: string) => {
      onInputChange(newInputValue);
    },
    [onInputChange]
  );

  const handleChange = useCallback(
    (event: any, newValue: any) => {
      if (newValue && newValue.id === "create-new") {
        onCreate?.(currentInputValue);
      } else {
        const valueToEmit = newValue
          ? valueIsObject
            ? newValue
            : getOptionValue(newValue)
          : null;
        onChange(valueToEmit);
      }
    },
    [onCreate, currentInputValue, valueIsObject, getOptionValue, onChange]
  );

  const handleRenderOption = useCallback(
    (props: any, option: any) => {
      if (option.id === "create-new") {
        return (
          <Button
            {...props}
            fullWidth
            onClick={() => onCreate?.(currentInputValue)}
          >
            Create New
          </Button>
        );
      } else {
        return (
          <li {...props} key={option.id}>
            {handleGetOptionLabel(option)}
          </li>
        );
      }
    },
    [onCreate, currentInputValue, handleGetOptionLabel]
  );

  return (
    <Autocomplete
      options={filteredOptions}
      loading={loading}
      getOptionLabel={handleGetOptionLabel}
      value={selectedOption}
      onChange={handleChange}
      // Pass onInputChange as a prop to the Autocomplete for the parent to control
      onInputChange={handleInputChange}
      filterOptions={filterOptions}
      renderOption={handleRenderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="standard"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
