import { configureStore } from "@reduxjs/toolkit";
import positionReducer from "./position";
import questionsReducer from "./question-slice";
import authReducer from "@/lib/store/global-state/auth/auth-slice";
import payrollBatchReducer from "./payroll-filter-slice";

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    position: positionReducer,
    session: authReducer,
     payrollBatch: payrollBatchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
