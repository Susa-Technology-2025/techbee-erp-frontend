import {FieldConfig } from '@/components/smart-crud/modal-dialog';

export const salaryRuleFields: FieldConfig[] = [
    { name: 'name', defaultValue: '', type: 'text', required: true, label: 'Name' },
    { name: 'code', defaultValue: '', type: 'text', required: true, label: 'Code' },
    { name: 'calculationType', defaultValue: 'Fixed', type: 'select', required: true, label: 'Calculation Type', 
      options: [
        { label: 'Fixed', value: 'Fixed' },
        { label: 'Formula', value: 'Formula' },
        { label: 'PercentageOfCategory', value: 'PercentageOfCategory' },
        { label: 'SplitEqually', value: 'SplitEqually' }
      ]
    },
    { name: 'fixedAmount', defaultValue: 0, type: 'number', required: false, label: 'Fixed Amount' },
    { name: 'formula', defaultValue: '', type: 'text', required: false, label: 'Formula' },
    { name: 'sequence', defaultValue: 0, type: 'number', required: false, label: 'Sequence' },
    { name: 'isActive', defaultValue: true, type: 'boolean', required: false, label: 'Is Active' },
    { name: 'externalCode', defaultValue: '', type: 'text', required: false, label: 'External Code' },
    { name: 'organizationNodeId', defaultValue: '', type: 'text', required: false, label: 'Organization Node ID' },
    { name: 'conditionExpression', defaultValue: '', type: 'text', required: false, label: 'Condition Expression' },
    { name: 'activeFrom', defaultValue: '', type: 'date', required: false, label: 'Active From' },
    { name: 'activeTo', defaultValue: '', type: 'date', required: false, label: 'Active To' },
    // Category field - this should be handled as an object with id
    { name: 'category', defaultValue: { id: '' }, type: 'text', required: true, label: 'Category ID' },
    { name: 'percentageOfCategory', defaultValue: { id: '' }, type: 'text', required: false, label: 'Percentage Of Category ID' },
    {name: 'IsDeduction', defaultValue: false, type: 'boolean', required: false, label: 'Is Deduction'},
  ];