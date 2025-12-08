import React, { useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  TablePagination,
  Box,
  styled,
} from "@mui/material";
import { Checkbox } from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  setTableState,
  initializeTable,
  selectTableState,
  Column,
  resetRefetch,
} from "@/lib/store/tableSlice";
import { buildQuery } from "@/lib/store/query-builder";
import { TopToolbar } from "./TopToolbar";
import { ScrollableCardsContainer } from "./ScrollableCardsContainer";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  border: "none",
  borderRadius: theme.shape.borderRadius,
  "&::-webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  backgroundColor: theme.palette.background.default,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  background: theme.palette.background.default,
  boxShadow: theme.shadows[1],
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightBold,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  borderBottom: `2px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  fontSize: "0.75rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: "background-color 0.2s ease",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-root": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .MuiTableCell-root": {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  "& .MuiTablePagination-toolbar": {
    padding: theme.spacing(0, 1),
    minHeight: "40px",
  },
  "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
    fontSize: "0.75rem",
  },
  "& .MuiSelect-select": {
    fontSize: "0.75rem",
  },
  "& .MuiTablePagination-actions button": {
    padding: theme.spacing(0.5),
  },
  width: "100%",
}));

interface ReusableTableProps {
  tableId: string;
  queryHook: (queryParams: string) => any;
  columns: Column[];
  CardComponent?: React.ComponentType<any>;
  cardWidth?: number;
  cardHeight?: number;
  additionalToolbarActions?: React.ReactNode;
}

const virtuosoComponents = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <StyledTableContainer {...props} ref={ref} />
  )),
  Table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <Table
      {...props}
      size="small"
      sx={{
        borderCollapse: "separate",
        minWidth: "100%",
      }}
    />
  ),
  TableHead: StyledTableHead,
  TableRow: StyledTableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export const ReusableTable: React.FC<ReusableTableProps> = ({
  tableId,
  queryHook,
  columns,
  CardComponent,
  additionalToolbarActions,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(initializeTable({ tableId, columns }));
  }, [dispatch, tableId, columns]);

  const tableState = useSelector((state: RootState) =>
    selectTableState(state, tableId)
  );

  const {
    start,
    size,
    sorting,
    globalFilter,
    filters,
    isLoading,
    isRefetching,
    totalRowCount,
    rowSelection,
    viewMode,
  } = tableState || {
    start: 0,
    size: 10,
    sorting: [],
    globalFilter: "",
    filters: [],
    isLoading: true,
    isRefetching: false,
    totalRowCount: 0,
    rowSelection: {},
    viewMode: "table",
  };

  const queryParams = useMemo(
    () => buildQuery(tableId, { start, size, filters, globalFilter, sorting }),
    [start, size, filters, globalFilter, sorting, tableId]
  );

  const { data, isFetching, refetch } = queryHook(queryParams);

  useEffect(() => {
    if (tableState?.shouldRefetch) {
      refetch();
      dispatch(resetRefetch({ tableId }));
    }
  }, [tableState?.shouldRefetch, refetch, dispatch, tableId]);

  useEffect(() => {
    dispatch(
      setTableState({
        tableId,
        newState: { isLoading: isFetching, isRefetching: isFetching },
      })
    );
    if (data?.meta) {
      dispatch(
        setTableState({
          tableId,
          newState: { totalRowCount: data.meta.totalRowCount },
        })
      );
    }
  }, [isFetching, data, tableId, dispatch]);

  const table = useReactTable({
    data: data?.data || [],
    columns: useMemo(
      () => [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              size="small"
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              size="small"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        },
        ...columns.map((col) => ({
          header: col.name,
          accessorKey: col.accessorKey,
        })),
      ],
      [columns]
    ),
    state: {
      pagination: {
        pageIndex: start / size,
        pageSize: size,
      },
      sorting,
      globalFilter,
      columnFilters: filters,
      rowSelection,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex: start / size,
          pageSize: size,
        });
        dispatch(
          setTableState({
            tableId,
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
        dispatch(setTableState({ tableId, newState: { sorting: newSorting } }));
      }
    },
    onGlobalFilterChange: (updater) => {
      const newGlobalFilter =
        typeof updater === "function" ? updater(globalFilter) : updater;
      dispatch(
        setTableState({ tableId, newState: { globalFilter: newGlobalFilter } })
      );
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        const newFilters = updater(filters);
        dispatch(setTableState({ tableId, newState: { filters: newFilters } }));
      }
    },
    onRowSelectionChange: (updater) => {
      const newRowSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      const selectedRows = Object.keys(newRowSelection).map(
        (key) => table.getRow(key).original
      );
      dispatch(
        setTableState({
          tableId,
          newState: { rowSelection: newRowSelection, selectedRows },
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

  return (
    <StyledPaper>
      <TopToolbar
        table={table}
        tableId={tableId}
        additionalToolbarActions={additionalToolbarActions}
      />
      {isRefetching && (
        <LinearProgress color="primary" sx={{ height: "2px" }} />
      )}
      <TableContainer
        ref={tableContainerRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {viewMode === "table" ? (
          <TableVirtuoso
            totalCount={table.getRowModel().rows.length}
            components={virtuosoComponents}
            fixedHeaderContent={() =>
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <StyledHeaderCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        userSelect: "none",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </StyledHeaderCell>
                  ))}
                </TableRow>
              ))
            }
            itemContent={(index) => {
              const row = table.getRowModel().rows[index];
              return (
                <>
                  {row.getVisibleCells().map((cell) => (
                    <StyledBodyCell
                      key={cell.id}
                      sx={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </StyledBodyCell>
                  ))}
                </>
              );
            }}
          />
        ) : (
          CardComponent && (
            <ScrollableCardsContainer
              data={data?.data || []}
              CardComponent={CardComponent}
              table={table}
              totalRowCount={totalRowCount}
              start={start}
              size={size}
              onPageChange={(_, page) => {
                dispatch(
                  setTableState({ tableId, newState: { start: page * size } })
                );
              }}
              onRowsPerPageChange={(event) => {
                dispatch(
                  setTableState({
                    tableId,
                    newState: { size: parseInt(event.target.value, 10) },
                  })
                );
              }}
            />
          )
        )}
      </TableContainer>
      {viewMode === "table" && (
        <Paper
          sx={{
            width: "100%",
            justifySelf: "end",
            position: "relative",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <StyledTablePagination
            count={totalRowCount}
            rowsPerPageOptions={[5, 10, 30, 50, 100, 200, 500, 1000, 2000]}
            page={start / size}
            rowsPerPage={size}
            onPageChange={(_, page) => {
              dispatch(
                setTableState({ tableId, newState: { start: page * size } })
              );
            }}
            onRowsPerPageChange={(event) => {
              dispatch(
                setTableState({
                  tableId,
                  newState: { size: parseInt(event.target.value, 10) },
                })
              );
            }}
          />
        </Paper>
      )}
    </StyledPaper>
  );
};
