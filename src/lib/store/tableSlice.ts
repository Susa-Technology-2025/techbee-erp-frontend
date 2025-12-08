import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Column {
  name: string;
  accessorKey: string;
  value?: any;
}

export interface TableState {
  globalFilter: string;
  filters: any[];
  start: number;
  size: number;
  sorting: any[];
  columns: Column[];
  selectedRows: any[];
  rowSelection: { [key: string]: boolean };
  totalRowCount: number;
  isLoading: boolean;
  isRefetching: boolean;
  viewMode: 'table' | 'card';
  shouldRefetch: boolean;
}

export interface TablesState {
  [tableId: string]: TableState;
}

const initialState: TablesState = {};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    initializeTable: (
      state,
      action: PayloadAction<{ tableId: string; columns: Column[] }>
    ) => {
      const { tableId, columns } = action.payload;
      if (!state[tableId]) {
        state[tableId] = {
          globalFilter: "",
          filters: [],
          start: 0,
          size: 10,
          sorting: [],
          columns,
          selectedRows: [],
          rowSelection: {},
          totalRowCount: 0,
          isLoading: true,
          isRefetching: false,
          viewMode: 'table',
          shouldRefetch: false,
        };
      }
    },
    setTableState: (
      state,
      action: PayloadAction<{ tableId: string; newState: Partial<TableState> }>
    ) => {
      const { tableId, newState } = action.payload;
      if (state[tableId]) {
        state[tableId] = { ...state[tableId], ...newState };
      }
    },
    triggerRefetch: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload;
      if (state[tableId]) {
        state[tableId].shouldRefetch = true;
      }
    },
    resetRefetch: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload;
      if (state[tableId]) {
        state[tableId].shouldRefetch = false;
      }
    },
  },
});

export const { initializeTable, setTableState, triggerRefetch, resetRefetch } = tableSlice.actions;

export const selectTableState = (state: RootState, tableId: string) =>
  state.tables[tableId];

export default tableSlice.reducer;
