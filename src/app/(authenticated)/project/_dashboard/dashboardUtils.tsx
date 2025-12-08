import { DashboardData } from './dashboardData';

// Function to safely access nested properties
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

// Function to transform API data for charts
export const transformChartData = (
  data: any[],
  valueKey: string,
  labelKey: string
): Array<{ label: string; value: number }> => {
  return data.map(item => ({
    label: item[labelKey] || 'Unknown',
    value: item[valueKey] || 0,
  }));
};

// Function to detect data type and format accordingly
export const formatDashboardValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return 'N/A';
  
  if (typeof value === 'number') {
    // Handle currency
    if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost')) {
      return `$${value.toLocaleString()}`;
    }
    // Handle percentages
    if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('progress')) {
      return `${value}%`;
    }
    // Handle hours
    if (key.toLowerCase().includes('hours')) {
      return `${value} hrs`;
    }
    // Default number formatting
    return value.toLocaleString();
  }
  
  return String(value);
};