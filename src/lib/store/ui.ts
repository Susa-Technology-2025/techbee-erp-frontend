import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  employeeAdvancedSearchDrawerOpen: boolean;
}

const initialState: UIState = {
  employeeAdvancedSearchDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openEmployeeAdvancedSearchDrawer(state) {
      state.employeeAdvancedSearchDrawerOpen = true;
    },
    closeEmployeeAdvancedSearchDrawer(state) {
      state.employeeAdvancedSearchDrawerOpen = false;
    },
    toggleEmployeeAdvancedSearchDrawer(state) {
      state.employeeAdvancedSearchDrawerOpen =
        !state.employeeAdvancedSearchDrawerOpen;
    },
  },
});

export const {
  openEmployeeAdvancedSearchDrawer,
  closeEmployeeAdvancedSearchDrawer,
  toggleEmployeeAdvancedSearchDrawer,
} = uiSlice.actions;

export default uiSlice.reducer;
