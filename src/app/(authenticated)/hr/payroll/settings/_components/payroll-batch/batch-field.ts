import { FieldConfig } from '@/components/smart-crud/modal-dialog';

// Field configurations for the batch card (for modal search)
export const getFieldConfigs = (): FieldConfig[] => [
  {
    name: 'id',
    type: 'text',
    label: 'ID',
    required: true,
    defaultValue: '',
  },
  {
    name: 'name',
    type: 'text',
    label: 'Batch Name',
    required: true,
    defaultValue: '',
  },
  {
    name: 'description',
    type: 'text',
    label: 'Description',
    required: true,
    defaultValue: '',
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    required: true,
    defaultValue: 'Draft',
    options: [
      { label: 'Draft', value: 'Draft' },
      { label: 'Verified', value: 'Verified' },
    ],
  },
  {
    name: 'periodStart',
    type: 'date',
    label: 'Period Start',
    required: true,
    defaultValue: '',
  },
  {
    name: 'periodEnd',
    type: 'date',
    label: 'Period End',
    required: true,
    defaultValue: '',
  },
  {
    name: 'organizationNodeId',
    type: 'text',
    label: 'Organization Node ID',
    required: false,
    defaultValue: '',
  },
];

// Utility functions for status colors
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Draft': return '#6b7280';
    case 'Verified': return '#10b981';
    default: return '#6b7280';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'Draft': return 'Draft';
    case 'Verified': return 'Verified';
    default: return 'Unknown';
  }
}; 