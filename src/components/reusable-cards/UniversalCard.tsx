import React from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Chip,
  Badge,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  Calculate as CalculateIcon,
  Code as CodeIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Percent as PercentIcon,
  Schedule as ScheduleIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import GenericFieldRenderer from '@/components/smart-crud/GenericFieldRenderer';

// Types for the universal card
export interface FieldConfig {
  key: string;
  label?: string;
  type: 'text' | 'number' | 'select' | 'multiline' | 'date' | 'boolean' | 'chip' | 'badge' | 'avatar' | 'custom';
  required?: boolean;
  options?: { value: any; label: string }[];
  validation?: any;
  displayConfig?: {
    icon?: React.ReactNode;
    color?: string;
    format?: (value: any) => string;
    customRender?: (value: any, data: any) => React.ReactNode;
  };
  editConfig?: {
    multiline?: boolean;
    minRows?: number;
    fullWidth?: boolean;
    variant?: 'outlined' | 'standard' | 'filled';
    size?: 'small' | 'medium' | 'large';
    sx?: any;
  };
  viewConfig?: {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
    fontWeight?: number;
    color?: string;
    customRender?: (value: any, data: any) => React.ReactNode;
    sx?: any;
  };
}

export interface UniversalCardProps {
  // Data
  data: any;
  id: string;
  
  // Field configuration
  fields: FieldConfig[];
  
  // State
  selected?: boolean;
  editing?: boolean;
  editingValues?: Record<string, any>;
  
  // Callbacks
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDeleteRequest?: (data: any) => void;
  onEditFieldChange?: (id: string, field: string, value: any) => void;
  onSave?: (id: string) => void;
  onCancel?: (id: string) => void;
  
  // Loading states
  isSaving?: boolean;
  isDeleting?: boolean;
  
  // Styling
  cardStyle?: {
    width?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    background?: string;
    borderRadius?: number;
    boxShadow?: number;
  };
  
  // Layout configuration
  layout?: {
    headerFields?: string[]; // Fields to show in header
    contentFields?: string[]; // Fields to show in content
    footerFields?: string[]; // Fields to show in footer
    showActions?: boolean;
    showSelection?: boolean;
  };
  
  // Custom renderers
  customHeader?: (data: any, editing: boolean) => React.ReactNode;
  customContent?: (data: any, editing: boolean) => React.ReactNode;
  customFooter?: (data: any, editing: boolean) => React.ReactNode;
}

const UniversalCard: React.FC<UniversalCardProps> = ({
  data,
  id,
  fields,
  selected = false,
  editing = false,
  editingValues = {},
  onSelect,
  onEdit,
  onDeleteRequest,
  onEditFieldChange,
  onSave,
  onCancel,
  isSaving = false,
  isDeleting = false,
  cardStyle = {},
  layout = {},
  customHeader,
  customContent,
  customFooter,
}) => {
  const theme = useTheme();
  
  // Default layout configuration
  const defaultLayout = {
    headerFields: fields.filter(f => f.key === 'name' || f.key === 'code' || f.key === 'title').map(f => f.key),
    contentFields: fields.filter(f => !['name', 'code', 'title'].includes(f.key)).map(f => f.key),
    footerFields: [],
    showActions: true,
    showSelection: true,
    ...layout,
  };

  // Helper functions
  const getFieldConfig = (key: string) => fields.find(f => f.key === key);
  
  const formatValue = (field: FieldConfig, value: any) => {
    if (field.displayConfig?.format) {
      return field.displayConfig.format(value);
    }
    if (field.displayConfig?.customRender) {
      return field.displayConfig.customRender(value, data);
    }
    return value;
  };

  const renderField = (fieldKey: string, isEditing: boolean) => {
    const field = getFieldConfig(fieldKey);
    if (!field) return null;

    const currentValue = isEditing 
      ? (editingValues[fieldKey] ?? data[fieldKey])
      : data[fieldKey];

    const handleChange = (value: any) => {
      onEditFieldChange?.(id, fieldKey, value);
    };

    // Custom render for view mode
    if (!isEditing && field.viewConfig?.customRender) {
      return field.viewConfig.customRender(currentValue, data);
    }

    // Special field types
    if (field.type === 'chip') {
      return (
        <Chip
          label={formatValue(field, currentValue)}
          size="small"
          sx={{
            backgroundColor: field.displayConfig?.color || theme.palette.primary.main,
            color: 'white',
            fontWeight: 600,
          }}
        />
      );
    }

    if (field.type === 'badge') {
      return (
        <Badge
          badgeContent={formatValue(field, currentValue)}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: field.displayConfig?.color || theme.palette.primary.main,
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
            }
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: field.displayConfig?.color || theme.palette.primary.main,
            }}
          />
        </Badge>
      );
    }

    if (field.type === 'avatar') {
      return (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: field.displayConfig?.color || theme.palette.primary.main,
            fontSize: '1rem',
          }}
        >
          {field.displayConfig?.icon || field.label?.[0] || '?'}
        </Avatar>
      );
    }

    // Generic field renderer for other types
    // Handle custom types separately
    if (field.type === 'custom') {
      // For custom types, we rely on customRender in viewConfig
      if (!isEditing && field.viewConfig?.customRender) {
        return field.viewConfig.customRender(currentValue, data);
      }
      // In editing mode, show a simple text input for custom fields
      return (
        <GenericFieldRenderer
          field={{
            name: field.key,
            label: field.label,
            type: 'text',
            required: field.required,
            options: field.options,
          }}
          value={currentValue}
          onChange={handleChange}
          editing={isEditing}
          editProps={{
            variant: field.editConfig?.variant || 'outlined',
            size: field.editConfig?.size || 'small',
            fullWidth: field.editConfig?.fullWidth !== false,
            sx: {
              borderRadius: 2,
              background: 'white',
              ...field.editConfig?.sx,
            },
          }}
          viewProps={{
            variant: field.viewConfig?.variant || 'body2',
            fontWeight: field.viewConfig?.fontWeight || 500,
            color: field.viewConfig?.color || 'text.primary',
            sx: field.viewConfig?.sx,
          }}
        />
      );
    }

    // Handle multiline type by converting to text for GenericFieldRenderer
    const fieldType = field.type === 'multiline' ? 'text' : field.type;
    
    return (
      <GenericFieldRenderer
        field={{
          name: field.key,
          label: field.label,
          type: fieldType,
          required: field.required,
          options: field.options,
        }}
        value={currentValue}
        onChange={handleChange}
        editing={isEditing}
        multiline={field.editConfig?.multiline || field.type === 'multiline'}
        minRows={field.editConfig?.minRows}
        editProps={{
          variant: field.editConfig?.variant || 'outlined',
          size: field.editConfig?.size || 'small',
          fullWidth: field.editConfig?.fullWidth !== false,
          sx: {
            borderRadius: 2,
            background: 'white',
            ...field.editConfig?.sx,
          },
        }}
        viewProps={{
          variant: field.viewConfig?.variant || 'body2',
          fontWeight: field.viewConfig?.fontWeight || 500,
          color: field.viewConfig?.color || 'text.primary',
          sx: field.viewConfig?.sx,
        }}
      />
    );
  };

  const renderHeader = () => {
    if (customHeader) {
      return customHeader(data, editing);
    }

    return (
      <Box
        sx={{
          background: 'linear-gradient(to right, #f8fafc, #eef2f7)',
          color: '#2d3748',
          p: 3,
          position: 'relative',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Stack spacing={1}>
          {defaultLayout.headerFields.map(fieldKey => (
            <Box key={fieldKey}>
              {renderField(fieldKey, editing)}
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderContent = () => {
    if (customContent) {
      return customContent(data, editing);
    }

    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {defaultLayout.contentFields.map(fieldKey => {
            const field = getFieldConfig(fieldKey);
            if (!field) return null;

            return (
              <Box key={fieldKey}>
                {field.label && (
                  <Typography sx={{ fontSize: 14, color: '#718096', mb: 1, fontWeight: 500 }}>
                    {field.label}
                  </Typography>
                )}
                {renderField(fieldKey, editing)}
              </Box>
            );
          })}
        </Stack>
      </Box>
    );
  };

  const renderFooter = () => {
    if (customFooter) {
      return customFooter(data, editing);
    }

    return (
      <Box
        sx={{
          background: '#fafafa',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2.5,
        }}
      >
        <Stack spacing={2}>
          {/* Footer fields */}
          {defaultLayout.footerFields.map(fieldKey => (
            <Box key={fieldKey}>
              {renderField(fieldKey, editing)}
            </Box>
          ))}

          {/* Action buttons */}
          {defaultLayout.showActions && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {editing ? (
                <>
                  <Tooltip title="Save changes">
                    <Button
                      onClick={() => onSave?.(id)}
                      disabled={isSaving}
                      size="small"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'success.dark' },
                        '&:disabled': { bgcolor: 'action.disabled' }
                      }}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Cancel editing">
                    <Button
                      onClick={() => onCancel?.(id)}
                      disabled={isSaving}
                      size="small"
                      variant="contained"
                      startIcon={<CancelIcon />}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'error.dark' },
                        '&:disabled': { bgcolor: 'action.disabled' }
                      }}
                    >
                      Cancel
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Edit">
                    <Button
                      onClick={() => onEdit?.(id)}
                      disabled={isDeleting}
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&:disabled': { bgcolor: 'action.disabled' }
                      }}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      onClick={() => onDeleteRequest?.(data)}
                      disabled={isDeleting}
                      size="small"
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'error.dark' },
                        '&:disabled': { bgcolor: 'action.disabled' }
                      }}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        background: cardStyle.background || 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: cardStyle.borderRadius || 4,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        boxShadow: cardStyle.boxShadow || '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        cursor: 'pointer',
        width: cardStyle.width || { xs: '100%', sm: 380 },
        maxWidth: cardStyle.maxWidth || 420,
        minHeight: cardStyle.minHeight || 320,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          borderColor: 'primary.main',
        },
        '&:active': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      {/* Selection Checkbox */}
      {defaultLayout.showSelection && onSelect && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
          }}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(id)}
            style={{
              width: 18,
              height: 18,
              accentColor: theme.palette.primary.main,
              cursor: 'pointer',
            }}
          />
        </Box>
      )}

      {/* Card Content */}
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </Box>
  );
};

export default UniversalCard; 