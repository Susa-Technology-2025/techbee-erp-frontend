import { FieldConfig } from '@/components/smart-crud/modal-dialog';

// Field configurations for the structure card
export const getFieldConfigs = (): FieldConfig[] => [
  {
    name: 'name',
    type: 'text',
    label: 'Structure Name',
    required: true,
    defaultValue: '',
  },
  {
    name: 'code',
    type: 'text',
    label: 'Structure Code',
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
    name: 'organizationNodeId',
    type: 'text',
    label: 'Organization Node',
    required: false,
    defaultValue: '',
  },
];