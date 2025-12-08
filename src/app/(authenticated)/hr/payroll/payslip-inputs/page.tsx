"use client";

import { useMemo } from "react";
import {
  useGetPayslipinputsQuery,
  useCreatePayslipinputsMutation,
  useUpdatePayslipinputsMutation,
  useDeletePayslipinputsMutation,
} from "../_queries/payslipInputs";

import { useGetEmployeesQuery } from "@/app/(authenticated)/hr/_queries/employees";
import { ReusableTable } from "@/components/form-components";
import { MRT_ColumnDef } from "material-react-table";
import { UseFormReturn } from "react-hook-form";
import { Box, TextField, Grid } from "@mui/material";
import { payslipInputSchema } from "../_schemas/payslip-inputs";
import { RHFAutocomplete } from "@/components/rhf-async-single-auto-complete";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";

export default () => {
  // const {
  //   data: fetchedPayslipInputs = [],
  //   isLoading,
  //   isFetching,
  //   isError,
  // } = useGetPayslipinputsQuery();
  // const [createPayslipinput] = useCreatePayslipinputsMutation();
  // const [updatePayslipinput] = useUpdatePayslipinputsMutation();
  // const [deletePayslipinput] = useDeletePayslipinputsMutation();

  // const { data: employees = [] } = useGetEmployeesQuery();

  // const normalizedPayslipInputs = useMemo(() => {
  //   return fetchedPayslipInputs.map((input) => ({
  //     ...input,
  //     description: input.description || "",
  //     employee: input.employee?.id ? { id: input.employee.id } : undefined,
  //     externalCode: input.externalCode || "",
  //   }));
  // }, [fetchedPayslipInputs]);

  // const columns = useMemo<MRT_ColumnDef<PayslipInput>[]>(
  //   () => [
  //     {
  //       accessorKey: "id",
  //       header: "ID",
  //       enableColumnOrdering: false,
  //       enableEditing: false,
  //       enableSorting: false,
  //       size: 80,
  //       muiTableHeadCellProps: { sx: { display: "none" } },
  //       muiTableBodyCellProps: { sx: { display: "none" } },
  //       muiTableFooterCellProps: { sx: { display: "none" } },
  //     },
  //     {
  //       accessorKey: "code",
  //       header: "Code",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "name",
  //       header: "Name",
  //       size: 200,
  //     },
  //     {
  //       accessorKey: "description",
  //       header: "Description",
  //       size: 250,
  //     },
  //     {
  //       accessorKey: "amount",
  //       header: "Amount",
  //       size: 100,
  //       Cell: ({ cell }) => cell.getValue<number>().toFixed(2),
  //     },
  //     {
  //       accessorKey: "employee.id",
  //       header: "Employee",
  //       size: 200,
  //       Cell: ({ cell }) => {
  //         const employeeId = cell.getValue<string>();
  //         const employee = employees.find((emp) => emp.id === employeeId);
  //         return employee
  //           ? `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`
  //           : employeeId || "N/A";
  //       },
  //     },
  //     {
  //       accessorKey: "externalCode",
  //       header: "External Code",
  //       size: 150,
  //     },
  //   ],
  //   [employees]
  // );

  // const renderPayslipInputFormFields = (
  //   methods: UseFormReturn<PayslipInput>
  // ) => {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         gap: "1rem",
  //         py: "1rem",
  //       }}
  //     >
  //       <Grid container spacing={2}>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <TextField
  //             {...methods.register("code")}
  //             label="Code"
  //             margin="normal"
  //             fullWidth
  //             error={!!methods.formState.errors.code}
  //             helperText={
  //               methods.formState.errors.code?.message ||
  //               "A unique code for the payslip input (e.g., 'OT_INPUT')."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. OT_INPUT"
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <TextField
  //             {...methods.register("name")}
  //             label="Name"
  //             margin="normal"
  //             fullWidth
  //             error={!!methods.formState.errors.name}
  //             helperText={
  //               methods.formState.errors.name?.message ||
  //               "A descriptive name for the payslip input (e.g., 'Overtime Hours')."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. Overtime Hours"
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <TextField
  //             {...methods.register("description")}
  //             label="Description (Optional)"
  //             margin="normal"
  //             fullWidth
  //             error={!!methods.formState.errors.description}
  //             helperText={
  //               methods.formState.errors.description?.message ||
  //               "Optional description for the payslip input."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. Overtime input for July payroll"
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <TextField
  //             {...methods.register("amount", { valueAsNumber: true })}
  //             label="Amount"
  //             margin="normal"
  //             fullWidth
  //             type="number"
  //             error={!!methods.formState.errors.amount}
  //             helperText={
  //               methods.formState.errors.amount?.message ||
  //               "The numerical value for the payslip input (e.g., hours, amount)."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. 10"
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <RHFAutocomplete<PayslipInput, any>
  //             name="employee.id"
  //             fetcher={useGetEmployeesQuery}
  //             getOptionLabel={(option) =>
  //               option.firstName && option.lastName
  //                 ? `${option.firstName} ${option.lastName} (${option.employeeCode})`
  //                 : option.id
  //             }
  //             getOptionValue={(option) => option.id}
  //             helperText={
  //               methods.formState.errors.employee?.id?.message ||
  //               "Select an employee if this input is specific to one."
  //             }
  //             sx={{ marginY: "normal" }}
  //             label="Employee (Optional)"
  //             initialDisplayValue={
  //               methods.watch("employee")?.id && employees.length
  //                 ? employees.find(
  //                     (emp) => emp.id === methods.watch("employee")?.id
  //                   )
  //                   ? `${
  //                       employees.find(
  //                         (emp) => emp.id === methods.watch("employee")?.id
  //                       )?.firstName
  //                     } ${
  //                       employees.find(
  //                         (emp) => emp.id === methods.watch("employee")?.id
  //                       )?.lastName
  //                     } (${
  //                       employees.find(
  //                         (emp) => emp.id === methods.watch("employee")?.id
  //                       )?.employeeCode
  //                     })`
  //                   : undefined
  //                 : undefined
  //             }
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <TextField
  //             {...methods.register("externalCode")}
  //             label="External Code (Optional)"
  //             margin="normal"
  //             fullWidth
  //             error={!!methods.formState.errors.externalCode}
  //             helperText={
  //               methods.formState.errors.externalCode?.message ||
  //               "Optional code for tracking inputs synced from external systems."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. EXT_SYSTEM_001"
  //           />
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   );
  // };

  // const handleCreatePayslipInput = async (values: PayslipInput) => {
  //   try {
  //     const {
  //       id,
  //       createdAt,
  //       updatedAt,
  //       createdBy,
  //       updatedBy,
  //       ...restOfValues
  //     } = values;

  //     const payload: Partial<
  //       Omit<
  //         PayslipInput,
  //         "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  //       >
  //     > = {
  //       ...restOfValues,
  //       employee: values.employee?.id ? { id: values.employee.id } : undefined,
  //     };

  //     for (const key in payload) {
  //       if (
  //         payload[key as keyof typeof payload] === "" ||
  //         payload[key as keyof typeof payload] === null ||
  //         payload[key as keyof typeof payload] === undefined
  //       ) {
  //         delete payload[key as keyof typeof payload];
  //       }
  //     }
  //     const response = await createPayslipinput(payload).unwrap();
  //     return {
  //       success: true,
  //       message: "Payslip input created successfully!",
  //     };
  //   } catch (error) {
  //     console.error("Failed to create payslip input:", error);
  //     return {
  //       success: false,
  //       message:
  //         (error as any)?.data?.message ||
  //         (error as any)?.message ||
  //         "Failed to create payslip input.",
  //     };
  //   }
  // };

  // const handleUpdatePayslipInput = async (values: PayslipInput) => {
  //   try {
  //     if (!values.id) {
  //       throw new Error("Cannot update: Payslip Input ID is missing.");
  //     }

  //     const { createdAt, updatedAt, createdBy, updatedBy, ...restOfValues } =
  //       values;

  //     const payload: Partial<
  //       Omit<
  //         PayslipInput,
  //         "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  //       >
  //     > = {
  //       ...restOfValues,
  //       employee: values.employee?.id ? { id: values.employee.id } : undefined,
  //     };

  //     for (const key in payload) {
  //       if (
  //         payload[key as keyof typeof payload] === "" ||
  //         payload[key as keyof typeof payload] === null ||
  //         payload[key as keyof typeof payload] === undefined
  //       ) {
  //         delete payload[key as keyof typeof payload];
  //       }
  //     }
  //     const response = await updatePayslipinput({
  //       id: values.id,
  //       data: payload,
  //     }).unwrap();
  //     return {
  //       success: true,
  //       message: "Payslip input updated successfully!",
  //     };
  //   } catch (error) {
  //     console.error("Failed to update payslip input:", error);
  //     return {
  //       success: false,
  //       message:
  //         (error as any)?.data?.message ||
  //         (error as any)?.message ||
  //         "Failed to update payslip input.",
  //     };
  //   }
  // };

  // const handleDeletePayslipInput = async (id: string) => {
  //   try {
  //     const response = await deletePayslipinput(id).unwrap();
  //     return {
  //       success: true,
  //       message: "Payslip input deleted successfully!",
  //     };
  //   } catch (error) {
  //     console.error("Failed to delete payslip input:", error);
  //     return {
  //       success: false,
  //       message:
  //         (error as any)?.data?.message ||
  //         (error as any)?.message ||
  //         "Failed to delete payslip input.",
  //     };
  //   }
  // };

  return (
    <MaterialTableWrapper schema={payslipInputSchema} />
    // <ReusableTable<typeof payslipInputSchema>
    //   data={normalizedPayslipInputs}
    //   columns={columns}
    //   schema={payslipInputSchema}
    //   renderFormFields={renderPayslipInputFormFields}
    //   onCreate={handleCreatePayslipInput}
    //   onUpdate={handleUpdatePayslipInput}
    //   onDelete={handleDeletePayslipInput}
    //   getId={(row) => row.id || row.code}
    //   tableTitle="Payslip Input"
    //   createButtonText="new"
    //   isLoading={isLoading}
    //   isFetching={isFetching}
    //   isError={isError}
    // />
  );
};
