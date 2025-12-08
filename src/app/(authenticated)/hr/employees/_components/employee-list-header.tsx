"use client";

import {
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Button,
  Popover,
  Typography,
  Box,
  Autocomplete,
  Chip,
  Divider,
  Fade,
} from '@mui/material';
import { 
  Search, 
  Add, 
  Tune, 
  FilterList, 
  Remove, 
  Done, 
  Clear,
  FilterAlt
} from '@mui/icons-material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import TableChartIcon from '@mui/icons-material/TableChart';
import React, { useState, useEffect } from 'react';
import { useMediaQuery, Collapse } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { setTableState, selectTableState } from '@/lib/store/tableSlice';

interface EmployeeListHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: string;
  onSortChange: (e: any) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  cardSize: 'small' | 'medium' | 'large';
  onCardSizeChange: (e: any) => void;
  viewMode: 'card' | 'table' | 'full-table';
  onViewModeChange: (mode: 'card' | 'table' | 'full-table') => void;
  onAddEmployee: () => void;
  onOpenAdvancedSearch?: () => void;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  useGlobalState?: boolean;
  tableId?: string;
}

// Advanced Filter Component
const AdvancedFilter = ({ tableId = 'employees' }: { tableId: string }) => {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const tableState = useSelector((state: RootState) =>
    selectTableState(state, tableId)
  );
  
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState(tableState?.filters || []);
  const [activeFilters, setActiveFilters] = useState(0);

  // Available columns for filtering
  const availableColumns = [
    { name: 'Employee Code', accessorKey: 'employeeCode' },
    { name: 'First Name', accessorKey: 'firstName' },
    { name: 'Last Name', accessorKey: 'lastName' },
    { name: 'Email', accessorKey: 'email' },
    { name: 'Phone Number', accessorKey: 'phoneNumber' },
    { name: 'Job Title', accessorKey: 'jobTitle' },
    { name: 'Status', accessorKey: 'isActive' },
    { name: 'Department', accessorKey: 'department' },
    { name: 'Hire Date', accessorKey: 'hireDate' },
    { name: 'Employee ID', accessorKey: 'id' },
  ];

  useEffect(() => {
    setLocalFilters(tableState?.filters || []);
    setActiveFilters(tableState?.filters?.length || 0);
  }, [tableState?.filters]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setLocalFilters(tableState?.filters || []);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddFilter = () => {
    setLocalFilters([...localFilters, { id: '', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const updated = [...localFilters];
    updated.splice(index, 1);
    setLocalFilters(updated);
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const updated = [...localFilters];
    updated[index] = { ...updated[index], [field]: value };
    setLocalFilters(updated);
  };

  const handleApplyFilters = () => {
    dispatch(setTableState({ 
      tableId, 
      newState: { 
        filters: localFilters,
        start: 0 // Reset to first page when applying filters
      } 
    }));
    handleClose();
  };

  const handleClearFilters = () => {
    setLocalFilters([]);
    dispatch(setTableState({ 
      tableId, 
      newState: { 
        filters: [],
        start: 0
      } 
    }));
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Advanced Filters">
        <IconButton
          onClick={handleClick}
          sx={{
            borderRadius: 2,
            position: 'relative',
            background: activeFilters > 0 ? 'primary.main' : 'transparent',
            color: activeFilters > 0 ? 'backgroundSection.contrastText' : 'primary.main',
            '&:hover': {
              background: activeFilters > 0 ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <FilterList />
          {activeFilters > 0 && (
            <Chip
              label={activeFilters}
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                height: 20,
                minWidth: 20,
                fontSize: '0.7rem',
                background: 'red',
                color: 'white',
                '& .MuiChip-label': { px: 0.5 },
              }}
            />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              borderRadius: 2,
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              minWidth: 480,
              maxWidth: 600,
              background: 'background.paper',
            },
          },
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
            Advanced Filters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Filter employees by specific columns and values
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {localFilters.map((filter, index) => (
            <Fade in={true} timeout={300 + index * 100} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 1,
                  background: 'action.hover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Autocomplete
                  options={availableColumns}
                  getOptionLabel={(option) => option.name}
                  value={
                    availableColumns.find(
                      (col) => col.accessorKey === filter.id
                    ) || null
                  }
                  onChange={(_, newValue) =>
                    handleFilterChange(
                      index,
                      'id',
                      newValue ? newValue.accessorKey : ''
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select column"
                      size="small"
                      sx={{
                        minWidth: 180,
                        '& .MuiInputBase-input': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  )}
                  sx={{
                    flex: 2,
                    '& .MuiAutocomplete-option': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Enter value"
                  value={filter.value}
                  onChange={(e) =>
                    handleFilterChange(index, 'value', e.target.value)
                  }
                  sx={{
                    flex: 2,
                    '& input': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveFilter(index)}
                  size="small"
                  color="error"
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      background: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>
              </Box>
            </Fade>
          ))}

          {localFilters.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3,
                color: 'text.secondary',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" textAlign="center">
                No filters applied. Click "Add Filter" to get started.
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleAddFilter}
              startIcon={<Add />}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Add Filter
            </Button>
            {localFilters.length > 0 && (
              <Button
                onClick={handleClearFilters}
                startIcon={<Clear />}
                size="small"
                variant="outlined"
                color="error"
                sx={{ borderRadius: 1 }}
              >
                Clear All
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleClose}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              startIcon={<Done />}
              size="small"
              variant="contained"
              sx={{
                borderRadius: 1,
                background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #303f9f 0%, #1976d2 100%)',
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export function EmployeeListHeader({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  cardSize,
  onCardSizeChange,
  viewMode,
  onViewModeChange,
  onAddEmployee,
  onOpenAdvancedSearch,
  rowsPerPage,
  onRowsPerPageChange,
  useGlobalState = true,
  tableId = 'employees',
}: EmployeeListHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [showMore, setShowMore] = useState(false);
  
  // Use local state for view mode instead of complex Redux state
  const [localViewMode, setLocalViewMode] = useState<'card' | 'table' | 'full-table'>('card');
  
  // Use local view mode instead of global state
  const finalViewMode = localViewMode;

  const handleViewModeChange = (mode: 'card' | 'table' | 'full-table') => {
    console.log('EmployeeListHeader - handleViewModeChange called with mode:', mode);
    setLocalViewMode(mode);
    
    // Also call the parent's onViewModeChange for compatibility
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ width: '100%'}}
    >
      {isLargeScreen ? (
        // Single row layout for large screens
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          {/* Left: Search and filters */}
          <Stack direction="row" alignItems="center" spacing={2} flex={1}>
            <TextField
              placeholder="Search employees..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={onSearchChange}
              sx={{
                width: 320,
                maxWidth: 480,
                background: "#f7fafd",
                borderRadius: 2,
                flex: 1,
                minWidth: 0,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120, width: 'auto', flex: 0, maxWidth: 160 }}>
              <InputLabel>Card Size</InputLabel>
              <Select value={cardSize} label="Card Size" onChange={onCardSizeChange}>
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120, width: 'auto', flex: 0, maxWidth: 160 }}>
              <InputLabel>Sort by</InputLabel>
              <Select value={sortBy} label="Sort by" onChange={onSortChange}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="date">Date Joined</MenuItem>
              </Select>
            </FormControl>

            {/* <FormGroup row sx={{ flexWrap: 'wrap', width: 'auto', minWidth: 0, maxWidth: '100%' }}>
              {['active', 'inactive', 'on leave'].map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={statusFilter.includes(status)}
                      onChange={() => onStatusFilterChange(status)}
                      size="small"
                    />
                  }
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  sx={{ mr: 1, minWidth: 0 }}
                />
              ))}
            </FormGroup> */}
          </Stack>
          {/* Right: Action buttons including view togglers and advanced search */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              width: 'auto',
              justifyContent: 'flex-end',
            }}
          >
            <Tooltip title="Card View">
              <IconButton
                color={finalViewMode === 'card' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('card')}
                sx={{ borderRadius: 2 }}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Table View">
              <IconButton
                color={finalViewMode === 'table' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('table')}
                sx={{ borderRadius: 2 }}
              >
                <TableRowsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Full Table">
              <IconButton
                color={finalViewMode === 'full-table' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('full-table')}
                sx={{ borderRadius: 2 }}
              >
                <TableChartIcon />
              </IconButton>
            </Tooltip>
            
            {/* Advanced Filter Component */}
            <AdvancedFilter tableId={tableId} />
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddEmployee}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 2,
                py: 1,
                background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
                fontWeight: 400,
                fontSize: 12,
                '&:hover': {
                  boxShadow: "0 6px 16px rgba(33, 150, 243, 0.3)",
                },
              }}
            >
              New Employee
            </Button>

          </Stack>
        </Stack>
      ) : (
        // Top row: always show search bar, collapse icon on mobile
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <TextField
            placeholder="Search employees..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            sx={{
              width: { xs: '50%', sm: 320 },
              maxWidth: { xs: '100%', sm: 400, md: 480 },
              background: "#f7fafd",
              borderRadius: 2,
              flex: 1,
              minWidth: 0,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          {isMobile && (
            <IconButton onClick={() => setShowMore((prev) => !prev)}>
              {showMore ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Stack>
      )}
      {/* Collapsible/always-visible controls for small/medium screens */}
      {!isLargeScreen && (
        <Collapse in={!isMobile || showMore} timeout="auto" unmountOnExit>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            sx={{ width: '100%', flexWrap: 'wrap', gap: { xs: 2, sm: 2 }, overflowX: 'auto', minWidth: 0, maxWidth: '100%' }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              flex={1}
              sx={{ width: '100%', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}
            >
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, ml: { xs: 0, sm: 2 }, width: { xs: '100%', sm: 'auto' }, flex: 1, maxWidth: { xs: '100%', sm: 160 } }}>
                <InputLabel>Card Size</InputLabel>
                <Select value={cardSize} label="Card Size" onChange={onCardSizeChange}>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, width: { xs: '100%', sm: 'auto' }, flex: 1, maxWidth: { xs: '100%', sm: 160 } }}>
                <InputLabel>Sort by</InputLabel>
                <Select value={sortBy} label="Sort by" onChange={onSortChange}>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="date">Date Joined</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' },
                mt: { xs: 1, sm: 0 },
              }}
            >
              <Tooltip title="Card View">
                <IconButton
                  color={finalViewMode === 'card' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('card')}
                  sx={{ borderRadius: 2, width: { xs: 'auto', sm: 'auto' } }}
                >
                  <ViewModuleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton
                  color={finalViewMode === 'table' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('table')}
                  sx={{ borderRadius: 2, width: { xs: 'auto', sm: 'auto' } }}
                >
                  <TableRowsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Full Table">
                <IconButton
                  color={finalViewMode === 'full-table' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('full-table')}
                  sx={{ borderRadius: 2, width: { xs: 'auto', sm: 'auto' } }}
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
              
              {/* Advanced Filter Component for mobile */}
              <AdvancedFilter tableId={tableId} />
              
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddEmployee}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
                  fontWeight: 600,
                  fontSize: 16,
                  mt: { xs: 1, sm: 0 },
                  ml: { xs: 0, sm: 2 },
                  mr: { xs: 0, sm: 2 },
                  minWidth: 0,
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    boxShadow: "0 6px 16px rgba(33, 150, 243, 0.3)",
                  },
                }}
              >
                New Employee
              </Button>
              <Tooltip title="Advanced Search">
                <span>
                  <IconButton
                    color="primary"
                    onClick={onOpenAdvancedSearch}
                    sx={{ borderRadius: 2, fontSize: 22, width: { xs: 'auto', sm: 'auto' } }}
                    disabled={!onOpenAdvancedSearch}
                  >
                    <Tune sx={{ fontSize: 24 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
} 