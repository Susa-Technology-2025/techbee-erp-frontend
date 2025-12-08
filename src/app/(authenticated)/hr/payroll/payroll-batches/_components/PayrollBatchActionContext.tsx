"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { usePayrollBatchActions } from "../usePayrollBatches/usePayrollBatchActions";

const PayrollBatchActionContext = createContext<ReturnType<typeof usePayrollBatchActions> | null>(null);

export const usePayrollBatchActionContext = () => {
  const context = useContext(PayrollBatchActionContext);
  if (!context) {
    throw new Error("usePayrollBatchActionContext must be used within a PayrollBatchActionProvider");
  }
  return context;
};

interface PayrollBatchActionProviderProps {
  children: ReactNode;
}

export const PayrollBatchActionProvider: React.FC<PayrollBatchActionProviderProps> = ({ children }) => {
  const actions = usePayrollBatchActions();

  return (
    <PayrollBatchActionContext.Provider value={actions}>
      {children}
    </PayrollBatchActionContext.Provider>
  );
};