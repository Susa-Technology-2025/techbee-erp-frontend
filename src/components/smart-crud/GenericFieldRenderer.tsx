import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  styled,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FieldConfig as BaseFieldConfig } from './modal-dialog';
import { RHFMultiAutocomplete } from '../RHFAsyncMultiAutoComplete';
import FormulaInputField from './FormulaInputField';

// Extend FieldConfig for async-multi-autocomplete
export type AsyncMultiAutocompleteFieldConfig = BaseFieldConfig & {
  type: 'async-multi-autocomplete';
  asyncFetcher: any;
  getOptionLabel: (option: any) => string;
  getOptionValue: (option: any) => string;
  helperText?: string;
  initialDisplayValue?: string[];
};

// Extend FieldConfig for id-to-name conversion
export type IdToNameFieldConfig = Omit<BaseFieldConfig, 'type'> & {
  type: 'id-to-name';
  idFetcher: (id: string) => Promise<string>; // Function to fetch name by ID
  fallbackText?: string; // Text to show while loading or if fetch fails
  cacheResults?: boolean; // Whether to cache fetched names
};

// Extend FieldConfig for formula input
export type FormulaFieldConfig = Omit<BaseFieldConfig, 'type'> & {
  type: 'formula';
  dictionaries?: Array<{ key: string; description: string }>;
};

export type FieldConfig = BaseFieldConfig | AsyncMultiAutocompleteFieldConfig | IdToNameFieldConfig | FormulaFieldConfig;

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
    border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
    transition: 'all 0.2s ease',
    '&:hover': {
      border: `1px solid ${theme.palette.section?.light || '#64b5f6'}40`,
      boxShadow: `0 2px 8px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.1)`,
    },
    '&.Mui-focused': {
      border: `2px solid ${theme.palette.section?.main || '#0b579f'}`,
      boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
    },
  },
}));

interface GenericFieldRendererProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  editing: boolean;
  multiline?: boolean;
  minRows?: number;
  viewProps?: any;
  editProps?: any;
}

const GenericFieldRenderer: React.FC<GenericFieldRendererProps> = ({
  field,
  value,
  onChange,
  editing,
  multiline = false,
  minRows = 1,
  viewProps = {},
  editProps = {},
}) => {
  // State for id-to-name conversion
  const [nameCache, setNameCache] = React.useState<Record<string, string>>({});
  const [loadingNames, setLoadingNames] = React.useState<Record<string, boolean>>({});

  // Function to fetch name by ID
  const fetchNameById = React.useCallback(async (id: string, fetcher: (id: string) => Promise<string>) => {
    if (!id || nameCache[id]) return nameCache[id];
    
    setLoadingNames(prev => ({ ...prev, [id]: true }));
    try {
      const name = await fetcher(id);
      setNameCache(prev => ({ ...prev, [id]: name }));
      return name;
    } catch (error) {
      console.warn(`Failed to fetch name for ID ${id}:`, error);
      return null;
    } finally {
      setLoadingNames(prev => ({ ...prev, [id]: false }));
    }
  }, [nameCache]);

  if (!editing) {
    // View mode
    let displayValue = value || field.defaultValue || '';
    
    // For select fields, show the label instead of value
    if (field.type === 'select' && field.options) {
      const option = field.options.find(opt => opt.value === value);
      displayValue = option ? option.label : value;
    }
    
    // For id-to-name fields, fetch and display the name
    if (field.type === 'id-to-name') {
      const idToNameField = field as IdToNameFieldConfig;
      const [fetchedName, setFetchedName] = React.useState<string>('');
      const [isLoading, setIsLoading] = React.useState(false);

      React.useEffect(() => {
        if (value && idToNameField.idFetcher) {
          setIsLoading(true);
          fetchNameById(value, idToNameField.idFetcher)
            .then(name => {
              setFetchedName(name || idToNameField.fallbackText || value);
            })
            .finally(() => setIsLoading(false));
        } else {
          setFetchedName(idToNameField.fallbackText || value || '');
        }
      }, [value, idToNameField.idFetcher, idToNameField.fallbackText]);

      return (
        <Typography {...viewProps}>
          {isLoading ? 'Loading...' : fetchedName}
        </Typography>
      );
    }
    
    return (
      <Typography {...viewProps}>
        {displayValue}
      </Typography>
    );
  }

  // Edit mode
  switch (field.type) {
    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              {...editProps}
            />
          }
          label={field.label}
        />
      );
    case 'select':
      return (
        <FormControl fullWidth size="small" {...editProps}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            label={field.label}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'date':
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledDatePicker
            value={value ? dayjs(value) : null}
            onChange={(date) => {
              // Convert Dayjs object to "YYYY-MM-DDTHH:mm" format for validation
              const formattedDate = date ? date.format('YYYY-MM-DDTHH:mm') : null;
              onChange(formattedDate);
            }}
            label={field.label}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
            {...editProps}
          />
        </LocalizationProvider>
      );

    case 'number':
      return (
        <TextField
          type="number"
          value={value || field.defaultValue || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          label={field.label}
          fullWidth
          size="small"
          {...editProps}
        />
      );

    case 'email':
      return (
        <TextField
          type="email"
          value={value || field.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          label={field.label}
          fullWidth
          size="small"
          {...editProps}
        />
      );

    case 'text':
    default:
      return (
        <TextField
          value={value || field.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          label={field.label}
          placeholder={field.label}
          fullWidth
          size="small"
          multiline={multiline}
          minRows={multiline ? minRows : undefined}
          {...editProps}
        />
      );
    case 'async-multi-autocomplete': {
      const asyncField = field as AsyncMultiAutocompleteFieldConfig;
      return (
        <RHFMultiAutocomplete
          name={asyncField.name}
          fetcher={asyncField.asyncFetcher}
          getOptionLabel={asyncField.getOptionLabel}
          getOptionValue={asyncField.getOptionValue}
          label={asyncField.label || ''}
          helperText={asyncField.helperText}
          sx={editProps?.sx}
          initialDisplayValue={asyncField.initialDisplayValue}
        />
      );
    }
    case 'id-to-name': {
      const idToNameField = field as IdToNameFieldConfig;
      return (
        <TextField
          value={value || field.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          label={field.label}
          placeholder={field.label}
          fullWidth
          size="small"
          helperText="Enter the ID to fetch the corresponding name"
          {...editProps}
        />
      );
    }
    case 'formula': {
      const formulaField = field as FormulaFieldConfig;
      return (
        <FormulaInputField
          value={value || field.defaultValue || ''}
          onChange={onChange}
          dictionaries={formulaField.dictionaries || []}
          label={field.label}
          placeholder={field.label}
          multiline={multiline}
          minRows={minRows}
          editProps={editProps}
          viewProps={viewProps}
        />
      );
    }
  }
};

export default GenericFieldRenderer; 