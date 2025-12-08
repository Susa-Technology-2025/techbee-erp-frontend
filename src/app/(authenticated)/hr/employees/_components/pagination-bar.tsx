import { Box, Pagination, PaginationProps, FormControl, InputLabel, Select, MenuItem, InputAdornment, Typography, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { setTableState, selectTableState } from '@/lib/store/tableSlice';
import TableRowsIcon from '@mui/icons-material/TableRows';
import InfoIcon from '@mui/icons-material/Info';

interface PaginationBarProps {
  sx?: any;
  tableId?: string;
  paginationProps?: Partial<PaginationProps>;
  // Props for current implementation (for backward compatibility)
  currentPage?: number;
  totalCount?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  useGlobalState?: boolean;
  showMetadataInfo?: boolean;
}

export function PaginationBar({ 
  sx, 
  tableId = 'employees', 
  paginationProps = {},
  currentPage = 1,
  totalCount = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  useGlobalState = true,
  showMetadataInfo = true
}: PaginationBarProps) {
  const dispatch: AppDispatch = useDispatch();
  const tableState = useSelector((state: RootState) =>
    selectTableState(state, tableId)
  );

  // Use global state if enabled, otherwise use props
  const { start = 0, size = 10, totalRowCount = 0 } = tableState || {};
  
  // Calculate pagination values
  const finalTotalCount = useGlobalState ? totalRowCount : totalCount;
  const finalRowsPerPage = useGlobalState ? size : rowsPerPage;
  const finalCurrentPage = useGlobalState ? Math.floor(start / size) + 1 : currentPage;
  
  // Calculate total pages and item ranges
  const totalPages = Math.ceil(finalTotalCount / finalRowsPerPage);
  const startItem = finalTotalCount > 0 ? start + 1 : 0;
  const endItem = Math.min(start + finalRowsPerPage, finalTotalCount);

  console.log(`PaginationBar [${tableId}]:`, {
    useGlobalState,
    finalTotalCount,
    finalRowsPerPage,
    totalPages,
    startItem,
    endItem,
    finalCurrentPage,
    start,
    size
  });

  const handleRowsPerPageChange = (event: any) => {
    const newSize = parseInt(event.target.value, 10);
    console.log('PaginationBar - Changing rows per page:', { newSize, currentSize: finalRowsPerPage });
    
    if (useGlobalState) {
      // Reset to first page and update size - this will trigger parent component to refetch
      const newState = { 
        size: newSize, 
        start: 0 
      };
      console.log('PaginationBar - Dispatching new state:', newState);
      dispatch(
        setTableState({
          tableId,
          newState
        })
      );
    } else {
      onRowsPerPageChange?.(newSize);
    }
  };

  const handlePageChange = (_: any, page: number) => {
    console.log('PaginationBar - Page change requested:', { page, currentPage: finalCurrentPage });
    
    if (useGlobalState && typeof page === 'number' && page > 0) {
      const newStart = (page - 1) * finalRowsPerPage;
      console.log('PaginationBar - Changing page:', { page, newStart, finalRowsPerPage });
      
      // Update Redux state - this will trigger parent component to refetch
      dispatch(
        setTableState({
          tableId,
          newState: { start: newStart },
        })
      );
    } else if (typeof page === 'number' && page > 0) {
      onPageChange?.(page);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '40%',
        width: 'fit-content',
        background: '#fff',
        borderRadius: 2,
        zIndex: 999,
        px: 1,
        py: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        boxShadow: '0 -2px 8px rgba(33,150,243,0.07)',
        ...sx,
      }}
    >
      {/* Metadata Info Tooltip */}
      {showMetadataInfo && (
        <Tooltip 
          title={
            <Box>
              <Typography variant="caption" display="block">
                <strong>Pagination Info:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                Total Records: {finalTotalCount.toLocaleString()}
              </Typography>
              <Typography variant="caption" display="block">
                Current Page: {finalCurrentPage} of {totalPages}
              </Typography>
              <Typography variant="caption" display="block">
                Showing: {startItem}-{endItem} of {finalTotalCount.toLocaleString()}
              </Typography>
              <Typography variant="caption" display="block">
                Page Size: {finalRowsPerPage}
              </Typography>
              <Typography variant="caption" display="block">
                Start: {start}, Size: {size}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: '#4caf50' }}>
                ✓ real time 
              </Typography>
            </Box>
          }
          arrow
          placement="top"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <InfoIcon fontSize="small" color="primary" />
            <Typography variant="caption" color="text.secondary">
              {startItem}-{endItem} of {finalTotalCount.toLocaleString()}
            </Typography>
          </Box>
        </Tooltip>
      )}

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Rows per page</InputLabel>
        <Select
          value={finalRowsPerPage}
          label="Rows per page"
          onChange={handleRowsPerPageChange}
          startAdornment={
            <InputAdornment position="start">
              <TableRowsIcon fontSize="small" />
            </InputAdornment>
          }
          sx={{
            '& .MuiSelect-select': {
              fontSize: '0.75rem',
              fontWeight: 500,
            },
          }}
        >
          {/* [5, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000] */}
          {[5, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000].map(n => (
            <MenuItem key={n} value={n} sx={{ fontSize: '0.75rem' }}>
              {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Pagination
        {...paginationProps}
        page={finalCurrentPage}
        count={totalPages}
        onChange={handlePageChange}
        disabled={totalPages === 0}
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            backgroundColor: '#f7fafd',
            borderRadius: 2,
            fontWeight: 500,
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
              color: 'white',
            },
            '&.Mui-disabled': {
              opacity: 0.5,
            },
          },
          ...paginationProps.sx,
        }}
      />
    </Box>
  );
} 