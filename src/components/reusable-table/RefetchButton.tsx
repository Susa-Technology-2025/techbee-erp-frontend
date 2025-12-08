import React from 'react';
import {
  IconButton,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store/store';
import { triggerRefetch } from '@/lib/store/tableSlice';

interface RefetchButtonProps {
  tableId: string;
}

export const RefetchButton: React.FC<RefetchButtonProps> = ({ tableId }) => {
  const dispatch: AppDispatch = useDispatch();

  const handleClick = () => {
    dispatch(triggerRefetch({ tableId }));
  };

  return (
    <IconButton onClick={handleClick}>
      <Refresh />
    </IconButton>
  );
};
