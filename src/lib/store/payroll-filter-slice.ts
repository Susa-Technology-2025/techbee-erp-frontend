import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Pool {
  salaryRuleId: string;
  amount: number;
  strategy: { type: string };
  inheritBatchFilters: boolean;
  eligibility: { salaryStructureIds: string[] };
}

export interface RoundingConfig {
  mode: "round" | "floor" | "ceil";
  step: number;
}

export interface PayrollBatchConfig {
  selectedPositions: string[];
  selectedEmploymentTerms: string[];
  selectedOrganizationNodes: string[];
  selectedSalaryStructures: string[];
  rounding: RoundingConfig;
  pools: Pool[];
  filtersApplied: boolean;
  employeeCount: number;
}

export interface PayrollBatchState {
  // Store multiple configurations by batch ID
  [batchId: string]: PayrollBatchConfig;
}

const initialState: PayrollBatchState = {
  // Default configuration for new batches
  'default': {
    selectedPositions: [],
    selectedEmploymentTerms: [],
    selectedOrganizationNodes: [],
    selectedSalaryStructures: [],
    rounding: {
      mode: "round",
      step: 0.01
    },
    pools: [],
    filtersApplied: false,
    employeeCount: 0
  }
};

const payrollBatchSlice = createSlice({
  name: "payrollBatch",
  initialState,
  reducers: {
    // Initialize a new batch configuration
    initializeBatch: (
      state,
      action: PayloadAction<{ batchId: string; initialConfig?: Partial<PayrollBatchConfig> }>
    ) => {
      const { batchId, initialConfig } = action.payload;
      if (!state[batchId]) {
        state[batchId] = {
          ...state['default'],
          ...initialConfig
        };
      }
    },

    // Update entire configuration for a batch
    setBatchConfig: (
      state,
      action: PayloadAction<{ batchId: string; config: PayrollBatchConfig }>
    ) => {
      const { batchId, config } = action.payload;
      state[batchId] = config;
    },

    // Update specific parts of configuration
    updateBatchConfig: (
      state,
      action: PayloadAction<{ batchId: string; updates: Partial<PayrollBatchConfig> }>
    ) => {
      const { batchId, updates } = action.payload;
      if (state[batchId]) {
        state[batchId] = { ...state[batchId], ...updates };
      }
    },

    // Filter actions
    setSelectedPositions: (
      state,
      action: PayloadAction<{ batchId: string; positions: string[] }>
    ) => {
      const { batchId, positions } = action.payload;
      if (state[batchId]) {
        state[batchId].selectedPositions = positions;
        state[batchId].filtersApplied = positions.length > 0 || 
          state[batchId].selectedEmploymentTerms.length > 0 ||
          state[batchId].selectedOrganizationNodes.length > 0 ||
          state[batchId].selectedSalaryStructures.length > 0;
      }
    },

    setSelectedEmploymentTerms: (
      state,
      action: PayloadAction<{ batchId: string; terms: string[] }>
    ) => {
      const { batchId, terms } = action.payload;
      if (state[batchId]) {
        state[batchId].selectedEmploymentTerms = terms;
        state[batchId].filtersApplied = terms.length > 0 || 
          state[batchId].selectedPositions.length > 0 ||
          state[batchId].selectedOrganizationNodes.length > 0 ||
          state[batchId].selectedSalaryStructures.length > 0;
      }
    },

    setSelectedOrganizationNodes: (
      state,
      action: PayloadAction<{ batchId: string; nodes: string[] }>
    ) => {
      const { batchId, nodes } = action.payload;
      if (state[batchId]) {
        state[batchId].selectedOrganizationNodes = nodes;
        state[batchId].filtersApplied = nodes.length > 0 || 
          state[batchId].selectedPositions.length > 0 ||
          state[batchId].selectedEmploymentTerms.length > 0 ||
          state[batchId].selectedSalaryStructures.length > 0;
      }
    },

    setSelectedSalaryStructures: (
      state,
      action: PayloadAction<{ batchId: string; structures: string[] }>
    ) => {
      const { batchId, structures } = action.payload;
      if (state[batchId]) {
        state[batchId].selectedSalaryStructures = structures;
        state[batchId].filtersApplied = structures.length > 0 || 
          state[batchId].selectedPositions.length > 0 ||
          state[batchId].selectedEmploymentTerms.length > 0 ||
          state[batchId].selectedOrganizationNodes.length > 0;
      }
    },

    // Rounding configuration
    setRoundingConfig: (
      state,
      action: PayloadAction<{ batchId: string; rounding: RoundingConfig }>
    ) => {
      const { batchId, rounding } = action.payload;
      if (state[batchId]) {
        state[batchId].rounding = rounding;
      }
    },

    // Pool actions
    setPools: (
      state,
      action: PayloadAction<{ batchId: string; pools: Pool[] }>
    ) => {
      const { batchId, pools } = action.payload;
      if (state[batchId]) {
        state[batchId].pools = pools;
      }
    },

    addPool: (
      state,
      action: PayloadAction<{ batchId: string; pool: Pool }>
    ) => {
      const { batchId, pool } = action.payload;
      if (state[batchId]) {
        state[batchId].pools.push(pool);
      }
    },

    updatePool: (
      state,
      action: PayloadAction<{ batchId: string; poolIndex: number; updates: Partial<Pool> }>
    ) => {
      const { batchId, poolIndex, updates } = action.payload;
      if (state[batchId] && state[batchId].pools[poolIndex]) {
        state[batchId].pools[poolIndex] = { 
          ...state[batchId].pools[poolIndex], 
          ...updates 
        };
      }
    },

    removePool: (
      state,
      action: PayloadAction<{ batchId: string; poolIndex: number }>
    ) => {
      const { batchId, poolIndex } = action.payload;
      if (state[batchId]) {
        state[batchId].pools.splice(poolIndex, 1);
      }
    },

    // Employee count
    setEmployeeCount: (
      state,
      action: PayloadAction<{ batchId: string; count: number }>
    ) => {
      const { batchId, count } = action.payload;
      if (state[batchId]) {
        state[batchId].employeeCount = count;
      }
    },

    // Clear all filters
    clearAllFilters: (
      state,
      action: PayloadAction<{ batchId: string }>
    ) => {
      const { batchId } = action.payload;
      if (state[batchId]) {
        state[batchId].selectedPositions = [];
        state[batchId].selectedEmploymentTerms = [];
        state[batchId].selectedOrganizationNodes = [];
        state[batchId].selectedSalaryStructures = [];
        state[batchId].filtersApplied = false;
      }
    },

    // Remove a specific filter
    removeFilter: (
      state,
      action: PayloadAction<{ batchId: string; filterType: 'positions' | 'employmentTerms' | 'organizationNodes' | 'salaryStructures'; value: string }>
    ) => {
      const { batchId, filterType, value } = action.payload;
      if (state[batchId]) {
        const keyMap = {
          positions: 'selectedPositions',
          employmentTerms: 'selectedEmploymentTerms', 
          organizationNodes: 'selectedOrganizationNodes',
          salaryStructures: 'selectedSalaryStructures'
        } as const;

        const key = keyMap[filterType];
        state[batchId][key] = state[batchId][key].filter(item => item !== value);
        
        // Update filtersApplied status
        state[batchId].filtersApplied = 
          state[batchId].selectedPositions.length > 0 ||
          state[batchId].selectedEmploymentTerms.length > 0 ||
          state[batchId].selectedOrganizationNodes.length > 0 ||
          state[batchId].selectedSalaryStructures.length > 0;
      }
    },

    // Reset batch to default
    resetBatch: (
      state,
      action: PayloadAction<{ batchId: string }>
    ) => {
      const { batchId } = action.payload;
      state[batchId] = { ...state['default'] };
    },

    // Remove batch configuration
    removeBatch: (
      state,
      action: PayloadAction<{ batchId: string }>
    ) => {
      const { batchId } = action.payload;
      delete state[batchId];
    },

    clearAllBatches: (state) => {
  Object.keys(state).forEach(key => {
    if (key !== 'default') { // Keep default if you want, or remove everything
      delete state[key];
    }
  });
}

  },
});


// Export actions
export const {
  initializeBatch,
  setBatchConfig,
  updateBatchConfig,
  setSelectedPositions,
  setSelectedEmploymentTerms,
  setSelectedOrganizationNodes,
  setSelectedSalaryStructures,
  setRoundingConfig,
  setPools,
  addPool,
  updatePool,
  removePool,
  setEmployeeCount,
  clearAllFilters,
  removeFilter,
  resetBatch,
  removeBatch,
  clearAllBatches
} = payrollBatchSlice.actions;

// Selectors
export const selectBatchConfig = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId] || state.payrollBatch['default'];

export const selectSelectedPositions = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.selectedPositions || [];

export const selectSelectedEmploymentTerms = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.selectedEmploymentTerms || [];

export const selectSelectedOrganizationNodes = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.selectedOrganizationNodes || [];

export const selectSelectedSalaryStructures = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.selectedSalaryStructures || [];

export const selectRoundingConfig = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.rounding || { mode: "round", step: 0.01 };

export const selectPools = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.pools || [];

export const selectFiltersApplied = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.filtersApplied || false;

export const selectEmployeeCount = (state: RootState, batchId: string) => 
  state.payrollBatch[batchId]?.employeeCount || 0;

export default payrollBatchSlice.reducer;