// lib/schemas/removers.ts
import { clearAllBatches } from "@/lib/store/payroll-filter-slice";
import { store } from "@/lib/store/store"; // Adjust path to your store

export const payrollBatchRemover = () => {
  store.dispatch(clearAllBatches());
};

// You can add more remover functions for other slices here
export const allRemovers = {
  payrollBatch: payrollBatchRemover,
};