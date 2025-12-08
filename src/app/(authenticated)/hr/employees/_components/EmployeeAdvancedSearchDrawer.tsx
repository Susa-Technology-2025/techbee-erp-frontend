import React from 'react';
import { Drawer, Box, Divider, IconButton, Button, Typography } from '@mui/material';
import { Refresh, Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { closeEmployeeAdvancedSearchDrawer } from '@/lib/store/ui';
import { EmployeeAdvancedSearch, EmployeeAdvancedSearchValues } from './EmployeeAdvancedSearch';

interface EmployeeAdvancedSearchDrawerProps {
  advancedSearch: EmployeeAdvancedSearchValues | null;
  setAdvancedSearch: (vals: EmployeeAdvancedSearchValues | null) => void;
  setPage: (page: number) => void;
}

const EmployeeAdvancedSearchDrawer: React.FC<EmployeeAdvancedSearchDrawerProps> = ({
  advancedSearch,
  setAdvancedSearch,
  setPage,
}) => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.employeeAdvancedSearchDrawerOpen);

  console.log('Drawer open state:', open);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => dispatch(closeEmployeeAdvancedSearchDrawer())}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 400 },
          maxWidth: '100vw',
          bgcolor: theme => theme.palette.backgroundSection?.main || '#f7fafd',
          boxShadow: 8,
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          p: 0,
          overflow: 'hidden',
          borderLeft: theme => `2px solid ${theme.palette.section?.light || '#e1efff'}`,
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', scrollbarWidth: 'none', bgcolor: 'backgroundSection.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3,  py: 2, bgcolor: 'background.paper',position: 'sticky', top: 0, zIndex: 100, borderBottom: theme => `1.5px solid ${theme.palette.section?.light || '#e1efff'}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'backgroundSection.main' }}>
            <Typography variant="h6" fontWeight={700} color="section.main" sx={{ letterSpacing: 0.5 }}>
              Advanced Search
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400, letterSpacing: 0.2 }}>
              Filter employees by any criteria
            </Typography>              
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh fontSize="small" />}
              onClick={() => { setAdvancedSearch(null); setPage(1); }}
              sx={{
                minWidth: 0,
                px: 1.5,
                py: 0.5,
                fontSize: 13,
                borderRadius: 2,
                boxShadow: 'none',
                background: 'rgba(255,255,255,0.85)',
                '&:hover': {
                  background: 'rgba(245,245,245,1)',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.04)',
                },
              }}
            >
              Reset
            </Button>
            <IconButton onClick={() => dispatch(closeEmployeeAdvancedSearchDrawer())} size="small" sx={{ ml: 1, bgcolor: 'backgroundSection.light', '&:hover': { bgcolor: 'section.light' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 0, borderColor: theme => theme.palette.section?.light || '#e1efff' }} />
        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
          <EmployeeAdvancedSearch
            onSearch={vals => { setAdvancedSearch(vals); setPage(1); }}
            onReset={() => { setAdvancedSearch(null); setPage(1); }}
            values={advancedSearch}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default EmployeeAdvancedSearchDrawer; 