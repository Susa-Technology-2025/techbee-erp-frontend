"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useState, SyntheticEvent, useEffect, useMemo, useRef } from "react";

import { Autocomplete, Box, TextField, CircularProgress } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { FieldValues, Path } from "react-hook-form";

// --- UPDATED: No DummyJsonUser type needed now ---

// Our conceptual 'Employee' type that the component will work with
// Matches the structure of your local API response
type Employee = {
  id: string; // Matches 'id'
  firstName: string; // Matches 'firstName'
  lastName: string; // Matches 'lastName'
  email: string; // Matches 'email'
  employeeCode: string; // Matches 'employeeCode'
  phoneNumber: string; // Matches 'phoneNumber'
  label: string; // Derived for display
};

// Props for the multiple select component
type RHFMultipleEmployeeAutocompleteProps<T extends FieldValues> = {
  name: Path<T>;
  helperText?: string;
  sx?: SxProps<Theme>;
};

export function RHFMultipleEmployeeAutocomplete<T extends FieldValues>({
  name,
  helperText,
  sx,
}: RHFMultipleEmployeeAutocompleteProps<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allKnownEmployeesCache = useRef<Map<string, Employee>>(new Map());

  const label = "Employees";

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
        // --- UPDATED: API URL and Headers ---
        const response = await fetch(
          `http://192.168.81.154:3003/api/employees?where[firstName][contains]=${searchTerm}`,
          {
            headers: {
              "x-tenant-code": "default", // Required header
            },
          }
        );
        const data = await response.json(); // Data is now directly the array

        // --- UPDATED: Response Parsing ---
        if (active && Array.isArray(data)) {
          // Check if 'data' itself is an array
          const mappedEmployees: Employee[] = data.map(
            (employee: Employee) => ({
              // Direct mapping since fields match
              id: employee.id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              employeeCode: employee.employeeCode,
              phoneNumber: employee.phoneNumber,
              label: `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`, // Create display label
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
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
        const currentSelectedValues: Employee[] = useMemo(() => {
          if (!Array.isArray(value) || value.length === 0) return [];
          return value
            .map((id: string) => allKnownEmployeesCache.current.get(id))
            .filter(Boolean) as Employee[];
        }, [value]);

        const optionsToDisplay = useMemo(() => {
          const combinedOptions = [...fetchedOptions];
          currentSelectedValues.forEach((selectedEmployee) => {
            if (
              selectedEmployee &&
              !combinedOptions.some((opt) => opt.id === selectedEmployee.id)
            ) {
              combinedOptions.push(selectedEmployee);
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
            options={optionsToDisplay}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, newValue) =>
              option.id === newValue.id
            }
            onInputChange={(event: SyntheticEvent, newInputValue: string) => {
              setSearchTerm(newInputValue);
            }}
            onChange={(_, newValue) => {
              onChange((newValue as Employee[]).map((item) => item.id));

              (newValue as Employee[]).forEach((item) => {
                allKnownEmployeesCache.current.set(item.id, item);
              });
            }}
            value={currentSelectedValues}
            multiple={true}
            disableCloseOnSelect
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
            renderOption={(props, option, { selected }) => (
              <Box
                component="li"
                {...props}
                sx={{
                  backgroundColor: selected ? "action.selected" : "inherit",
                  "&:hover": {
                    backgroundColor: selected ? "action.hover" : "action.hover",
                  },
                }}
              >
                {`${option.firstName} ${option.lastName} (${option.employeeCode}) - ${option.email}`}
              </Box>
            )}
          />
        );
      }}
    />
  );
}
