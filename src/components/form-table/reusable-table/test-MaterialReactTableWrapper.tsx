"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import type {
    MRT_RowData,
    MRT_RowVirtualizer,
    MRT_TableState,
} from "material-react-table";
import { Box, IconButton, Chip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { schemaToMRTColumnsFromZod } from "./zod-schema-to-mrt-columns";
import { TableCommonActions } from "./table-common-action-buttons";

interface MaterialTableWrapperProps<T extends MRT_RowData = MRT_RowData> {
    schema: any;
    endpoint?: string;
    defaultValues?: any;
    disabledValues?: any;
    CustomTopToolbarActions?: React.ComponentType<{
        tableState: MRT_TableState<T>;
    }>;
    // Grouping props
    enableGrouping?: boolean;
    defaultGroupedColumns?: string[];
    enableAggregation?: boolean;
    // Additional table options
    enableRowSelection?: boolean;
    enableRowVirtualization?: boolean;
    enableColumnVirtualization?: boolean;
    maxHeight?: string;
}

export function MaterialTableWrapper<T extends MRT_RowData = MRT_RowData>({
    schema,
    endpoint,
    CustomTopToolbarActions,
    defaultValues,
    disabledValues,
    // Grouping props with defaults
    enableGrouping = false,
    defaultGroupedColumns = [],
    enableAggregation = false,
    // Additional options with defaults
    enableRowSelection = true,
    enableRowVirtualization = true,
    enableColumnVirtualization = true,
    maxHeight = "75vh",
}: MaterialTableWrapperProps<T>) {
    const { apiEndPoint: ape } = useMemo(() => schema.meta(), [schema]);
    const columns = useMemo(() => schemaToMRTColumnsFromZod(schema), [schema]);

    const [columnFilters, setColumnFilters] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // Always include payrollBatch in grouping and prevent removal
    const forcedGroupingColumns = ['payrollBatch.name'];
    const [grouping, setGrouping] = useState<any[]>(forcedGroupingColumns);

    const { data, isLoading, isError, refetch, isRefetching } = useDataQuery<{
        data: T[];
        meta: { totalRowCount: number };
    }>({
        apiEndPoint: endpoint ?? ape,
        columnFilters,
        globalFilter,
        sorting,
        pagination,
    });

    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

    useEffect(() => {
        try {
            rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
        } catch (error) {
            console.error(error);
        }
    }, [sorting, grouping]);

    // Enhanced columns with forced payrollBatch grouping
    const enhancedColumns = useMemo(() => {
        return columns.map(column => {
            const isPayrollBatchColumn = column.accessorKey === 'payrollBatch.name';

            return {
                ...column,
                // Enable grouping for all columns by default when grouping is enabled
                enableGrouping: enableGrouping && !isPayrollBatchColumn || column.accessorKey?.startsWith('payrollBatch.'),
                // Make payrollBatch column non-groupable since it's always grouped
                ...(isPayrollBatchColumn && {
                    enableGrouping: false,
                }),
                // Set smaller size for payrollBatch column
                ...(isPayrollBatchColumn && {
                    size: 80,
                    minSize: 250,
                    maxSize: 120,
                }),
            };
        });
    }, [columns, enableGrouping]);

    // Process data to handle rows without payrollBatch
    const processedData = useMemo(() => {
        const rawData = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
                ? data.data
                : [];

        return rawData.map(row => {
            // Check if payrollBatch exists and has a name
            const hasValidBatch = row.payrollBatch && row.payrollBatch.name;

            if (hasValidBatch) {
                return row;
            } else {
                // Return row with proper payrollBatch object structure
                return {
                    ...row,
                    payrollBatch: {
                        name: 'Generated without Batch',
                        // Preserve other payrollBatch properties if they exist
                        ...(row.payrollBatch && typeof row.payrollBatch === 'object' ? row.payrollBatch : {})
                    }
                };
            }
        });
    }, [data]);

    const table = useMaterialReactTable<T>({
        columns: enhancedColumns,
        data: processedData,
        manualFiltering: true,
        manualPagination: true,
        // manualSorting: true,

        // Virtualization (conditional)
        enableRowVirtualization: enableRowVirtualization,
        enableColumnVirtualization: enableColumnVirtualization,
        rowVirtualizerInstanceRef,
        rowVirtualizerOptions: { overscan: 5 },
        columnVirtualizerOptions: { overscan: 2 },

        // Grouping features - always enable grouping and force payrollBatch
        enableGrouping: true, // Always enable grouping since payrollBatch is always grouped
        enableAggregation,
        onGroupingChange: (updater) => {
            // Always include payrollBatch in grouping, prevent removal
            const newGrouping = typeof updater === 'function' ? updater(grouping) : updater;

            // Filter out payrollBatch from the new grouping to prevent removal
            const filteredNewGrouping = newGrouping.filter(col => col !== 'payrollBatch.name');

            // Always include payrollBatch and then the filtered grouping
            const finalGrouping = ['payrollBatch.name', ...filteredNewGrouping];

            setGrouping(finalGrouping);
        },
        groupedColumnMode: 'remove',

        // Event handlers
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        // onSortingChange: setSorting,
        onPaginationChange: setPagination,

        rowCount: data?.meta?.totalRowCount ?? 0,
        state: {
            columnFilters,
            globalFilter,
            pagination,
            sorting,
            grouping,
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
        },

        // Table features
        enableColumnOrdering: true,
        enableColumnDragging: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableRowSelection: enableRowSelection,

        // Styling - Fixed: Added background color back
        muiTableContainerProps: {
            sx: {
                scrollbarWidth: "none",
                maxHeight: maxHeight,
                backgroundColor: 'background.paper', // Added background color
                // Improved styling for grouped tables
                '& .Mui-TableHeadCell-Content': {
                    fontWeight: 'bold',
                }
            },
        },
        muiTablePaperProps: {
            sx: {
                backgroundColor: 'background.paper', // Ensure paper background
            }
        },
        muiPaginationProps: {
            rowsPerPageOptions: [10, 25, 50, 100, 500, 1000, 2000, 3000, 4000, 5000],
            showFirstButton: true,
        },
        muiToolbarAlertBannerProps: isError
            ? { color: "error", children: "Error loading data" }
            : undefined,

        // Custom toolbar actions
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                <IconButton onClick={() => refetch()} title="Refresh">
                    <RefreshIcon />
                </IconButton>
                <TableCommonActions
                    defaultValues={defaultValues}
                    disabledValues={disabledValues}
                    data={data}
                    schema={schema}
                    table={table}
                />

                {CustomTopToolbarActions && (
                    <CustomTopToolbarActions tableState={table.getState()} />
                )}
            </Box>
        ),

        // Initial state - always group by payrollBatch
        initialState: {
            showColumnFilters: false,
            columnVisibility: { id: false },
            density: "compact",
            grouping: forcedGroupingColumns,
            expanded: true, // Expand all groups by default
        },

        defaultDisplayColumn: {
            enableResizing: true,
        },

        // Additional features
        enableFilterMatchHighlighting: true,
        enableFacetedValues: true,

        // Row props (conditional based on row selection)
        muiTableBodyRowProps: enableRowSelection ? ({ row }) => ({
            onClick: (event) => {
                table.toggleAllRowsSelected(false);
                row.toggleSelected(true);
            },
            sx: {
                cursor: "pointer",
                // Different background color for "Generated without Batch" rows
                backgroundColor: row.original.payrollBatch?.name === 'Generated without Batch'
                    ? 'rgba(255, 152, 0, 0.08)' // Light orange background
                    : 'inherit',
                '&:hover': {
                    backgroundColor: row.original.payrollBatch?.name === 'Generated without Batch'
                        ? 'rgba(255, 152, 0, 0.12)' // Slightly darker orange on hover
                        : 'rgba(0, 0, 0, 0.04)',
                },
            },
        }) : undefined,

        // Enhanced grouping display
        displayColumnDefOptions: {
            'mrt-row-expand': {
                size: 250,
            },
        },

        // Custom rendering for grouped rows with special styling for "Generated without Batch"
        muiTableBodyCellProps: ({ cell, row }) => ({
            sx: {
                // Add some padding for indentation in grouped rows
                ...(cell.column.columnDef.columnDefType === 'group' && {
                    paddingLeft: `${cell.row.depth * 16}px`,
                }),
                // Special styling for "Generated without Batch" group cells
                ...(row.original?.payrollBatch?.name === 'Generated without Batch' && {
                    backgroundColor: 'rgba(102, 148, 142, 0.08)',
                }),
            },
        }),

        // Custom rendering for group headers - Fixed: Remove the X button for payrollBatch
        renderGroupedCell: ({ cell, row, table }) => {
            const groupValue = cell.getValue() as string;

            // Special rendering for "Generated without Batch" group
            if (groupValue === 'Generated without Batch') {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            label={groupValue}
                            size="small"
                            sx={{
                                backgroundColor: '#ff9800',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                maxWidth: '200px',
                            }}
                        />
                        <span>({row.subRows?.length || 0} rows)</span>
                    </Box>
                );
            }

            // Default rendering for other groups
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{groupValue}</span>
                    <span>({row.subRows?.length || 0} rows)</span>
                </Box>
            );
        },

        // Customize the grouping badge to remove the X for payrollBatch
        muiGroupingColumnHeaderProps: ({ column }) => ({
            sx: {
                '& .MuiChip-root': {
                    // Remove the delete icon for payrollBatch column
                    ...(column.id === 'payrollBatch.name' && {
                        '& .MuiChip-deleteIcon': {
                            display: 'none !important',
                        },
                        '&:hover': {
                            '& .MuiChip-deleteIcon': {
                                display: 'none ',
                            },
                        },
                    }),
                },
            },
        }),

        // Aggregation functions (when enabled)
        ...(enableAggregation && {
            aggregationFns: {
                sum: (columnId, leafRows, childRows) => {
                    const values = leafRows.map(row => row.getValue(columnId));
                    return values.reduce((sum, value) => {
                        const num = Number(value);
                        return sum + (isNaN(num) ? 0 : num);
                    }, 0);
                },
                count: (columnId, leafRows, childRows) => {
                    return leafRows.length;
                },
                min: (columnId, leafRows, childRows) => {
                    const values = leafRows.map(row => Number(row.getValue(columnId))).filter(n => !isNaN(n));
                    return values.length ? Math.min(...values) : null;
                },
                max: (columnId, leafRows, childRows) => {
                    const values = leafRows.map(row => Number(row.getValue(columnId))).filter(n => !isNaN(n));
                    return values.length ? Math.max(...values) : null;
                },
                average: (columnId, leafRows, childRows) => {
                    const values = leafRows.map(row => Number(row.getValue(columnId))).filter(n => !isNaN(n));
                    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
                },
            },
        }),
    });

    return <MaterialReactTable table={table} />;
}