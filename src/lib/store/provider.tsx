"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { TanstackProvider } from "../tanstack/provider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { initializeAuthDispatch } from "../tanstack/useDataQuery";

initializeAuthDispatch(store.dispatch);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanstackProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>{children}</Provider>
      </LocalizationProvider>
    </TanstackProvider>
  );
};
