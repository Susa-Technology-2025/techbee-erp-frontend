import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
  SvgIcon,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { Edit as PenIcon } from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DeleteConfirmationModal from '@/components/form-components/delete-confirmation-modal';
import ExportButton from '@/components/reusable/ExportButton';
import { ZodSchema } from 'zod';

// Custom hook for modal state management
export const useSmartCrudModal = () => {
  const [open, setOpen] = useState(false);
  
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  
  return {
    open,
    handleOpen,
    handleClose,
  };
};

// Field configuration schema
export type FieldConfig = {
  name: string;
  defaultValue?: any;
  type?: 'text' | 'number' | 'email' | 'date' | 'select' | 'boolean' | 'async-multi-autocomplete' | 'id-to-name';
  required?: boolean;
  label?: string;
  options?: { label: string; value: any }[]; // For select fields
  // For async-multi-autocomplete
  asyncFetcher?: any;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;
  helperText?: string;
  initialDisplayValue?: string[];
  // For id-to-name
  idFetcher?: (id: string) => Promise<string>;
  fallbackText?: string;
  cacheResults?: boolean;
};

// Smart modal: handles all CRUD state/logic internally
export type SmartCrudModalProps<T> = {
  title: string;
  CardComponent: React.ComponentType<any>;
  useQuery: any; // RTK Query hook
  useCreate: any; // RTK Query mutation hook
  useUpdate: any; // RTK Query mutation hook
  useDelete: any; // RTK Query mutation hook
  codeColors?: Record<string, any>;
  getItemDisplayName?: (item: T) => string;
  open: boolean;
  onClose: () => void;
  // Schema for field configuration
  fields: FieldConfig[];
  // Zod schema for validation
  zodSchema?: ZodSchema<any>;
  // Custom validation function (takes precedence over zodSchema)
  customValidation?: (data: any) => { success: boolean; error?: any; data?: any };
  // Configuration props for showing/hiding features
  isSearch?: boolean;
  haveAdd?: boolean;
  haveSelectAll?: boolean;
  haveTitle?: boolean;
  haveExport?: boolean;
  onExport?: () => void;
};

function SmartCrudModal<T extends { id: string }>(
  {
    title,
    CardComponent,
    useQuery,
    useCreate,
    useUpdate,
    useDelete,
    codeColors,
    getItemDisplayName,
    open,
    onClose,
    fields,
    zodSchema,
    customValidation,
    isSearch = true,
    haveAdd = true,
    haveSelectAll = true,
    haveTitle = true,
    haveExport = false,
    onExport,
  }: SmartCrudModalProps<T>
) {
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Loading states
  const [savingItems, setSavingItems] = useState<Set<string>>(new Set());
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());
  
  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Fetch data and mutations - handle RTK Query hooks properly
  const { data: apiData = [], isLoading } = useQuery();
  const [createItem] = useCreate();
  const [updateItem] = useUpdate();
  const [deleteItem] = useDelete();
  
  // Local state for UI (selected, editing)
  const [items, setItems] = useState<(T & { selected: boolean; editing: boolean })[]>([]);

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      console.log('apiData', apiData);
      setItems(
        apiData.map((item: any) => ({ 
          ...item, 
          selected: false, 
          editing: false,
          // Ensure required fields have defaults
          description: item.description || "",
          id: String(item.id ?? Date.now())
        }))
      );
    }
  }, [apiData]);
  
  // Filtered - memoized to prevent unnecessary re-computations
  const filteredItems = useMemo(() => {
    const filtered = items.filter(item => {
      const s = search.toLowerCase();
      // Always show items that are being edited (new items or items in edit mode)
      if (item.editing) {
        return true;
      }
      
      // Search across all schema fields
      return fields.some(field => {
        const value = (item as any)[field.name];
        return value && typeof value === 'string' && value.toLowerCase().includes(s);
      });
    });
    return filtered;
  }, [items, search, fields]);
  
  // Handlers - memoized to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setItems(items.map(item => ({ ...item, editing: false })));
    onClose();
  }, [items, onClose]);
  
  const handleSelectAll = useCallback(() => {
    const allSelected = items.every(item => item.selected);
    setItems(items.map(item => ({ ...item, selected: !allSelected })));
  }, [items]);
  
  // Add (temp card) - using schema
  const handleAdd = useCallback(() => {
    const tempId = 'new' + Date.now();
    console.log('handleAdd creating new item with tempId:', tempId);
    const newItem: any = { id: tempId, selected: false, editing: true };
    
    // Initialize fields from schema (except id which is already set)
    fields.forEach(field => {
      if (field.name !== 'id') {
        newItem[field.name] = field.defaultValue ?? '';
      }
    });
    
    console.log('newItem being added:', newItem);
    setItems(items => [newItem, ...items]);
    
    // Initialize editing values from schema
    const initialEditingValues = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue ?? ''
    }), {});
    setEditingValues(prev => ({ ...prev, [tempId]: initialEditingValues }));
    console.log('initialEditingValues', editingValues);

  }, [fields]);
  
  // Edit - using schema
  const handleEdit = useCallback((id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      // Build editing values from schema fields
      const editingValues = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: (item as any)[field.name] ?? field.defaultValue ?? ''
      }), {});
      console.log('editingValues', editingValues);
      setEditingValues(prev => ({ ...prev, [id]: editingValues }));
      setItems(items.map(i => ({ ...i, editing: i.id === id })));
    }
  }, [items, fields]);
  
  const handleEditFieldChange = useCallback((id: string, field: string, value: any) => {
    setEditingValues(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, []);
  
  // Save
  const handleSave = async (id: string) => {

    const values = editingValues[id];
    console.log('values', values);
    if (!values) return;

    // Validate with custom validation function or Zod schema
    let validatedData = values;
    if (customValidation) {
      const result = customValidation(values);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e: any) => e.message).join(", ");
        setNotification({
          open: true,
          message: `Validation failed: ${errorMessages}`,
          severity: 'error'
        });
        return;
      }
      // Use the transformed data from validation if available, otherwise use original values
      validatedData = result.data || values;
    } else if (zodSchema) {
      const result = zodSchema.safeParse(values);
      if (!result.success) {
        const errorMessages = result.error.errors.map(e => e.message).join(", ");
        setNotification({
          open: true,
          message: `Validation failed: ${errorMessages}`,
          severity: 'error'
        });
        return;
      }
      validatedData = result.data;
    }

    try {
      setSavingItems(prev => new Set(prev).add(id));
      
      // Clean and validate the data before sending
      const cleanData = (data: any) => {
        const cleaned: any = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
      
          if (value === '' || value === null || value === undefined) {
            return; // skip empty fields
          }
      
          if (typeof value === 'object' && value?.id === '') {
            return; // skip nested objects with empty id
          }
      
          cleaned[key] = value; // keep valid fields
        });
        return cleaned;
      };
      
      
      // Debug: Log the data being sent
      console.log('Original values:', values);
      console.log('Cleaned values:', cleanData(validatedData));
      
      let result;
      if (id.startsWith('new')) {
        console.log('Creating new item...');
        console.log('Request body:', cleanData(validatedData));
        result = await createItem(cleanData(validatedData)).unwrap();
        console.log('Create result:', result);
        setItems(items => items.filter(i => i.id !== id));
        setNotification({
          open: true,
          message: `Successfully created ${getItemDisplayName ? getItemDisplayName(result) : 'item'}`,
          severity: 'success'
        });
      } else {
        console.log('Updating existing item...');
        console.log('Request body:', cleanData(validatedData));
        result = await updateItem({ id, data: cleanData(validatedData) }).unwrap();
        console.log('Update result:', result);
        setNotification({
          open: true,
          message: `Successfully updated ${getItemDisplayName ? getItemDisplayName(result) : 'item'}`,
          severity: 'success'
        });
      }
      
      setEditingValues(prev => {
        const newVals = { ...prev };
        delete newVals[id];
        return newVals;
      });
      
      setItems(items => items.map(i => i.id === id ? { ...i, editing: false } : i));
      
    } catch (error: any) {
      // Use console.warn instead of console.error to avoid triggering browser error handling
      console.warn('Save operation failed:', {
        error,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : 'no keys',
        errorData: error?.data,
        errorMessage: error?.message,
        errorStatus: error?.status,
        errorStatusText: error?.statusText,
        errorOriginalStatus: error?.originalStatus,
        errorError: error?.error,
        errorDetails: error?.details,
        fullError: JSON.stringify(error, null, 2)
      });
      
      let message = 'Failed to save item';
      
      // Try to extract meaningful error message from various error structures
      try {
        if (error?.data?.message) {
          message = error.data.message;
        } else if (error?.data?.error) {
          message = error.data.error;
        } else if (error?.data?.detail) {
          message = error.data.detail;
        } else if (error?.error?.data?.message) {
          message = error.error.data.message;
        } else if (error?.error?.data?.detail) {
          message = error.error.data.detail;
        } else if (error?.message) {
          message = error.message;
        } else if (error?.status) {
          message = `Server error: ${error.status} ${error.statusText || ''}`;
        } else if (error?.originalStatus) {
          message = `Server error: ${error.originalStatus}`;
        } else if (typeof error === 'string') {
          message = error;
        } else if (error && Object.keys(error).length === 0) {
          message = 'Unknown error occurred. Please check the console for details.';
        } else if (error?.error) {
          message = `Error: ${error.error}`;
        }
      } catch (parseError) {
        // If error parsing fails, use a generic message
        console.warn('Error parsing failed:', parseError);
        message = 'An unexpected error occurred while saving.';
      }
      
      setNotification({
        open: true,
        message,
        severity: 'error'
      });
    } finally {
      setSavingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  
  // Cancel
  const handleCancel = (id: string) => {
    if (id.startsWith('new')) {
      setItems(items => items.filter(i => i.id !== id));
      setEditingValues(prev => {
        const newVals = { ...prev };
        delete newVals[id];
        return newVals;
      });
    } else {
      setItems(items => items.map(i => i.id === id ? { ...i, editing: false } : i));
    }
  };
  
  // Delete
  const handleDeleteRequest = (item: T) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeletingItems(prev => new Set(prev).add(itemToDelete.id));
      
      await deleteItem(itemToDelete.id).unwrap();
      
      setNotification({
        open: true,
        message: `Successfully deleted ${getItemDisplayName ? getItemDisplayName(itemToDelete) : 'item'}`,
        severity: 'success'
      });
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      
    } catch (error: any) {
      console.warn('Delete operation failed:', error);
      let message = 'Failed to delete item';
      if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      setNotification({
        open: true,
        message,
        severity: 'error'
      });
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.id);
        return newSet;
      });
    }
  };
  
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleToggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);
  
  // Stats - memoized to prevent unnecessary re-computations
  const stats = useMemo(() => {
    const total = items.length;
    const selected = items.filter(i => i.selected).length;
    const editing = getItemDisplayName
      ? (items.find(i => i.editing) && getItemDisplayName(items.find(i => i.editing)!)) || 'None'
      : (items.find(i => i.editing) as any)?.name || 'None';
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, background: '#edf2f7', borderTop: '1px solid #e2e8f0', fontSize: 15, color: '#4a5568' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LayersIcon sx={{ mr: 1 }} />
          <span>Total: <span style={{ fontWeight: 700, color: '#2d3748' }}>{total}</span></span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          <span>Selected: <span style={{ fontWeight: 700, color: '#2d3748' }}>{selected}</span></span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PenIcon sx={{ mr: 1 }} />
          <span>Editing: <span style={{ fontWeight: 700, color: '#2d3748' }}>{editing}</span></span>
        </Box>
      </Box>
    );
  }, [items, getItemDisplayName]);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth={isFullScreen ? false : "lg"} 
        fullWidth={isFullScreen}
        fullScreen={isFullScreen}
        PaperProps={{ 
          sx: { 
            borderRadius: isFullScreen ? 0 : 3, 
            p: 0, 
            overflow: 'visible', 
            boxShadow: 12, 
            background: 'white',
            height: isFullScreen ? '100vh' : 'auto',
            maxHeight: isFullScreen ? '100vh' : '95vh',
          } 
        }}
      >
        <Box sx={{ background: 'linear-gradient(135deg, #2c3e50, #4a6491)', px: 3, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {haveTitle && (
              <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: -0.5 }}>
                {title}
              </Typography>
            )}
            {isSearch && (
              <Box sx={{ position: 'relative', width: { xs: 40, sm: 200 }, transition: 'all 0.3s', background: 'rgba(255,255,255,0.15)', borderRadius: 50, overflow: 'hidden', ml: haveTitle ? 2 : 0 }}>
                <SvgIcon component={SearchIcon} sx={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  style={{ width: '100%', padding: '12px 20px 12px 45px', border: 'none', background: 'transparent', color: "white", fontSize: '1.05rem' }}
                />
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {haveAdd && (
              <Button variant="contained" color="success" onClick={handleAdd} sx={{ borderRadius: '50%', minWidth: 42, width: 42, height: 42, p: 0 }}><AddIcon /></Button>
            )}
            {haveExport && onExport && (
              <ExportButton onClick={onExport} />
            )}
            {haveSelectAll && (
              <Button variant="contained" color="info" onClick={handleSelectAll} sx={{ borderRadius: '50%', minWidth: 42, width: 42, height: 42, p: 0 }}><DoneAllIcon /></Button>
            )}
            <Button 
              variant="contained" 
              color="warning" 
              onClick={handleToggleFullScreen} 
              sx={{ 
                borderRadius: '50%', 
                minWidth: 42, 
                width: 42, 
                height: 42, 
                p: 0,
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              {isFullScreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
            </Button>
            <IconButton onClick={handleClose} sx={{ background: 'rgba(255,255,255,0.15)', color: 'white', width: 42, height: 42, ml: 1, '&:hover': { background: 'rgba(255,255,255,0.25)', transform: 'rotate(90deg)' } }}><CloseIcon /></IconButton>
          </Box>
        </Box>
        <DialogContent sx={{ p: 3, background: '#f8fafc', maxHeight: isFullScreen ? 'calc(100vh - 100px)' : '65vh', overflowY: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2, color: '#4a5568' }}>Loading items...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 5,
              }}
            >
              {filteredItems.length === 0 ? (
                <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', p: 6, background: '#f8fafc', borderRadius: 3 }}>
                  <InboxIcon sx={{ fontSize: 64, color: '#cbd5e0', mb: 3 }} />
                  <Typography variant="h5" sx={{ mb: 2, color: '#4a5568' }}>No items found</Typography>
                  <Typography sx={{ fontSize: 18, color: '#718096' }}>Try adjusting your search or add a new item</Typography>
                </Box>
              ) : (
              filteredItems.map(item => (

                <CardComponent
                  key={item.id}
                  card={item}
                  editingValues={editingValues}
                  onSelect={(id: string) => setItems(items => items.map(i => i.id === id ? { ...i, selected: !i.selected } : i))}
                  onEdit={handleEdit}
                  onDeleteRequest={handleDeleteRequest}
                  onEditFieldChange={handleEditFieldChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  codeColors={codeColors}
                  isSaving={savingItems.has(item.id)}
                  isDeleting={deletingItems.has(item.id)}
                />
              ))
            )}
          </Box>
        )}
        </DialogContent>
        {stats}
      </Dialog>
      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={deletingItems.has(itemToDelete?.id || '')}
        itemDescription={itemToDelete && getItemDisplayName ? getItemDisplayName(itemToDelete) : ''}
      />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SmartCrudModal;
