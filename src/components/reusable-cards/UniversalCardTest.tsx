import React, { useState } from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import UniversalCard, { FieldConfig } from './UniversalCard';
import EntityNameById from '@/components/EntityNameById';
import { useGetSalaryrulecategoriesByIdQuery } from '@/app/hr/payroll/_queries/salaryRuleCategories';
import { useGetOrganizationnodesByIdQuery } from '@/app/dashboard/_queries/organizationNodes';

// Sample data for testing
const sampleSalaryRule = {
  id: '1',
  name: 'Basic Salary',
  code: 'BASIC_SAL',
  category: { id: 'cat1' },
  calculationType: 'Fixed',
  fixedAmount: 5000,
  formula: '',
  percentageOfCategory: null,
  amount: 5000,
  percentage: 0,
  organizationNode: { id: 'org1' },
  priority: 1,
  sequence: 1,
  isActive: true,
  externalCode: 'EXT001',
  organizationNodeId: 'org1',
  conditionExpression: null,
  activeFrom: '2024-01-01T00:00',
  activeTo: '2024-12-31T23:59',
};

const sampleStructure = {
  id: '2',
  name: 'Standard Structure',
  code: 'STD_STRUCT',
  description: 'Standard salary structure for all employees',
  organizationNodeId: 'org1',
};

const sampleBatch = {
  id: '3',
  name: 'January 2024 Payroll',
  code: 'JAN_2024',
  description: 'Payroll batch for January 2024',
  status: 'DRAFT',
  periodStart: '2024-01-01',
  periodEnd: '2024-01-31',
  organizationNodeId: 'org1',
};

// Field configurations for different card types
const salaryRuleFields: FieldConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    viewConfig: {
      variant: 'h6',
      fontWeight: 700,
      color: '#2d3748',
    },
    editConfig: {
      variant: 'standard',
      size: 'small',
      fullWidth: true,
    },
  },
  {
    key: 'code',
    label: 'Code',
    type: 'text',
    required: true,
    viewConfig: {
      variant: 'body2',
      fontWeight: 500,
      color: '#4a5568',
      customRender: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500, 
              opacity: 0.9,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#4a5568'
            }}
          >
            {value}
          </Typography>
        </Box>
      ),
    },
  },
  {
    key: 'calculationType',
    label: 'Calculation Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Fixed', label: 'Fixed' },
      { value: 'Formula', label: 'Formula' },
      { value: 'PercentageOfCategory', label: 'Percentage of Category' },
      { value: 'SplitEqually', label: 'Split Equally' },
    ],
    displayConfig: {
      color: '#2196f3',
      customRender: (value, data) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: '#2196f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
            }}>
              {value === 'Fixed' ? '💰' : value === 'Formula' ? '🧮' : value === 'PercentageOfCategory' ? '📊' : '⚖️'}
            </Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Calculation Type
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
      ),
    },
  },
  {
    key: 'fixedAmount',
    label: 'Fixed Amount',
    type: 'number',
    displayConfig: {
      format: (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value || 0),
    },
  },
  {
    key: 'formula',
    label: 'Formula',
    type: 'multiline',
    editConfig: {
      multiline: true,
      minRows: 2,
    },
  },
  {
    key: 'sequence',
    label: 'Sequence',
    type: 'number',
    viewConfig: {
      customRender: (value) => (
        <Box sx={{ 
          background: 'rgba(0,0,0,0.1)',
          color: '#4a5568',
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          display: 'inline-block',
        }}>
          Sequence: {value || 'N/A'}
        </Box>
      ),
    },
  },
  {
    key: 'isActive',
    label: 'Status',
    type: 'boolean',
    displayConfig: {
      customRender: (value) => (
        <Box sx={{ 
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: value ? '#4caf50' : '#f44336',
          boxShadow: value ? '0 0 8px rgba(76, 175, 80, 0.5)' : '0 0 8px rgba(244, 67, 54, 0.5)',
        }} />
      ),
    },
  },
  {
    key: 'category',
    label: 'Category',
    type: 'custom',
    viewConfig: {
      customRender: (value) => (
        <EntityNameById
          id={value?.id}
          useQuery={useGetSalaryrulecategoriesByIdQuery}
          field="name"
          fallback={value?.id || "Not assigned"}
          queryOptions={{ skip: !value?.id }}
        />
      ),
    },
  },
  {
    key: 'organizationNode',
    label: 'Organization',
    type: 'custom',
    viewConfig: {
      customRender: (value) => (
        <EntityNameById
          id={value?.id}
          useQuery={useGetOrganizationnodesByIdQuery}
          field="name"
          fallback={value?.id || "Not assigned"}
          queryOptions={{ skip: !value?.id }}
        />
      ),
    },
  },
  {
    key: 'activeFrom',
    label: 'Active From',
    type: 'date',
    displayConfig: {
      format: (value) => value ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Not set',
    },
  },
  {
    key: 'activeTo',
    label: 'Active To',
    type: 'date',
    displayConfig: {
      format: (value) => value ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Not set',
    },
  },
];

const structureFields: FieldConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    viewConfig: {
      variant: 'h6',
      fontWeight: 700,
      color: '#2d3748',
    },
  },
  {
    key: 'code',
    label: 'Code',
    type: 'text',
    required: true,
    viewConfig: {
      variant: 'body2',
      fontWeight: 500,
      color: '#4a5568',
      customRender: (value) => (
        <Box sx={{ 
          fontWeight: 200, 
          textTransform: 'uppercase', 
          letterSpacing: 0.5,
          py: 0.4, 
          borderRadius: 10,
          px: 1,
          background: "#BFBFC1",
        }}>
          {value}
        </Box>
      ),
    },
  },
  {
    key: 'description',
    label: 'Description',
    type: 'multiline',
    editConfig: {
      multiline: true,
      minRows: 3,
    },
    viewConfig: {
      variant: 'body2',
      color: '#4a5568',
      sx: { lineHeight: 1.7, minHeight: 60 },
    },
  },
  {
    key: 'organizationNodeId',
    label: 'Organization Node',
    type: 'text',
    viewConfig: {
      variant: 'body2',
      color: '#4a5568',
      customRender: (value) => value || 'N/A',
    },
  },
];

const batchFields: FieldConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    viewConfig: {
      variant: 'h6',
      fontWeight: 700,
      color: '#2d3748',
    },
  },
  {
    key: 'code',
    label: 'Code',
    type: 'text',
    required: true,
    viewConfig: {
      variant: 'body2',
      fontWeight: 500,
      color: '#4a5568',
    },
  },
  {
    key: 'description',
    label: 'Description',
    type: 'multiline',
    editConfig: {
      multiline: true,
      minRows: 2,
    },
    viewConfig: {
      variant: 'body2',
      color: '#4a5568',
      sx: { lineHeight: 1.7, minHeight: 40 },
    },
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'PROCESSING', label: 'Processing' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
    displayConfig: {
      customRender: (value) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'DRAFT': return '#ff9800';
            case 'PROCESSING': return '#2196f3';
            case 'COMPLETED': return '#4caf50';
            case 'CANCELLED': return '#f44336';
            default: return '#757575';
          }
        };
        
        return (
          <Box sx={{ 
            fontWeight: 600,
            fontSize: '0.75rem',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
            backgroundColor: getStatusColor(value),
            color: 'white'
          }}>
            {value}
          </Box>
        );
      },
    },
  },
  {
    key: 'periodStart',
    label: 'Period Start',
    type: 'date',
    displayConfig: {
      format: (value) => value ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Not set',
    },
  },
  {
    key: 'periodEnd',
    label: 'Period End',
    type: 'date',
    displayConfig: {
      format: (value) => value ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Not set',
    },
  },
  {
    key: 'organizationNodeId',
    label: 'Organization Node',
    type: 'text',
    viewConfig: {
      variant: 'body2',
      color: '#4a5568',
      customRender: (value) => value || 'Not assigned',
    },
  },
];

const UniversalCardTest: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [editingCards, setEditingCards] = useState<string[]>([]);
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});

  const handleSelect = (id: string) => {
    setSelectedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = (id: string) => {
    setEditingCards(prev => [...prev, id]);
  };

  const handleCancel = (id: string) => {
    setEditingCards(prev => prev.filter(cardId => cardId !== id));
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const handleEditFieldChange = (id: string, field: string, value: any) => {
    setEditingValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (id: string) => {
    // Here you would typically save the data to your backend
    console.log('Saving card:', id, editingValues[id]);
    setEditingCards(prev => prev.filter(cardId => cardId !== id));
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const handleDeleteRequest = (data: any) => {
    // Here you would typically show a confirmation dialog
    console.log('Delete requested for:', data);
  };

  return (
    <Box sx={{ p: 4, height: '100vh', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Universal Card Test Component
      </Typography>
      
      <Stack spacing={4}>
        {/* Salary Rule Card */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Salary Rule Card
          </Typography>
          <UniversalCard
            data={sampleSalaryRule}
            id={sampleSalaryRule.id}
            fields={salaryRuleFields}
            selected={selectedCards.includes(sampleSalaryRule.id)}
            editing={editingCards.includes(sampleSalaryRule.id)}
            editingValues={editingValues[sampleSalaryRule.id] || {}}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onEditFieldChange={handleEditFieldChange}
            onSave={handleSave}
            onDeleteRequest={handleDeleteRequest}
            layout={{
              headerFields: ['name', 'code', 'sequence', 'isActive'],
              contentFields: ['calculationType', 'fixedAmount', 'formula', 'category', 'organizationNode', 'activeFrom', 'activeTo'],
              footerFields: [],
            }}
          />
        </Box>

        {/* Structure Card */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Structure Card
          </Typography>
          <UniversalCard
            data={sampleStructure}
            id={sampleStructure.id}
            fields={structureFields}
            selected={selectedCards.includes(sampleStructure.id)}
            editing={editingCards.includes(sampleStructure.id)}
            editingValues={editingValues[sampleStructure.id] || {}}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onEditFieldChange={handleEditFieldChange}
            onSave={handleSave}
            onDeleteRequest={handleDeleteRequest}
            cardStyle={{
              width: { xs: '100%', sm: 300 },
              maxWidth: 350,
            }}
          />
        </Box>

        {/* Batch Card */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Batch Card
          </Typography>
          <UniversalCard
            data={sampleBatch}
            id={sampleBatch.id}
            fields={batchFields}
            selected={selectedCards.includes(sampleBatch.id)}
            editing={editingCards.includes(sampleBatch.id)}
            editingValues={editingValues[sampleBatch.id] || {}}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onEditFieldChange={handleEditFieldChange}
            onSave={handleSave}
            onDeleteRequest={handleDeleteRequest}
            cardStyle={{
              width: { xs: '100%', sm: 350 },
              maxWidth: 400,
            }}
            layout={{
              headerFields: ['name', 'status'],
              contentFields: ['description', 'periodStart', 'periodEnd', 'organizationNodeId'],
              footerFields: [],
            }}
          />
        </Box>

        {/* Debug Info */}
        <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Debug Information
          </Typography>
          <Typography variant="body2">
            Selected Cards: {selectedCards.join(', ') || 'None'}
          </Typography>
          <Typography variant="body2">
            Editing Cards: {editingCards.join(', ') || 'None'}
          </Typography>
          <Typography variant="body2">
            Editing Values: {JSON.stringify(editingValues, null, 2)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default UniversalCardTest; 