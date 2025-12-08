// src/components/form-components/RHFMultipleEmployeeAutocomplete.tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useState, SyntheticEvent, useEffect, useMemo, useRef } from "react";

import {
  Autocomplete,
  Box,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode: string;
  phoneNumber: string;
  label: string; // Used for display in Autocomplete
};

type RHFMultipleEmployeeAutocompleteProps<T extends FieldValues> = {
  name: Path<T>;
  helperText?: string;
  label?: string; // Optional label for the input
  sx?: SxProps<Theme>;
  onEmployeesSelected?: (employees: Employee[]) => void;
  // --- NEW PROP FOR EDIT FORMS ---
  initialEmployeesForDisplay?: Array<{ id: string; name: string }>;
};

export function RHFMultipleEmployeeAutocomplete<T extends FieldValues>({
  name,
  helperText,
  label = "Employees", // Default label
  sx,
  onEmployeesSelected,
  initialEmployeesForDisplay, // Destructure the new prop
}: RHFMultipleEmployeeAutocompleteProps<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Using useRef for the cache to prevent re-creation on re-renders
  const allKnownEmployeesCache = useRef<Map<string, Employee>>(new Map());

  useEffect(() => {
    let active = true;

    if (!open) {
      setFetchedOptions([]);
      return undefined;
    }

    // Only fetch if searchTerm is significant
    if (searchTerm.length < 2) {
      setFetchedOptions([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const fetchEmployees = async () => {
      try {
        // Mock API call - replace with your actual API endpoint
        const response = await fetch(
          `http://192.168.81.154:3003/api/employees?where[firstName][contains]=${searchTerm}`,
          {
            headers: {
              "x-tenant-code": "default", // Example tenant header
            },
          }
        );
        const data = await response.json();

        if (active && Array.isArray(data)) {
          const mappedEmployees: Employee[] = data.map(
            (employee: Employee) => ({
              id: employee.id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              employeeCode: employee.employeeCode,
              phoneNumber: employee.phoneNumber,
              label: `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`,
            })
          );
          setFetchedOptions(mappedEmployees);

          // Populate cache with newly fetched employees
          mappedEmployees.forEach((emp) => {
            allKnownEmployeesCache.current.set(emp.id, emp);
          });
        } else {
          console.warn("API response was not an array:", data);
          setFetchedOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch employees from local API:", error);
        setFetchedOptions([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchEmployees();
    }, 500); // Debounce to prevent excessive API calls

    return () => {
      active = false;
      clearTimeout(debounceFetch);
    };
  }, [searchTerm, open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange: rhfOnChange, ref },
        fieldState: { error },
      }) => {
        // value from RHF for multiple select will be string[] or undefined
        const currentSelectedValues: Employee[] = useMemo(() => {
          if (!Array.isArray(value)) return [];

          const selectedEmployees: Employee[] = [];
          const rhfIds = value as string[];

          rhfIds.forEach((id) => {
            // 1. Try to get the full Employee object from the cache first
            const cachedEmployee = allKnownEmployeesCache.current.get(id);
            if (cachedEmployee) {
              selectedEmployees.push(cachedEmployee);
            } else if (initialEmployeesForDisplay) {
              // 2. If the ID exists (e.g., from defaultValues or reset in RHF)
              //    but is not in the cache, try to create a minimal Employee object
              //    for display purposes using the initialEmployeesForDisplay prop.
              const initialDisplay = initialEmployeesForDisplay.find(
                (item) => item.id === id
              );
              if (initialDisplay) {
                selectedEmployees.push({
                  id: initialDisplay.id,
                  label: initialDisplay.name,
                  firstName: initialDisplay.name.split(" ")[0] || "",
                  lastName:
                    initialDisplay.name.split(" ").slice(1).join(" ") || "",
                  email: "", // Placeholder
                  employeeCode: "", // Placeholder
                  phoneNumber: "", // Placeholder
                });
              }
            }
          });
          return selectedEmployees;
        }, [value, initialEmployeesForDisplay]); // Depend on RHF value and initialEmployeesForDisplay prop

        const optionsToDisplay = useMemo(() => {
          // Combine fetched options with current selected (potentially placeholder) values
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
            multiple // This makes it a multiple select
            options={optionsToDisplay}
            getOptionLabel={(option) => option.label}
            // Crucial: Determine if two options are equal based on their 'id'
            isOptionEqualToValue={(option, newValue) =>
              option.id === newValue.id
            }
            onInputChange={(event: SyntheticEvent, newInputValue: string) => {
              setSearchTerm(newInputValue);
            }}
            onChange={(_, newValues: Employee[]) => {
              // Update RHF with an array of IDs
              rhfOnChange(newValues.map((employee) => employee.id));

              // Call parent callback if provided
              if (onEmployeesSelected) {
                onEmployeesSelected(newValues);
              }

              // Cache all selected employees (full objects)
              newValues.forEach((emp) => {
                allKnownEmployeesCache.current.set(emp.id, emp);
              });
            }}
            value={currentSelectedValues} // This is the array of objects displayed
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
                  label={option.label}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {`${option.firstName} ${option.lastName} (${
                  option.employeeCode || "N/A"
                }) - ${option.email || "N/A"}`}
              </Box>
            )}
          />
        );
      }}
    />
  );
}
