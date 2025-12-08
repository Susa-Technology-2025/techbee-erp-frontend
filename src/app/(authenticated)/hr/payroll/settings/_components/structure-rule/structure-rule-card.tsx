import React from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { StructureRuleCardProps } from './structure-rule-type';
import GenericFieldRenderer from '@/components/smart-crud/GenericFieldRenderer';
import { getFieldConfigs, getStructureNameById, getRuleNameById } from './structure-rule-field';
import { useGetSalarystructuresQuery } from '../../../_queries/salaryStructures';
import { useGetSalaryrulesQuery } from '../../../_queries/salaryRules';

const StructureRuleCard: React.FC<StructureRuleCardProps> = ({
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
  
  // Debug: Log the card ID
  console.log('StructureRuleCard received card.id:', card.id);
  
  // Fetch all structures and rules data
  const { data: structures = [], isLoading: isLoadingStructures } = useGetSalarystructuresQuery();
  const { data: rules = [], isLoading: isLoadingRules } = useGetSalaryrulesQuery();
  
  // Get field configs for the card
  const fieldConfigs = getFieldConfigs();
  
  // Get names by filtering from fetched data
  const structureName = card.salaryStructure?.id ? getStructureNameById(structures, card.salaryStructure.id) : '';
  const ruleName = card.salaryRule?.id ? getRuleNameById(rules, card.salaryRule.id) : '';

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: 2,
        boxShadow: 2,
        border: '1px solid #eef2f7',
        position: 'relative',
        transition: 'all 0.3s',
        width: { xs: '100%', sm: 300 },
        // '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
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
                   {!card?.editing && <Typography sx={{ fontSize: 10, color: '#718096', fontWeight: 500 }}>
               Salary Structure
             </Typography>}

                   {/* Hidden ID field to pass through to modal */}
                   <GenericFieldRenderer
                     field={fieldConfigs[0]} // id field (index 0)
                     value={editingValues[card.id!]?.id ?? card.id ?? ''}
                     onChange={(val: any) => onEditFieldChange(card.id!, 'id', val)}
                     editing={card.editing}
                     viewProps={{ sx: { display: 'none' } }}
                     editProps={{ sx: { display: 'none' } }}
                   />

                   {/* Salary Structure dropdown */}
                   <GenericFieldRenderer
                     field={{
                       name: 'salaryStructure',
                       type: 'select',
                       label: 'Salary Structure',
                       required: true,
                       defaultValue: '',
                       options: structures.map(structure => ({
                         label: structure.name || `Structure ${structure.id}`,
                         value: structure.id
                       }))
                     }}
                     value={
                       editingValues[card.id!]?.salaryStructure 
                         ? (typeof editingValues[card.id!].salaryStructure === 'object' 
                             ? editingValues[card.id!].salaryStructure.id 
                             : editingValues[card.id!].salaryStructure)
                         : card.salaryStructure?.id ?? ''
                     }
                     onChange={(val: any) => {
                       console.log('salaryStructure onChange:', val);
                       onEditFieldChange(card.id!, 'salaryStructure', val);
                     }}
                     editing={card.editing}
                     viewProps={{ 
                       variant: 'h6', 
                       fontWeight: 700, 
                       sx: { color: '#2d3748', textAlign: 'center', mb: 1 },
                       children: isLoadingStructures ? 'Loading...' : structureName || `${card.salaryStructure?.id || ''}`
                     }}
                     editProps={{ variant: 'outlined', size: 'small', sx: { mb: 1, borderRadius: 2 }, fullWidth: true }}
                   />
         </Box>

                 <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
            {!card?.editing && <Typography sx={{ fontSize: "0.75rem", color: '#718096', fontWeight: 600 }}>Sequence:</Typography>}
                                               <GenericFieldRenderer
               field={fieldConfigs[1]} // sequence field (index 1 since id is now index 0)
              value={editingValues[card.id!]?.sequence ?? `${card.sequence}`}
              onChange={(val: any) => {
                console.log('sequence onChange:', val);
                onEditFieldChange(card.id!, 'sequence', val);
              }}
              editing={card.editing}
             viewProps={{ 
               sx: { 
                 fontWeight: 600,
                 fontSize: '0.75rem',
                 color: '#718096',
                 px: 1,
                 py: 0.5,
                 borderRadius: 1,
                 display: 'inline-block'
               },
               children: `Sequence: ${card.sequence || 0}`
             }}
             editProps={{ variant: 'outlined', size: 'small', sx: { borderRadius: 2 }, fullWidth: true }}
           />
         </Box>
      </Box>


                   <Box sx={{ p: 2, pt: 0 }}>
            {!card?.editing && <Typography sx={{ fontSize: 14, color: '#718096', mb: 1, fontWeight: 500 }}>
              Salary Rule
            </Typography>}
                                                                                                                                                                                                               <GenericFieldRenderer
                  field={{
                    name: 'salaryRule',
                    type: 'select',
                    label: 'Salary Rule',
                    required: true,
                    defaultValue: '',
                    options: rules.map(rule => ({
                      label: rule.name || `Rule ${rule.id}`,
                      value: rule.id
                    }))
                  }}
                  value={
                    editingValues[card.id!]?.salaryRule 
                      ? (typeof editingValues[card.id!].salaryRule === 'object' 
                          ? editingValues[card.id!].salaryRule.id 
                          : editingValues[card.id!].salaryRule)
                      : card.salaryRule?.id ?? ''
                  }
                  onChange={(val: any) => {
                    console.log('salaryRule onChange:', val);
                    onEditFieldChange(card.id!, 'salaryRule', val);
                  }}
                  editing={card.editing}
                  viewProps={{ 
                    sx: { color: '#4a5568', fontSize: 15, lineHeight: 1.7, minHeight: 40, display: 'flex', alignItems: 'center' },
                    children: isLoadingRules ? 'Loading...' : ruleName || (card.salaryRule?.id ? `Rule ${card.salaryRule.id}` : 'Unknown Rule') || ''
                  }}
                  editProps={{ variant: 'outlined', size: 'small', sx: { mb: 1, borderRadius: 2 }, fullWidth: true }}
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

export default StructureRuleCard;
