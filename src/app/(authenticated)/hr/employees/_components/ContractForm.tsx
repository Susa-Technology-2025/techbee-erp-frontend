import React from "react";
import { Box, TextField, Stack } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { Contract } from "@/app/(authenticated)/hr/_schemas/contracts";
import { RHFAutocomplete } from "@/components/rhf-async-single-auto-complete";
import { useGetEmployeesQuery } from "@/app/(authenticated)/hr/_queries/employees";
import { useGetSalarystructuresQuery } from "@/app/(authenticated)/hr/payroll/_queries/salaryStructures";

export const ContractForm = ({
  methods,
}: {
  methods: UseFormReturn<Contract>;
}) => {
  const { data: employees = [] } = useGetEmployeesQuery();
  const { data: salaryStructures = [] } = useGetSalarystructuresQuery();

  const formatStringDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return "";
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "";
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours() + 1).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      console.error("Error parsing date string for input:", dateString, e);
      return "";
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: "1rem", py: "1rem" }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box flex={1}>
          <RHFAutocomplete<Contract, any>
            name="employee.id"
            fetcher={useGetEmployeesQuery}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName} (${option.employeeCode})` ||
              option.id
            }
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.employee?.id?.message ||
              "The employee associated with this contract."
            }
            sx={{ marginY: "normal" }}
            label="Employee"
            initialDisplayValue={
              methods.watch("employee")?.id && employees.length
                ? (() => {
                    const emp = employees.find(
                      (e) => e.id === methods.watch("employee")?.id
                    );
                    return emp
                      ? `${emp.firstName} ${emp.lastName} (${emp.employeeCode})`
                      : undefined;
                  })()
                : undefined
            }
          />
        </Box>
        <Box flex={1}>
          <RHFAutocomplete<Contract, any>
            name="salaryStructure.id"
            fetcher={useGetSalarystructuresQuery}
            getOptionLabel={(option) => option.name || option.id}
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.salaryStructure?.id?.message ||
              "The salary structure for this contract."
            }
            sx={{ marginY: "normal" }}
            label="Salary Structure"
            initialDisplayValue={
              methods.watch("salaryStructure")?.id && salaryStructures.length
                ? salaryStructures.find(
                    (ss) => ss.id === methods.watch("salaryStructure")?.id
                  )?.name
                : undefined
            }
          />
        </Box>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box flex={1}>
          <TextField
            {...methods.register("startDate")}
            label="Start Date"
            margin="normal"
            fullWidth
            type="datetime-local"
            error={!!methods.formState.errors.startDate}
            helperText={
              methods.formState.errors.startDate?.message ||
              "The start date of the contract (YYYY-MM-DDTHH:mm)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={formatStringDateForInput(methods.watch("startDate"))}
            onChange={(e) =>
              methods.setValue("startDate", e.target.value, {
                shouldValidate: true,
              })
            }
          />
        </Box>
        <Box flex={1}>
          <TextField
            {...methods.register("endDate")}
            label="End Date"
            margin="normal"
            fullWidth
            type="datetime-local"
            error={!!methods.formState.errors.endDate}
            helperText={
              methods.formState.errors.endDate?.message ||
              "The end date of the contract (YYYY-MM-DDTHH:mm)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={formatStringDateForInput(methods.watch("endDate"))}
            onChange={(e) =>
              methods.setValue("endDate", e.target.value, {
                shouldValidate: true,
              })
            }
          />
        </Box>
      </Stack>
      <TextField
        {...methods.register("baseSalary", { valueAsNumber: true })}
        type="number"
        label="baseSalary"
        margin="normal"
        fullWidth
        error={!!methods.formState.errors.baseSalary}
        helperText={
          methods.formState.errors.baseSalary?.message ||
          "Base salary of The employee"
        }
        color="secondary"
        InputLabelProps={{ shrink: true }}
        placeholder="e.g. 40000"
      />
      <TextField
        {...methods.register("terms")}
        label="Terms"
        margin="normal"
        fullWidth
        multiline
        rows={4}
        error={!!methods.formState.errors.terms}
        helperText={
          methods.formState.errors.terms?.message ||
          "Detailed terms and conditions of the contract."
        }
        color="secondary"
        InputLabelProps={{ shrink: true }}
        placeholder="e.g. This contract outlines..."
      />
    </Box>
  );
};
