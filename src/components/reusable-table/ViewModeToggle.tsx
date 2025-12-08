import React from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { TableChart, ViewModule } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { setTableState, selectTableState } from '@/lib/store/tableSlice';

interface ViewModeToggleProps {
  tableId: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ tableId }) => {
  const dispatch: AppDispatch = useDispatch();
  const tableState = useSelector((state: RootState) => selectTableState(state, tableId));
  const viewMode = tableState?.viewMode || 'table';

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'table' | 'card' | null,
  ) => {
    if (newViewMode !== null) {
      dispatch(setTableState({ tableId, newState: { viewMode: newViewMode, rowSelection: {}, selectedRows: [] } }));
    }
  };

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleChange}
      aria-label="view mode"
      size="small"
    >
      <ToggleButton value="table" aria-label="table view">
        <TableChart />
      </ToggleButton>
      <ToggleButton value="card" aria-label="card view">
        <ViewModule />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
