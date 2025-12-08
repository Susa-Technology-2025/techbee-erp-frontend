"use client";
import React, { useEffect } from "react";
import { Column, selectTableState } from "../../../../lib/store/tableSlice";
import { extractTableMetaFromSchema } from "../../../../lib/table/get-column-defs";
import { employeeSchema } from "../../_schemas/employees";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Checkbox,
  LinearProgress,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Work,
  CalendarToday,
  CheckCircle,
  Cancel,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Chat,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../lib/store/store";
import { setTableState } from "../../../../lib/store/tableSlice";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const columns: Column[] = extractTableMetaFromSchema(employeeSchema);

interface EmployeeFullTableProps {
  employees?: any[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onAddEmployee: () => void;
  onEditEmployee?: (employee: any) => void;
  onDeleteEmployee?: (employee: any) => void;
  onViewEmployee?: (employee: any) => void;
  onChatEmployee?: (employee: any) => void;
}

export function EmployeeFullTable({ 
  employees: propEmployees,
  isLoading: propIsLoading,
  isFetching: propIsFetching,
  isError: propIsError,
  onAddEmployee, 
  onEditEmployee, 
  onDeleteEmployee, 
  onViewEmployee, 
  onChatEmployee 
}: EmployeeFullTableProps) {
  const dispatch: AppDispatch = useDispatch();
  const tableState = useSelector((state: RootState) =>
    selectTableState(state, "employees")
  );

  // Initialize table state if it doesn't exist
  useEffect(() => {
    if (!tableState) {
      console.log("EmployeeFullTable - Initializing table state");
      dispatch(
        setTableState({
          tableId: "employees",
          newState: {
            start: 0,
            size: 10,
            globalFilter: "",
            filters: [],
            sorting: [],
            viewMode: "table",
            totalRowCount: 0,
            isLoading: false,
            isRefetching: false,
          },
        })
      );
    }
  }, [dispatch]);

  const {
    start = 0,
    size = 10,
    globalFilter = "",
    sorting = [],
    totalRowCount = 0,
    isLoading: stateIsLoading = false,
    isRefetching: stateIsRefetching = false,
  } = tableState || {};

  // Use props if provided, otherwise use state
  const employees = propEmployees || [];
  const isLoading = propIsLoading ?? stateIsLoading;
  const isFetching = propIsFetching ?? stateIsRefetching;
  const isError = propIsError ?? false;

  console.log("EmployeeFullTable - Employees data:", employees);

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  // Helper function to get status chip
  const getStatusChip = (isActive: boolean | null | undefined) => {
    if (isActive === true) {
      return (
        <Chip
          label="Active"
          size="small"
          color="success"
          icon={<CheckCircle fontSize="small" />}
          sx={{
            fontSize: "0.7rem",
            height: 20,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      );
    } else if (isActive === false) {
      return (
        <Chip
          label="Inactive"
          size="small"
          color="error"
          icon={<Cancel fontSize="small" />}
          sx={{
            fontSize: "0.7rem",
            height: 20,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      );
    }
    return (
      <Chip
        label="Unknown"
        size="small"
        color="default"
        sx={{
          fontSize: "0.7rem",
          height: 20,
          "& .MuiChip-label": { px: 1 },
        }}
      />
    );
  };

  // Filter out problematic nested columns that don't exist in the data
  const validColumns = columns.filter((col) => {
    const invalidNestedColumns = [
      "position.name",
      "shift.name",
      "manager.name",
    ];
    return !invalidNestedColumns.includes(col.accessorKey);
  });

  // Create table instance
  const table = useReactTable({
    data: employees,
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            size="small"
            sx={{
              padding: 0,
              color: "rgba(0, 0, 0, 0.2)",
              "&.Mui-checked": {
                color: "#6366f1",
              },
            }}
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size="small"
            sx={{
              padding: 0,
              color: "rgba(0, 0, 0, 0.2)",
              "&.Mui-checked": {
                color: "#6366f1",
              },
            }}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => {
          const employee = row.original;
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => onViewEmployee?.(employee)}
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Edit Employee">
                <IconButton
                  size="small"
                  onClick={() => onEditEmployee?.(employee)}
                  sx={{
                    color: "info.main",
                    "&:hover": {
                      backgroundColor: "info.light",
                      color: "info.contrastText",
                    },
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Chat with Employee">
                <IconButton
                  size="small"
                  onClick={() => onChatEmployee?.(employee)}
                  sx={{
                    color: "success.main",
                    "&:hover": {
                      backgroundColor: "success.light",
                      color: "success.contrastText",
                    },
                  }}
                >
                  <Chat fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {/* <Tooltip title="Delete Employee">
                <IconButton
                  size="small"
                  onClick={() => onDeleteEmployee?.(employee)}
                  sx={{
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "error.light",
                      color: "error.contrastText",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip> */}
            </Box>
          );
        },
      },
      ...validColumns.map((col) => ({
        header: col.name,
        accessorKey: col.accessorKey,
        cell: ({ row }: { row: any }) => {
          const value = row.getValue(col.accessorKey);

          // Special handling for different field types
          if (col.accessorKey === "isActive") {
            return getStatusChip(value as boolean);
          }

          if (
            col.accessorKey === "hireDate" ||
            col.accessorKey === "dateOfBirth" ||
            col.accessorKey === "terminationDate"
          ) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(value as string)}
                </Typography>
              </Box>
            );
          }

          if (col.accessorKey === "email") {
            return value ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {value as string}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled">
                N/A
              </Typography>
            );
          }

          if (col.accessorKey === "phoneNumber") {
            return value ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {value as string}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled">
                N/A
              </Typography>
            );
          }

          if (col.accessorKey === "jobTitle") {
            return value ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Work fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {value as string}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled">
                N/A
              </Typography>
            );
          }

          if (
            col.accessorKey === "firstName" ||
            col.accessorKey === "lastName"
          ) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "0.75rem",
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <Person fontSize="small" />
                </Avatar>
                <Typography variant="body2" fontWeight={500}>
                  {(value as string) || "N/A"}
                </Typography>
              </Box>
            );
          }

          // Default cell rendering
          return (
            <Typography variant="body2" color="text.secondary">
              {value ? String(value) : "N/A"}
            </Typography>
          );
        },
      })),
      // Actions column

    ],
    state: {
      pagination: {
        pageIndex: start / size,
        pageSize: size,
      },
      sorting,
      globalFilter,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex: start / size,
          pageSize: size,
        });
        dispatch(
          setTableState({
            tableId: "employees",
            newState: {
              start: newPagination.pageIndex * newPagination.pageSize,
              size: newPagination.pageSize,
            },
          })
        );
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        const newSorting = updater(sorting);
        dispatch(
          setTableState({
            tableId: "employees",
            newState: { sorting: newSorting },
          })
        );
      }
    },
    onGlobalFilterChange: (updater) => {
      const newGlobalFilter =
        typeof updater === "function" ? updater(globalFilter) : updater;
      dispatch(
        setTableState({
          tableId: "employees",
          newState: { globalFilter: newGlobalFilter },
        })
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalRowCount,
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={60}
            sx={{
              mb: 1,
              borderRadius: 1,
              bgcolor: "rgba(0, 0, 0, 0.04)",
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        background: "transparent",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        marginBottom: 8,
      }}
    >
      {/* Loading Progress Bar */}
      {isFetching && (
        <LinearProgress
          sx={{
            height: "3px",
            background: "transparent",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#6366f1",
              backgroundImage: "linear-gradient(to right, #6366f1, #a855f7)",
            },
          }}
        />
      )}

      {/* Table Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Employee Directory
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {totalRowCount} employees found
        </Typography>
      </Box>

      {/* Table Container */}
      <TableContainer
        sx={{
          flexGrow: 1,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                sx={{
                  backgroundColor: "background.paper",
                  "& th": {
                    backgroundColor: "background.paper",
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "text.secondary",
                    py: 1.5,
                    px: 2,
                  },
                }}
              >
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        color: "primary.main",
                      },
                      "&:active": {
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor:
                    index % 2 === 0 ? "background.paper" : "action.hover",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                  "& td": {
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 1.5,
                    px: 2,
                    fontSize: "0.875rem",
                  },
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      width: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {employees.length === 0 && !isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 2,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "action.hover",
              color: "text.secondary",
              mb: 2,
            }}
          >
            <Person fontSize="large" />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No employees found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or add a new employee.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
