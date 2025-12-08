"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  useState,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from "react";

import { Autocomplete, Box, TextField, CircularProgress } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";

/**
 * @interface AutocompleteOption
 * @description Defines the base structure for any item used with RHFControlledAutocomplete.
 * All options must have an 'id' property.
 */
export type AutocompleteOption = {
  id: string;
  [key: string]: any;
};

/**
 * @interface Fetcher
 * @description Type definition for the asynchronous function that fetches data.
 * @template TData The type of the data items being fetched, extending AutocompleteOption.
 * @param searchTerm The string entered by the user for searching.
 * @returns A Promise that resolves to an array of TData items.
 */
type Fetcher<TData extends AutocompleteOption> = (
  searchTerm: string
) => Promise<TData[]>;

/**
 * @interface RHFControlledAutocompleteProps
 * @description Props for the RHFControlledAutocomplete component.
 * @template T The type of the form's FieldValues.
 * @template TData The type of the data items in the autocomplete dropdown.
 */
type RHFControlledAutocompleteProps<
  T extends FieldValues,
  TData extends AutocompleteOption
> = {
  /**
   * @property name
   * @description The name of the field in the React Hook Form.
   */
  name: Path<T>;
  /**
   * @property helperText
   * @description Helper text to display below the input.
   */
  helperText?: string;
  /**
   * @property sx
   * @description Custom Material-UI sx prop for styling.
   */
  sx?: SxProps<Theme>;
  /**
   * @property label
   * @description The label for the TextField input.
   */
  label: string;
  /**
   * @property onItemSelected
   * @description Callback function triggered when an item is selected.
   * @param item The full selected item object, or null if unselected.
   */
  onItemSelected?: (item: TData | null) => void;
  /**
   * @property fetcher
   * @description The asynchronous function used to fetch autocomplete options.
   * It receives the current search term.
   */
  fetcher: Fetcher<TData>;
  /**
   * @property getOptionLabel
   * @description A function that returns the string representation of an option
   * to be displayed in the input field.
   * @param option The data item.
   * @returns The string label for the option.
   */
  getOptionLabel: (option: TData) => string;
  /**
   * @property renderOption
   * @description Optional function to customize how each option is rendered in the dropdown list.
   * If not provided, `getOptionLabel` is used for default rendering.
   * @param props HTML attributes for the list item.
   * @param option The data item to render.
   * @returns A ReactNode representing the rendered option.
   */
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: TData
  ) => ReactNode;
  /**
   * @property initialValue
   * @description The initial full item object to display when the component loads,
   * useful for pre-populating forms in edit mode.
   * The ID of this object should match the ID stored in the form's state.
   */
  initialValue?: TData | null;
  /**
   * @property minSearchTermLength
   * @description The minimum number of characters required in the search term
   * before triggering a fetch request. Defaults to 2.
   */
  minSearchTermLength?: number;
  /**
   * @property debounceTime
   * @description The delay (in milliseconds) before triggering a fetch request
   * after the search term changes. Defaults to 500ms.
   */
  debounceTime?: number;
};

/**
 * @function RHFControlledAutocomplete
 * @description A reusable Autocomplete component integrated with React Hook Form.
 * It supports generic data types and custom data fetching logic.
 * @template T The type of the form's FieldValues.
 * @template TData The type of the data items in the autocomplete dropdown.
 */
export function RHFControlledAutocomplete<
  T extends FieldValues,
  TData extends AutocompleteOption
>({
  name,
  helperText,
  sx,
  label,
  onItemSelected,
  fetcher,
  getOptionLabel,
  renderOption,
  initialValue = null,
  minSearchTermLength = 2,
  debounceTime = 500,
}: RHFControlledAutocompleteProps<T, TData>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allKnownItemsCache = useRef<Map<string, TData>>(new Map());

  useEffect(() => {
    if (initialValue && initialValue.id) {
      allKnownItemsCache.current.set(initialValue.id, initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    let active = true;

    if (!open) {
      setFetchedOptions([]);
      return undefined;
    }

    if (searchTerm.length < minSearchTermLength) {
      setFetchedOptions([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const fetchData = async () => {
      try {
        const data = await fetcher(searchTerm);

        if (active && Array.isArray(data)) {
          setFetchedOptions(data);
          data.forEach((item) => {
            if (item.id) {
              allKnownItemsCache.current.set(item.id, item);
            }
          });
        } else {
          console.warn("Fetcher did not return an array:", data);
          setFetchedOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFetchedOptions([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, debounceTime);

    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [searchTerm, open, fetcher, minSearchTermLength, debounceTime]);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange: rhfOnChange, ref },
        fieldState: { error },
      }) => {
        /**
         * @constant currentSelectedValue
         * @description Memoized value representing the currently selected full item object.
         * It attempts to retrieve the full object from cache based on the RHF value (which stores ID).
         * If not in cache, it checks `initialValue` for pre-population.
         */
        const currentSelectedValue: TData | null = useMemo(() => {
          if (value && typeof value === "string") {
            const cachedItem = allKnownItemsCache.current.get(value);
            if (cachedItem) {
              return cachedItem;
            }

            if (initialValue && initialValue.id === value) {
              return initialValue;
            }

            return null;
          }
          return null;
        }, [value, initialValue]);

        /**
         * @constant optionsToDisplay
         * @description Memoized array of options to display in the Autocomplete dropdown.
         * It combines currently fetched options with the `currentSelectedValue`
         * to ensure the selected item is always visible.
         */
        const optionsToDisplay = useMemo(() => {
          const combinedOptions = [...fetchedOptions];
          if (currentSelectedValue && currentSelectedValue.id) {
            if (
              !combinedOptions.some((opt) => opt.id === currentSelectedValue.id)
            ) {
              combinedOptions.push(currentSelectedValue);
            }
          }
          return combinedOptions;
        }, [fetchedOptions, currentSelectedValue]);

        return (
          <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            loading={loading}
            options={optionsToDisplay}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, newValue) =>
              option.id === newValue.id
            }
            onInputChange={(event: SyntheticEvent, newInputValue: string) => {
              setSearchTerm(newInputValue);
            }}
            onChange={(_, newValue) => {
              rhfOnChange((newValue as TData)?.id || "");

              if (onItemSelected) {
                onItemSelected(newValue as TData | null);
              }

              if (newValue && newValue.id) {
                allKnownItemsCache.current.set(newValue.id, newValue);
              }
            }}
            value={currentSelectedValue}
            multiple={false}
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
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={
              renderOption ||
              ((props, option) => (
                <Box component="li" {...props}>
                  {getOptionLabel(option)} {/* Default rendering of option */}
                </Box>
              ))
            }
          />
        );
      }}
    />
  );
}
