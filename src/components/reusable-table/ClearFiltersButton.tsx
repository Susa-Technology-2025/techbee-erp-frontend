import React from 'react';
import {
  IconButton,
} from '@mui/material';
import { ClearAll } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store/store';
import { setTableState } from '@/lib/store/tableSlice';

interface ClearFiltersButtonProps {
  tableId: string;
  onClick?: () => void;
}

export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({ tableId, onClick }) => {
  const dispatch: AppDispatch = useDispatch();

  const handleClearFilters = () => {
    dispatch(setTableState({ tableId, newState: { filters: [], start: 0, size: 10, globalFilter: '' } }));
    if (onClick) {
      onClick();
    }
  };

  return (
    <IconButton onClick={handleClearFilters}>
      <ClearAll />
    </IconButton>
  );
};
