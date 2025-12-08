import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  position: {},
};

const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition(state, action: PayloadAction) {
      state.position = action.payload;
    },
  },
});

export const { setPosition } = positionSlice.actions;

export default positionSlice.reducer;
