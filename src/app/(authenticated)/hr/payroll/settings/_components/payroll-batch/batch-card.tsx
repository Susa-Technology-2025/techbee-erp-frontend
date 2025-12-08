import React from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { BatchCardProps } from './batch-type';
import GenericFieldRenderer from '@/components/smart-crud/GenericFieldRenderer';
import { getFieldConfigs, getStatusColor, getStatusLabel } from './batch-field';
import dayjs from 'dayjs';

const BatchCard: React.FC<BatchCardProps> = ({
  card,
  editingValues,
  onSelect,
  onEdit,
  onDeleteRequest,
  onEditFieldChange,
  onSave,
  onCancel,
  isSaving = false,
  isDeleting = false,
}) => {
  const theme = useTheme();
  const fieldConfigs = getFieldConfigs();

  // Format dates for display
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  // Format dates for API (YYYY-MM-DDTHH:mm format)
  const formatDateForAPI = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DDTHH:mm');
  };

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: 2,
        boxShadow: 2,
        border: '1px solid #eef2f7',
        position: 'relative',
        transition: 'all 0.3s',
        width: { xs: '100%', sm: 350 },
        '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
      }}
      className={card.editing ? 'editing' : ''}
    >
      <input
        type="checkbox"
        checked={card.selected}
        onChange={() => onSelect(card.id!)}
        style={{
          position: 'absolute',
          top: 5,
          right: 0,
          width: 15,
          height: 15,
          accentColor: theme.palette.primary.main,
          cursor: 'pointer',
          zIndex: 10,
        }}
      />
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          background: 'linear-gradient(to right, #f8fafc, #eef2f7)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <GenericFieldRenderer
            field={fieldConfigs[1]} // name field
            value={editingValues[card.id!]?.name ?? card.name}
            onChange={(val: any) => onEditFieldChange(card.id!, 'name', val)}
            editing={card.editing}
            viewProps={{ variant: 'h6', fontWeight: 700, sx: { color: '#2d3748' } }}
            editProps={{ variant: 'outlined', size: 'small', sx: { mb: 1, borderRadius: 2 } }}
          />
        </Box>
        
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
          <GenericFieldRenderer
            field={fieldConfigs[3]} // status field
            value={editingValues[card.id!]?.status ?? card.status}
            onChange={(val: any) => onEditFieldChange(card.id!, 'status', val)}
            editing={card.editing}
            viewProps={{ 
              sx: { 
                fontWeight: 600,
                fontSize: '0.75rem',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                backgroundColor: getStatusColor(card.status),
                color: 'white'
              },
              children: getStatusLabel(card.status)
            }}
            editProps={{ variant: 'outlined', size: 'small', sx: { borderRadius: 2 }, fullWidth: true }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 14, color: '#718096', mb: 1, fontWeight: 500 }}>
          Description
        </Typography>
        <GenericFieldRenderer
          field={fieldConfigs[2]} // description field
          value={editingValues[card.id!]?.description ?? card.description}
          onChange={(val: any) => onEditFieldChange(card.id!, 'description', val)}
          editing={card.editing}
          multiline={true}
          minRows={2}
          viewProps={{ sx: { color: '#4a5568', fontSize: 15, lineHeight: 1.7, minHeight: 40 } }}
          editProps={{ variant: 'outlined', size: 'small', sx: { mb: 1, borderRadius: 2 }, fullWidth: true }}
        />
      </Box>

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography sx={{ fontSize: 14, color: '#718096', mb: 1, fontWeight: 500 }}>
          Period
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <GenericFieldRenderer
            field={fieldConfigs[4]} // periodStart field
            value={editingValues[card.id!]?.periodStart ?? card.periodStart}
            onChange={(val: any) => onEditFieldChange(card.id!, 'periodStart', val)}
            editing={card.editing}
            viewProps={{ 
              sx: { 
                fontSize: '0.875rem',
                color: '#4a5568',
                fontWeight: 500
              },
              children: card.periodStart ? formatDate(card.periodStart) : 'Not set'
            }}
            editProps={{ variant: 'outlined', size: 'small', sx: { borderRadius: 2 }, fullWidth: true }}
          />
          <Typography sx={{ color: '#718096', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
            to
          </Typography>
          <GenericFieldRenderer
            field={fieldConfigs[5]} // periodEnd field
            value={editingValues[card.id!]?.periodEnd ?? card.periodEnd}
            onChange={(val: any) => onEditFieldChange(card.id!, 'periodEnd', val)}
            editing={card.editing}
            viewProps={{ 
              sx: { 
                fontSize: '0.875rem',
                color: '#4a5568',
                fontWeight: 500
              },
              children: card.periodEnd ? formatDate(card.periodEnd) : 'Not set'
            }}
            editProps={{ variant: 'outlined', size: 'small', sx: { borderRadius: 2 }, fullWidth: true }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography sx={{ fontSize: 14, color: '#718096', mb: 1, fontWeight: 500 }}>
          Organization Node
        </Typography>
        <GenericFieldRenderer
          field={fieldConfigs[6]} // organizationNodeId field
          value={editingValues[card.id!]?.organizationNodeId ?? card.organizationNodeId}
          onChange={(val: any) => onEditFieldChange(card.id!, 'organizationNodeId', val)}
          editing={card.editing}
          viewProps={{ 
            sx: { 
              fontSize: '0.875rem',
              color: '#4a5568',
              fontWeight: 500
            },
            children: card.organizationNodeId || 'Not assigned'
          }}
          editProps={{ variant: 'outlined', size: 'small', sx: { borderRadius: 2 }, fullWidth: true }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 0 }}>
        {card.editing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => onSave(card.id!)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CloseIcon />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => onCancel(card.id!)}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => onEdit(card.id!)}
              disabled={isDeleting}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => onDeleteRequest(card)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default BatchCard; 