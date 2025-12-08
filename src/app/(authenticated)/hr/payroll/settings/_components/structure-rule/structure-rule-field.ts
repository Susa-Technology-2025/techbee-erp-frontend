import { FieldConfig } from '@/components/smart-crud/modal-dialog';

// Field configurations for the structure rule card (for modal search)
export const getFieldConfigs = (): FieldConfig[] => [
  {
    name: 'id',
    type: 'text',
    label: 'ID',
    required: true,
    defaultValue: '',
  },
  {
    name: 'sequence',
    type: 'number',
    label: 'Sequence',
    required: true,
    defaultValue: 0,
  },
];

// Field configurations for the structure rule card with dropdowns
export const getFieldConfigsWithDropdowns = (structures: any[], rules: any[]): FieldConfig[] => [
  {
    name: 'id',
    type: 'text',
    label: 'ID',
    required: true,
    defaultValue: '',
  },
  {
    name: 'salaryStructure',
    type: 'select',
    label: 'Salary Structure',
    required: true,
    defaultValue: '',
    options: structures.map(structure => ({
      label: structure.name || `Structure ${structure.id}`,
      value: structure.id
    }))
  },
  {
    name: 'salaryRule',
    type: 'select',
    label: 'Salary Rule',
    required: true,
    defaultValue: '',
    options: rules.map(rule => ({
      label: rule.name || `Rule ${rule.id}`,
      value: rule.id
    }))
  },
  {
    name: 'sequence',
    type: 'number',
    label: 'Sequence',
    required: true,
    defaultValue: 0,
  },
];

// Utility functions to get names by ID from existing data
export const getStructureNameById = (structures: any[], id: string): string => {
  const structure = structures.find(s => s.id === id);
  return structure?.name || `Structure ${id}`;
};

export const getRuleNameById = (rules: any[], id: string): string => {
  const rule = rules.find(r => r.id === id);
  return rule?.name || `Rule ${id}`;
};
