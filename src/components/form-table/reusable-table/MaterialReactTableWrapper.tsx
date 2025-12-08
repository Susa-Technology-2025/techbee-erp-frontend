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

  // Grouping props (optional)
  enableGrouping?: boolean;
  defaultGroupedColumns?: string[];
  enableAggregation?: boolean;
  forcedGroupingColumns?: string[];
  aggregationConfig?: {
    [columnKey: string]: {
      fn: "sum" | "average" | "min" | "max" | "count";
      label?: string;
      format?: (value: any) => string;
    };
  };

  // Data processing configuration for missing values
  dataProcessingConfig?: {
    missingValueHandling?: {
      [columnKey: string]: {
        defaultValue: any;
        label?: string;
        style?: {
          backgroundColor?: string;
          hoverBackgroundColor?: string;
        };
      };
    };
  };

  // Additional table options with defaults
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
  forcedGroupingColumns = [],
  aggregationConfig = {},

  // Data processing configuration
  dataProcessingConfig = {},

  // Additional options with defaults
  enableRowSelection = true,
  enableRowVirtualization = true,
  enableColumnVirtualization = true,
  maxHeight = "75vh",
}: MaterialTableWrapperProps<T>) {
  const { apiEndPoint: ape } = useMemo(() => schema.meta(), [schema]);
  const baseColumns = useMemo(
    () => schemaToMRTColumnsFromZod(schema),
    [schema]
  );

  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Initialize grouping state based on forcedGroupingColumns and defaultGroupedColumns
  const [grouping, setGrouping] = useState<any[]>([
    ...forcedGroupingColumns,
    ...defaultGroupedColumns,
  ]);

  const { data, isLoading, isError, refetch, isRefetching } = useDataQuery<{
    data: T[];
    meta: { totalRowCount: number };
  }>({
    apiEndPoint: endpoint ?? ape,
    columnFilters,
    globalFilter,
    pagination,
  });

  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

useEffect(() => {
  const shouldScroll =
    sorting.length > 0 || (enableGrouping && grouping.length > 0);

  if (shouldScroll) {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (_) {}
  }
}, [sorting, grouping, enableGrouping]);

  // Enhanced columns with grouping and aggregation configuration
  const enhancedColumns = useMemo(() => {
    let processedColumns = baseColumns;

    // Apply aggregation configuration if enabled
    if (enableAggregation && Object.keys(aggregationConfig).length > 0) {
      processedColumns = processedColumns.map((column) => {
        const columnConfig = aggregationConfig[column.accessorKey as string];

        if (columnConfig) {
          return {
            ...column,
            aggregationFn: columnConfig.fn,
            AggregatedCell: ({ cell }) => {
              const value = cell.getValue();
              const formattedValue = columnConfig.format
                ? columnConfig.format(value)
                : typeof value === "number"
                ? value.toLocaleString()
                : value;

              return (
                <Box
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    fontSize: "0.875rem",
                  }}
                >
                  {formattedValue}
                </Box>
              );
            },
            Header: columnConfig.label ? columnConfig.label : column.Header,
          };
        }
        return column;
      });
    }

    // Apply grouping configuration if enabled
    if (enableGrouping) {
      processedColumns = processedColumns.map((column) => {
        const isForcedGroupingColumn = forcedGroupingColumns.includes(
          column.accessorKey as string
        );

        return {
          ...column,
          enableGrouping: !isForcedGroupingColumn,
          ...(isForcedGroupingColumn && {
            size: 80,
            minSize: 250,
            maxSize: 120,
          }),
        };
      });
    }

    return processedColumns;
  }, [
    baseColumns,
    enableGrouping,
    enableAggregation,
    forcedGroupingColumns,
    aggregationConfig,
  ]);

  // Generic data processing for missing values in any column
  const processedData = useMemo(() => {
    const rawData = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    // Only process if grouping is enabled and we have missing value handling config
    if (!enableGrouping || !dataProcessingConfig?.missingValueHandling) {
      return rawData;
    }

    return rawData.map((row) => {
      const processedRow = { ...row };

      // Process each column that has missing value handling configured
      Object.entries(dataProcessingConfig.missingValueHandling).forEach(
        ([columnKey, config]) => {
          const keys = columnKey.split(".");
          let current: any = processedRow;

          // Navigate to the nested property
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }

          const lastKey = keys[keys.length - 1];
          const currentValue = current[lastKey];

          // Check if value is missing, null, undefined, or empty
          if (
            !currentValue ||
            currentValue === "" ||
            currentValue === null ||
            currentValue === undefined
          ) {
            current[lastKey] = config.defaultValue;
          }
        }
      );

      return processedRow;
    });
  }, [data, enableGrouping, dataProcessingConfig]);

  // Handle grouping change with forced columns
  const handleGroupingChange = (updater: any) => {
    if (!enableGrouping) return;

    const newGrouping =
      typeof updater === "function" ? updater(grouping) : updater;
    const filteredNewGrouping = newGrouping.filter(
      (col: string) => !forcedGroupingColumns.includes(col)
    );
    const finalGrouping = [...forcedGroupingColumns, ...filteredNewGrouping];

    setGrouping(finalGrouping);
  };

  // Generic function to get row style based on missing value configuration
  const getRowStyle = (row: any) => {
    if (!enableGrouping || !dataProcessingConfig?.missingValueHandling) {
      return {};
    }

    const styles: any = {};

    Object.entries(dataProcessingConfig.missingValueHandling).forEach(
      ([columnKey, config]) => {
        if (config.style) {
          const keys = columnKey.split(".");
          let value = row.original;

          // Navigate to the nested property value
          for (const key of keys) {
            value = value?.[key];
            if (value === undefined) break;
          }

          // Apply style if this row uses the default value for this column
          if (value === config.defaultValue) {
            if (config.style.backgroundColor) {
              styles.backgroundColor = config.style.backgroundColor;
            }
            if (config.style.hoverBackgroundColor) {
              styles["&:hover"] = {
                backgroundColor: config.style.hoverBackgroundColor,
              };
            }
          }
        }
      }
    );

    return styles;
  };

  // Generic grouped cell renderer that works for any column with missing value handling
  const renderGroupedCell = ({ cell, row, table }: any) => {
    const groupValue = cell.getValue() as string;

    // Check if this group value matches any configured default values
    if (dataProcessingConfig?.missingValueHandling) {
      for (const [columnKey, config] of Object.entries(
        dataProcessingConfig.missingValueHandling
      )) {
        if (groupValue === config.defaultValue && config.label) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={config.label || groupValue}
                size="small"
                sx={{
                  backgroundColor: config.style?.backgroundColor || "#ff9800",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  maxWidth: "200px",
                }}
              />
              <span>({row.subRows?.length || 0} rows)</span>
            </Box>
          );
        }
      }
    }

    // Default rendering for other groups
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <span>{groupValue}</span>
        <span>({row.subRows?.length || 0} rows)</span>
      </Box>
    );
  };

  const table = useMaterialReactTable<T>({
    columns: enhancedColumns,
    data: enableGrouping
      ? processedData
      : Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [],

    // Core table functionality
    manualFiltering: true,
    manualPagination: true,

    // Virtualization (conditional)
    enableRowVirtualization: enableRowVirtualization,
    enableColumnVirtualization: enableColumnVirtualization,
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 5 },
    columnVirtualizerOptions: { overscan: 2 },

    // Grouping features (conditional)
    ...(enableGrouping && {
      enableGrouping: true,
      enableAggregation,
      onGroupingChange: handleGroupingChange,
      groupedColumnMode: "remove",
    }),

    // Event handlers
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    rowCount: data?.meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      ...(enableGrouping && { grouping }),
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

    // Styling
    muiTableContainerProps: {
      sx: {
         overflowX: "auto",
        scrollbarWidth: "thin",
        maxHeight: maxHeight,
        backgroundColor: "background.paper",
        ...(enableGrouping && {
          "& .Mui-TableHeadCell-Content": {
            fontWeight: "bold",
          },
        }),
      },
    },
    muiTablePaperProps: {
      sx: {
        backgroundColor: "background.paper",
      },
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
          flexWrap: "wrap",
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

    // Initial state
    initialState: {
      showColumnFilters: false,
      columnVisibility: { id: false },
      density: "compact",
      ...(enableGrouping && {
        grouping: [...forcedGroupingColumns, ...defaultGroupedColumns],
        expanded: true,
      }),
    },

    defaultDisplayColumn: {
      enableResizing: true,
    },

    // Additional features
    enableFilterMatchHighlighting: true,
    enableFacetedValues: true,
    enableColumnResizing: true,

    // Row props (conditional based on row selection)
    muiTableBodyRowProps: enableRowSelection
      ? ({ row }) => ({
          onClick: (event) => {
            table.toggleAllRowsSelected(false);
            row.toggleSelected(true);
          },
          sx: {
            cursor: "pointer",
            ...getRowStyle(row), // Use generic row styling
            ...(!enableGrouping && {
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }),
          },
        })
      : undefined,

    // Enhanced grouping display (only when grouping is enabled)
    ...(enableGrouping && {
      displayColumnDefOptions: {
        "mrt-row-expand": {
          size: 250,
        },
      },

      muiTableBodyCellProps: ({ cell, row }) => ({
        sx: {
          ...(cell.column.columnDef.columnDefType === "group" && {
            paddingLeft: `${cell.row.depth * 16}px`,
          }),
          // Generic styling for cells with default values
          ...(Object.entries(
            dataProcessingConfig?.missingValueHandling || {}
          ).some(([columnKey, config]) => {
            const keys = columnKey.split(".");
            let value = row.original;
            for (const key of keys) {
              value = value?.[key];
              if (value === undefined) break;
            }
            return value === config.defaultValue;
          }) && {
            backgroundColor: "rgba(102, 148, 142, 0.08)",
          }),
        },
      }),

      renderGroupedCell, // Use generic grouped cell renderer

      muiGroupingColumnHeaderProps: ({ column }) => ({
        sx: {
          "& .MuiChip-root": {
            ...(forcedGroupingColumns.includes(column.id) && {
              "& .MuiChip-deleteIcon": {
                display: "none !important",
              },
              "&:hover": {
                "& .MuiChip-deleteIcon": {
                  display: "none ",
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
            const values = leafRows.map((row) => row.getValue(columnId));
            return values.reduce((sum, value) => {
              const num = Number(value);
              return sum + (isNaN(num) ? 0 : num);
            }, 0);
          },
          count: (columnId, leafRows, childRows) => {
            return leafRows.length;
          },
          min: (columnId, leafRows, childRows) => {
            const values = leafRows
              .map((row) => Number(row.getValue(columnId)))
              .filter((n) => !isNaN(n));
            return values.length ? Math.min(...values) : null;
          },
          max: (columnId, leafRows, childRows) => {
            const values = leafRows
              .map((row) => Number(row.getValue(columnId)))
              .filter((n) => !isNaN(n));
            return values.length ? Math.max(...values) : null;
          },
          average: (columnId, leafRows, childRows) => {
            const values = leafRows
              .map((row) => Number(row.getValue(columnId)))
              .filter((n) => !isNaN(n));
            return values.length
              ? values.reduce((sum, value) => sum + value, 0) / values.length
              : null;
          },
        },
      }),
    }),
  });

  return <MaterialReactTable table={table} />;
}
