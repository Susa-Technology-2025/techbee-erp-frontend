// src/components/form-components/RHFSingleEmployeeAutocomplete.tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useState, SyntheticEvent, useEffect, useMemo, useRef } from "react";

import { Autocomplete, Box, TextField, CircularProgress } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode: string;
  phoneNumber: string;
  label: string;
};

type RHFSingleEmployeeAutocompleteProps<T extends FieldValues> = {
  name: Path<T>;
  helperText?: string;
  sx?: SxProps<Theme>;
  onEmployeeSelected?: (employee: Employee | null) => void;
  // --- NEW PROP FOR EDIT FORMS ---
  initialEmployeeName?: string;
};

export function RHFSingleEmployeeAutocomplete<T extends FieldValues>({
  name,
  helperText,
  sx,
  onEmployeeSelected,
  initialEmployeeName, // Destructure the new prop
}: RHFSingleEmployeeAutocompleteProps<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allKnownEmployeesCache = useRef<Map<string, Employee>>(new Map());

  const label = "Employee";

  useEffect(() => {
    let active = true;

    if (!open) {
      setFetchedOptions([]);
      return undefined;
    }

    if (searchTerm.length < 2) {
      setFetchedOptions([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `http://192.168.81.154:3003/api/employees?where[firstName][contains]=${searchTerm}`,
          {
            headers: {
              "x-tenant-code": "default",
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
    }, 500);

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
        const currentSelectedValue: Employee | null = useMemo(() => {
          // 1. Try to get the full Employee object from the cache first
          const cachedEmployee = allKnownEmployeesCache.current.get(
            value as string
          );
          if (cachedEmployee) {
            return cachedEmployee;
          }

          // 2. If the value exists (e.g., from defaultValues or reset in RHF)
          //    but is not in the cache, and an initialName is provided,
          //    create a minimal Employee object for display purposes.
          if (value && typeof value === "string" && initialEmployeeName) {
            // This minimal object helps display the already selected name
            // without immediately performing an API lookup for full details.
            return {
              id: value as string,
              label: initialEmployeeName,
              firstName: initialEmployeeName.split(" ")[0] || "",
              lastName: initialEmployeeName.split(" ").slice(1).join(" ") || "",
              email: "", // Placeholder, as full details aren't known yet
              employeeCode: "", // Placeholder
              phoneNumber: "", // Placeholder
            };
          }
          return null; // No value, or no cached/initial info
        }, [value, initialEmployeeName]); // Depend on RHF value and initialEmployeeName prop

        const optionsToDisplay = useMemo(() => {
          const combinedOptions = [...fetchedOptions];
          if (currentSelectedValue) {
            // Add the currentSelectedValue to options if it's not already there
            // This ensures the selected item is always in the list for display,
            // even if it was just a placeholder.
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
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, newValue) =>
              option.id === newValue.id
            }
            onInputChange={(event: SyntheticEvent, newInputValue: string) => {
              setSearchTerm(newInputValue);
            }}
            onChange={(_, newValue) => {
              rhfOnChange((newValue as Employee)?.id || ""); // Update RHF with ID

              if (onEmployeeSelected) {
                onEmployeeSelected(newValue as Employee | null); // Pass full object to parent
              }

              if (newValue) {
                allKnownEmployeesCache.current.set(newValue.id, newValue); // Cache the full object
              }
            }}
            value={currentSelectedValue} // This is the object displayed
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
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {`${option.firstName} ${option.lastName} (${
                  option.employeeCode || "N/A"
                }) }`}
              </Box>
            )}
          />
        );
      }}
    />
  );
}
