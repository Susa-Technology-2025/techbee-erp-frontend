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

import {
  Autocomplete,
  Box,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";

/**
 * @interface AutocompleteOption
 * @description Defines the base structure for any item used with RHFControlledMultipleAutocomplete.
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
 * @interface RHFControlledMultipleAutocompleteProps
 * @description Props for the RHFControlledMultipleAutocomplete component.
 * @template T The type of the form's FieldValues.
 * @template TData The type of the data items in the autocomplete dropdown.
 */
type RHFControlledMultipleAutocompleteProps<
  T extends FieldValues,
  TData extends AutocompleteOption
> = {
  /**
   * @property name
   * @description The name of the field in the React Hook Form. This field will store an array of IDs (string[]).
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
   * @property onItemsSelected
   * @description Callback function triggered when items are selected or unselected.
   * @param items An array of full selected item objects.
   */
  onItemsSelected?: (items: TData[]) => void;
  /**
   * @property fetcher
   * @description The asynchronous function used to fetch autocomplete options.
   * It receives the current search term.
   */
  fetcher: Fetcher<TData>;
  /**
   * @property getOptionLabel
   * @description A function that returns the string representation of an option
   * to be displayed in the input field and for the Chip label.
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
   * @property initialValues
   * @description An array of full item objects to display when the component loads,
   * useful for pre-populating forms in edit mode. The IDs of these objects should
   * match the IDs stored in the form's state.
   */
  initialValues?: TData[] | null;
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
 * @function RHFControlledMultipleAutocomplete
 * @description A reusable multiple-select Autocomplete component integrated with React Hook Form.
 * It supports generic data types and custom data fetching logic.
 * @template T The type of the form's FieldValues.
 * @template TData The type of the data items in the autocomplete dropdown.
 */
export function RHFControlledMultipleAutocomplete<
  T extends FieldValues,
  TData extends AutocompleteOption
>({
  name,
  helperText,
  sx,
  label,
  onItemsSelected,
  fetcher,
  getOptionLabel,
  renderOption,
  initialValues = [],
  minSearchTermLength = 2,
  debounceTime = 500,
}: RHFControlledMultipleAutocompleteProps<T, TData>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allKnownItemsCache = useRef<Map<string, TData>>(new Map());

  useEffect(() => {
    initialValues?.forEach((item) => {
      if (item && item.id) {
        allKnownItemsCache.current.set(item.id, item);
      }
    });
  }, [initialValues]);

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
        const currentSelectedValues: TData[] = useMemo(() => {
          if (!Array.isArray(value)) return [];

          const selectedItems: TData[] = [];
          const rhfIds = value as string[];

          rhfIds.forEach((id) => {
            const cachedItem = allKnownItemsCache.current.get(id);
            if (cachedItem) {
              selectedItems.push(cachedItem);
            } else {
              const initialItem = initialValues?.find((item) => item.id === id);
              if (initialItem) {
                selectedItems.push(initialItem);

                allKnownItemsCache.current.set(initialItem.id, initialItem);
              }
            }
          });
          return selectedItems;
        }, [value, initialValues]);

        const optionsToDisplay = useMemo(() => {
          const combinedOptions = [...fetchedOptions];
          currentSelectedValues.forEach((selectedOption) => {
            if (!combinedOptions.some((opt) => opt.id === selectedOption.id)) {
              combinedOptions.push(selectedOption);
            }
          });
          return combinedOptions;
        }, [fetchedOptions, currentSelectedValues]);

        return (
          <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            loading={loading}
            multiple
            options={optionsToDisplay}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, newValue) =>
              option.id === newValue.id
            }
            onInputChange={(event: SyntheticEvent, newInputValue: string) => {
              setSearchTerm(newInputValue);
            }}
            onChange={(_, newValues: TData[]) => {
              rhfOnChange(newValues.map((item) => item.id));

              if (onItemsSelected) {
                onItemsSelected(newValues);
              }

              newValues.forEach((item) => {
                allKnownItemsCache.current.set(item.id, item);
              });
            }}
            value={currentSelectedValues}
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
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={getOptionLabel(option)}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            renderOption={
              renderOption ||
              ((props, option) => (
                <Box component="li" {...props}>
                  {getOptionLabel(option)}
                </Box>
              ))
            }
          />
        );
      }}
    />
  );
}
