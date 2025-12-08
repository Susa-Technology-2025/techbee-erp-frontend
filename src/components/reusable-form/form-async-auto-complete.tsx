import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";

interface FormAsyncAutoCompleteProps {
  value: any;
  onChange: (newValue: any) => void;
  fetchOptions: (query: string) => Promise<any[]>;
  getOptionLabel: (option: any) => string;
  getOptionValue: (option: any) => any;
  label: string;
  error?: boolean;
  helperText?: string;
}

export const FormAsyncAutoComplete = ({
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
  getOptionValue,
  label,
  error,
  helperText,
}: FormAsyncAutoCompleteProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    (async () => {
      setLoading(true);
      const newOptions = await fetchOptions(inputValue);
      if (active) {
        setOptions(newOptions);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [inputValue, open, fetchOptions]);

  const selectedOption =
    options.find((option) => getOptionValue(option) === value) || null;

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      value={selectedOption}
      filterOptions={(x) => x}
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
