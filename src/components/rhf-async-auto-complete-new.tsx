"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useState, SyntheticEvent, useEffect, useMemo } from "react";
import { Autocomplete, Box, TextField, CircularProgress } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

type RHFAutocompleteProps<T extends FieldValues, Option> = {
    name?: Path<T>;
    apiEndPoint: string;
    getOptionLabel: (option: Option) => string;
    getOptionValue: (option: Option) => string;
    helperText?: string;
    sx?: SxProps<Theme>;
    onSelected?: (option: Option | null) => void;
    onChange?: (value: string) => void;
    value?: string;
    initialDisplayValue?: string;
    label?: string;
    isOptionEqualToValue?: (option: Option, value: Option) => boolean;
    renderOption?: (
        props: React.HTMLAttributes<HTMLLIElement> & { key?: string },
        option: Option
    ) => React.ReactNode;
    enabled?: boolean;
};

export function RHFAutocomplete<T extends FieldValues, Option>({
    name,
    apiEndPoint,
    getOptionLabel,
    getOptionValue,
    helperText,
    sx,
    onSelected,
    onChange,
    value,
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
    enabled = true,
}: RHFAutocompleteProps<T, Option>) {
    // Safer form context access
    const formContext = useFormContext();
    const isInsideForm = !!formContext && !!name;

    const [open, setOpen] = useState(false);
    const [allOptions, setAllOptions] = useState<Option[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [initialized, setInitialized] = useState(false);

    const { data, isLoading, isError, refetch } = useDataQuery<any>({
        apiEndPoint,
        enabled: enabled && open,
    });

    const optionsData = useMemo(() => {
        if (!data) return [];

        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
        if (data?.content && Array.isArray(data.content)) return data.content;
        if (data?.items && Array.isArray(data.items)) return data.items;
        if (data?.result && Array.isArray(data.result)) return data.result;

        console.warn('Unexpected data structure from API:', data);
        return [];
    }, [data]);

    // Get the current value based on context
    const currentValue = useMemo(() => {
        if (isInsideForm && formContext) {
            return formContext.watch(name!);
        }
        return value || "";
    }, [isInsideForm, formContext, name, value]);

    useEffect(() => {
        if (optionsData && Array.isArray(optionsData)) {
            setAllOptions(optionsData);
            setFilteredOptions(optionsData);

            // Set initial input value if we have a current value
            if (currentValue && !initialDisplayValue) {
                const foundOption = optionsData.find(
                    (option: Option) => getOptionValue(option) === currentValue
                );
                if (foundOption) {
                    setInputValue(getOptionLabel(foundOption));
                }
            }

            setInitialized(true);
        }
    }, [optionsData, currentValue, initialDisplayValue, getOptionValue, getOptionLabel]);

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

    const currentSelectedValue: Option | null = useMemo(() => {
        if (!initialized || !currentValue) return null;

        const foundOption = allOptions.find(
            (option) => getOptionValue(option) === currentValue
        );

        if (foundOption) return foundOption;

        if (initialDisplayValue) {
            return {
                [getOptionValue({} as Option)]: currentValue,
                [getOptionLabel({} as Option)]: initialDisplayValue,
            } as unknown as Option;
        }

        return null;
    }, [currentValue, allOptions, initialDisplayValue, getOptionValue, initialized]);

    const handleChange = (newValue: Option | null) => {
        const newValueId = newValue ? getOptionValue(newValue) : "";

        if (isInsideForm && formContext) {
            formContext.setValue(name!, newValueId, { shouldValidate: true });
        } else {
            onChange?.(newValueId);
        }

        onSelected?.(newValue);
    };

    // Common Autocomplete props to avoid duplication
    const commonAutocompleteProps = {
        open,
        onOpen: () => {
            setOpen(true);
            if (allOptions.length === 0) {
                refetch();
            }
        },
        onClose: () => setOpen(false),
        loading: isLoading,
        options: filteredOptions,
        getOptionLabel,
        isOptionEqualToValue,
        onInputChange: (event: SyntheticEvent, newInputValue: string) => {
            setInputValue(newInputValue);
        },
        onChange: (_: any, newValue: Option | null) => handleChange(newValue),
        value: currentSelectedValue,
        multiple: false,
        inputValue,
        renderInput: (params: any) => (
            <TextField
                {...params}
                fullWidth
                helperText={helperText}
                label={label}
                sx={sx}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
            />
        ),
        renderOption,
        filterOptions: (options: Option[]) => options,
    };

    // If inside form context with name, use Controller
    if (isInsideForm && formContext) {
        return (
            <Controller
                name={name!}
                control={formContext.control}
                render={({
                    field: { ref },
                    fieldState: { error },
                }) => (
                    <Autocomplete
                        {...commonAutocompleteProps}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={ref}
                                error={!!error}
                                helperText={error?.message || helperText}
                                fullWidth
                                label={label}
                                sx={sx}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                )}
            />
        );
    }

    // Standalone version
    return <Autocomplete {...commonAutocompleteProps} />;
}