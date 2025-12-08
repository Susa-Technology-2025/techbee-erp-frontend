"use client";

// import { useMemo } from "react";
// import {
//   useGetWorkentriesQuery,
//   useCreateWorkentriesMutation,
//   useUpdateWorkentriesMutation,
//   useDeleteWorkentriesMutation,
// } from "../_queries/workEntries";
// import { useGetTimeOffTypesQuery } from "@/app/(authenticated)/hr/_queries/time-off-types";
// import { useGetEmployeesQuery } from "@/app/(authenticated)/hr/_queries/employees";

// import { ReusableTable } from "@/components/form-components";
// import { MRT_ColumnDef } from "material-react-table";
// import { UseFormReturn } from "react-hook-form";
// import {
//   Box,
//   TextField,
//   Grid,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// // import {
// //   WorkEntry,
// //   workEntryCreateInputSchema,
// //   workEntrySchema,
// //   WorkEntryTypeEnum,
// // } from "../_schemas/work-entries";
// import { RHFAutocomplete } from "@/components/rhf-async-single-auto-complete";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { workEntrySchema } from "../_schemas/work-entries";

export default () => {
  // const {
  //   data: fetchedWorkEntries = [],
  //   isLoading,
  //   isFetching,
  //   isError,
  // } = useGetWorkentriesQuery();
  // const [createWorkentry] = useCreateWorkentriesMutation();
  // const [updateWorkentry] = useUpdateWorkentriesMutation();
  // const [deleteWorkentry] = useDeleteWorkentriesMutation();

  // const { data: employees = [] } = useGetEmployeesQuery();
  // const { data: leaveTypes = [] } = useGetTimeOffTypesQuery();

  // const formatDateToSchemaString = (
  //   dateValue: string | Date | undefined
  // ): string => {
  //   if (!dateValue) return "";

  //   let dateObj: Date;
  //   if (typeof dateValue === "string") {
  //     dateObj = new Date(dateValue);
  //   } else {
  //     dateObj = dateValue;
  //   }

  //   if (isNaN(dateObj.getTime())) {
  //     return "";
  //   }

  //   const year = dateObj.getFullYear();
  //   const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  //   const day = String(dateObj.getDate()).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };

  // const normalizedWorkEntries = useMemo(() => {
  //   return fetchedWorkEntries.map((entry) => ({
  //     ...entry,
  //     date: formatDateToSchemaString(entry.date),
  //     description: entry.description || "",
  //     employee: entry.employee?.id ? { id: entry.employee.id } : { id: "" },
  //     timeOffType: entry.timeOffType?.id
  //       ? { id: entry.timeOffType.id }
  //       : undefined,
  //     retroForPeriod: entry.retroForPeriod
  //       ? formatDateToSchemaString(entry.retroForPeriod)
  //       : "",
  //   }));
  // }, [fetchedWorkEntries]);

  // const columns = useMemo<MRT_ColumnDef<WorkEntry>[]>(
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
  //       accessorKey: "date",
  //       header: "Date",
  //       size: 150,
  //       Cell: ({ cell }) =>
  //         cell.getValue<string>()
  //           ? new Date(cell.getValue<string>()).toLocaleDateString()
  //           : "N/A",
  //     },
  //     {
  //       accessorKey: "description",
  //       header: "Description",
  //       size: 200,
  //     },
  //     {
  //       accessorKey: "hours",
  //       header: "Hours",
  //       size: 100,
  //     },
  //     {
  //       accessorKey: "type",
  //       header: "Type",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "employee.id",
  //       header: "Employee",
  //       size: 200,
  //       Cell: ({ cell }) => {
  //         const employeeId = cell.getValue<string>();
  //         const employee = employees.find((emp) => emp.id === employeeId);
  //         return employee
  //           ? `${employee.firstName} ${employee.lastName}`
  //           : employeeId || "N/A";
  //       },
  //     },
  //     {
  //       accessorKey: "timeOffType.id",
  //       header: "Time Off Type",
  //       size: 150,
  //       Cell: ({ row }) => {
  //         if (row.original.type === "Leave") {
  //           const timeOffTypeId = row.original.timeOffType?.id;
  //           const type = leaveTypes.find((lt) => lt.id === timeOffTypeId);
  //           return type?.name || timeOffTypeId || "N/A";
  //         }
  //         return "N/A";
  //       },
  //     },
  //     {
  //       accessorKey: "retroForPeriod",
  //       header: "Retroactive For Period",
  //       size: 180,
  //       Cell: ({ row }) => {
  //         if (row.original.type === "Retroactive") {
  //           return row.original.retroForPeriod
  //             ? new Date(row.original.retroForPeriod).toLocaleDateString()
  //             : "N/A";
  //         }
  //         return "N/A";
  //       },
  //     },
  //   ],
  //   [employees, leaveTypes]
  // );

  // const renderWorkEntryFormFields = (methods: UseFormReturn<WorkEntry>) => {
  //   const formatStringDateForInput = (
  //     dateString: string | undefined
  //   ): string => {
  //     if (!dateString) return "";
  //     try {
  //       const dateObj = new Date(dateString);
  //       if (isNaN(dateObj.getTime())) return "";

  //       const year = dateObj.getFullYear();
  //       const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  //       const day = String(dateObj.getDate()).padStart(2, "0");
  //       return `${year}-${month}-${day}`;
  //     } catch (e) {
  //       console.error("Error parsing date string for input:", dateString, e);
  //       return "";
  //     }
  //   };

  //   const currentTypeField = methods.watch("type");

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
  //             {...methods.register("date")}
  //             label="Date"
  //             margin="normal"
  //             fullWidth
  //             type="date"
  //             error={!!methods.formState.errors.date}
  //             helperText={
  //               methods.formState.errors.date?.message ||
  //               "The date of the work entry (YYYY-MM-DD)."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             value={formatStringDateForInput(methods.watch("date"))}
  //             onChange={(e) =>
  //               methods.setValue("date", e.target.value, {
  //                 shouldValidate: true,
  //               })
  //             }
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
  //               "A brief description of the work entry."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. Regular work day"
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <TextField
  //             {...methods.register("hours", { valueAsNumber: true })}
  //             label="Hours"
  //             margin="normal"
  //             fullWidth
  //             type="number"
  //             error={!!methods.formState.errors.hours}
  //             helperText={
  //               methods.formState.errors.hours?.message ||
  //               "The number of hours for this entry."
  //             }
  //             color="secondary"
  //             slotProps={{ inputLabel: { shrink: true } }}
  //             placeholder="e.g. 8"
  //           />
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <FormControl
  //             fullWidth
  //             margin="normal"
  //             error={!!methods.formState.errors.type}
  //           >
  //             <InputLabel shrink>Type</InputLabel>
  //             <Select
  //               {...methods.register("type")}
  //               value={methods.watch("type") || ""}
  //               onChange={(e) => {
  //                 const newType = e.target.value as any;
  //                 methods.setValue("type", newType, {
  //                   shouldValidate: true,
  //                 });

  //                 if (newType !== "Leave") {
  //                   methods.setValue("timeOffType", undefined, {
  //                     shouldValidate: true,
  //                   });
  //                 }

  //                 if (newType !== "Retroactive") {
  //                   methods.setValue("retroForPeriod", "", {
  //                     shouldValidate: true,
  //                   });
  //                 }
  //               }}
  //               displayEmpty
  //               label="Type"
  //             >
  //               {WorkEntryTypeEnum.options.map((type) => (
  //                 <MenuItem key={type} value={type}>
  //                   {type}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //             {methods.formState.errors.type && (
  //               <p
  //                 style={{
  //                   color: "#d32f2f",
  //                   fontSize: "0.75rem",
  //                   margin: "3px 14px 0",
  //                 }}
  //               >
  //                 {methods.formState.errors.type.message}
  //               </p>
  //             )}
  //           </FormControl>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <RHFAutocomplete<WorkEntry, any>
  //             name="employee.id"
  //             fetcher={useGetEmployeesQuery}
  //             getOptionLabel={(option) =>
  //               `${option.firstName} ${option.lastName}` || option.id
  //             }
  //             getOptionValue={(option) => option.id}
  //             helperText={
  //               methods.formState.errors.employee?.id?.message ||
  //               "The employee associated with this entry."
  //             }
  //             sx={{ marginY: "normal" }}
  //             label="Employee"
  //             initialDisplayValue={
  //               methods.watch("employee")?.id && employees.length
  //                 ? employees.find(
  //                     (emp) => emp.id === methods.watch("employee")?.id
  //                   )?.firstName +
  //                   " " +
  //                   employees.find(
  //                     (emp) => emp.id === methods.watch("employee")?.id
  //                   )?.lastName
  //                 : undefined
  //             }
  //           />
  //         </Grid>
  //         {currentTypeField === "Leave" && (
  //           <Grid size={{ xs: 12, md: 6 }}>
  //             <RHFAutocomplete<WorkEntry, any>
  //               name="timeOffType.id"
  //               fetcher={useGetTimeOffTypesQuery}
  //               getOptionLabel={(option) => option.name || option.id}
  //               getOptionValue={(option) => option.id}
  //               helperText={
  //                 methods.formState.errors.timeOffType?.id?.message ||
  //                 "The type of leave taken."
  //               }
  //               sx={{ marginY: "normal" }}
  //               label="Time Off Type"
  //               initialDisplayValue={
  //                 methods.watch("timeOffType")?.id && leaveTypes.length
  //                   ? leaveTypes.find(
  //                       (lt) => lt.id === methods.watch("timeOffType")?.id
  //                     )?.name
  //                   : undefined
  //               }
  //             />
  //           </Grid>
  //         )}
  //         {currentTypeField === "Retroactive" && (
  //           <Grid size={{ xs: 12, md: 6 }}>
  //             <TextField
  //               {...methods.register("retroForPeriod")}
  //               label="Retroactive For Period"
  //               margin="normal"
  //               fullWidth
  //               type="date"
  //               error={!!methods.formState.errors.retroForPeriod}
  //               helperText={
  //                 methods.formState.errors.retroForPeriod?.message ||
  //                 "The date of the period being corrected (YYYY-MM-DD)."
  //               }
  //               color="secondary"
  //               slotProps={{ inputLabel: { shrink: true } }}
  //               value={formatStringDateForInput(
  //                 methods.watch("retroForPeriod")
  //               )}
  //               onChange={(e) =>
  //                 methods.setValue("retroForPeriod", e.target.value, {
  //                   shouldValidate: true,
  //                 })
  //               }
  //             />
  //           </Grid>
  //         )}
  //       </Grid>
  //     </Box>
  //   );
  // };

  // const handleCreateWorkentry = async (values: WorkEntry) => {
  //   try {
  //     const {
  //       id,
  //       createdAt,
  //       updatedAt,
  //       createdBy,
  //       updatedBy,
  //       type,
  //       ...restOfValues
  //     } = values;

  //     const payload: Partial<
  //       Omit<
  //         WorkEntry,
  //         "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "type"
  //       > & { type: WorkEntry["type"] }
  //     > = {
  //       ...restOfValues,
  //       type: type,
  //       employee: values.employee?.id ? { id: values.employee.id } : undefined,
  //       timeOffType:
  //         values.type === "Leave" && values.timeOffType?.id
  //           ? { id: values.timeOffType.id }
  //           : undefined,
  //       retroForPeriod:
  //         values.type === "Retroactive" && values.retroForPeriod
  //           ? values.retroForPeriod
  //           : undefined,
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

  //     const response = await createWorkentry(payload).unwrap();
  //     return {
  //       success: true,
  //       message: "Work entry created successfully!",
  //     };
  //   } catch (error) {
  //     console.error("Failed to create work entry:", error);
  //     return {
  //       success: false,
  //       message:
  //         (error as any)?.data?.message ||
  //         (error as any)?.message ||
  //         "Failed to create work entry.",
  //     };
  //   }
  // };

  // const handleUpdateWorkentry = async (values: WorkEntry) => {
  //   try {
  //     if (!values.id) {
  //       throw new Error("Cannot update: Work entry ID is missing.");
  //     }

  //     const {
  //       createdAt,
  //       updatedAt,
  //       createdBy,
  //       updatedBy,
  //       type,
  //       ...restOfValues
  //     } = values;

  //     const payload: Partial<
  //       Omit<
  //         WorkEntry,
  //         "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "type"
  //       > & { type: WorkEntry["type"] }
  //     > = {
  //       ...restOfValues,
  //       type: type,
  //       employee: values.employee?.id ? { id: values.employee.id } : undefined,
  //       timeOffType:
  //         values.type === "Leave" && values.timeOffType?.id
  //           ? { id: values.timeOffType.id }
  //           : undefined,
  //       retroForPeriod:
  //         values.type === "Retroactive" && values.retroForPeriod
  //           ? values.retroForPeriod
  //           : undefined,
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

  //     const response = await updateWorkentry({
  //       id: values.id,
  //       data: payload,
  //     }).unwrap();
  //     return {
  //       success: true,
  //       message: "Work entry updated successfully!",
  //     };
  //   } catch (error) {
  //     console.error("Failed to update work entry:", error);
  //     return {
  //       success: false,
  //       message:
  //         (error as any)?.data?.message ||
  //         (error as any)?.message ||
  //         "Failed to update work entry.",
  //     };
  //   }
  // };

  // const handleDeleteWorkentry = async (id: string) => {
  //   try {
  //     const response = await deleteWorkentry(id).unwrap();
  //     return {
  //       success: true,
  //       message: "Work entry deleted successfully!",
  //     };
  //   } catch (error) {
  //     console.error("Failed to delete work entry:", error);
  //     return {
  //       success: false,
  //       message:
  //         (error as any)?.data?.message ||
  //         (error as any)?.message ||
  //         "Failed to delete work entry.",
  //     };
  //   }
  // };

  return <MaterialTableWrapper schema={workEntrySchema} />;
};
