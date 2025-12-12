import type { MRT_RowVirtualizer } from "material-react-table";
import { Box, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CustomTopToolbarActions } from "./TableCustomTopToolbar";
import { columns } from "./TableColumns";

export const getTableOptions = (
  data: any,
  tableState: any,
  refetch: () => void,
  rowVirtualizerInstanceRef: React.RefObject<MRT_RowVirtualizer>,
  defaultValues: any,
  invalidateQueryKey: string[]
) => ({
  columns,
  data: Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [],
  manualFiltering: true,
  manualPagination: true,
  enableRowVirtualization: true,
  enableColumnVirtualization: true,
  rowVirtualizerInstanceRef,
  rowVirtualizerOptions: { overscan: 5 },
  columnVirtualizerOptions: { overscan: 2 },
  onColumnFiltersChange: tableState.setColumnFilters,
  onGlobalFilterChange: tableState.setGlobalFilter,
  onSortingChange: tableState.setSorting,
  onPaginationChange: tableState.setPagination,
  rowCount: data?.meta?.totalRowCount ?? 0,
  state: {
    columnFilters: tableState.columnFilters,
    globalFilter: tableState.globalFilter,
    pagination: tableState.pagination,
    sorting: tableState.sorting,
    isLoading: tableState.isLoading,
    showAlertBanner: tableState.isError,
    showProgressBars: tableState.isRefetching,
  },
  enableColumnOrdering: true,
  enableColumnDragging: true,
  enableStickyHeader: true,
  enableStickyFooter: true,
  enableRowSelection: true,
  muiTableContainerProps: {
    sx: {
      maxHeight: "70vh",
      overflowX: "auto",
      scrollbarWidth: "thin",
      backgroundColor: "background.paper",
      backgroundImage:
        "linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))",
    },
  },
  muiTablePaperProps: {
    sx: {
      backgroundColor: "background.paper",
      backgroundImage: "none",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    },
  },
  muiPaginationProps: {
    rowsPerPageOptions: [10, 25, 50, 100, 500, 1000],
    showFirstButton: true,
  },
  muiToolbarAlertBannerProps: tableState.isError
    ? {
        color: "error",
        children: tableState.error?.message ?? "Error loading data",
      }
    : undefined,
  renderTopToolbarCustomActions: ({ table }: any) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton onClick={() => refetch()}>
        <RefreshIcon />
      </IconButton>
      <CustomTopToolbarActions
        defaultValues={defaultValues}
        table={table}
        apiEndPoint={tableState.apiEndPoint}
        invalidateQueryKey={invalidateQueryKey}
      />
    </Box>
  ),
  initialState: {
    showColumnFilters: false,
    columnVisibility: { id: false },
    density: "compact",
  },
  enableFilterMatchHighlighting: true,
  enableFacetedValues: true,
  enableColumnResizing: true,
});