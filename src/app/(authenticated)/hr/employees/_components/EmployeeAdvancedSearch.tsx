import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Typography,
  Collapse,
  Button,
  styled,
  Paper,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Clear, ExpandMore, ExpandLess, Search, Refresh } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

const SearchContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  borderRadius: 16,
  boxShadow: `0 4px 20px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.08)`,
  border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    // background: `linear-gradient(90deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    minWidth: 120,
    fontWeight: 600,
    fontSize: 14,
    textTransform: 'none',
    color: theme.palette.text.secondary,
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      color: theme.palette.section?.main || '#0b579f',
      fontWeight: 700,
    },
  },
  '& .MuiTabs-indicator': {
    background: `linear-gradient(90deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
      boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.section?.main || '#0b579f',
    fontWeight: 500,
  },
}));

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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  px: 3,
  py: 1,
  transition: 'all 0.2s ease',
  '&.search': {
    background: `linear-gradient(135deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.25)`,
    '&:hover': {
      boxShadow: `0 6px 16px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.35)`,
      transform: 'translateY(-1px)',
    },
  },
  '&.reset': {
    background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.grey[300]}`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[300]} 100%)`,
      transform: 'translateY(-1px)',
    },
  },
}));

const ExpandButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.section?.light || '#64b5f6'} 0%, ${theme.palette.section?.main || '#0b579f'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    transform: 'scale(1.05)',
  },
}));

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];
const maritalStatusOptions = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
];
const employmentTermOptions = [
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Temporary', label: 'Temporary' },
  { value: 'Internship', label: 'Internship' },
];
const retirementStatusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Retired', label: 'Retired' },
];

export interface EmployeeAdvancedSearchValues {
  jobTitle: string;
  grade: string;
  gender: string;
  maritalStatus: string;
  hireDateFrom: Dayjs | null;
  hireDateTo: Dayjs | null;
  dateOfBirthFrom: Dayjs | null;
  dateOfBirthTo: Dayjs | null;
  employmentTerm: string;
  qualification: string;
  retirementStatus: string;
  companyExperienceMin: string;
  companyExperienceMax: string;
  previousExperienceMin: string;
  previousExperienceMax: string;
}

interface EmployeeAdvancedSearchProps {
  onSearch: (values: EmployeeAdvancedSearchValues) => void;
  onReset: () => void;
  initialValues?: Partial<EmployeeAdvancedSearchValues>;
  values?: Partial<EmployeeAdvancedSearchValues> | null;
}

const tabConfig = [
  {
    label: 'Personal',
    value: 'personal',
    fields: [
      'gender',
      'maritalStatus',
      'dateOfBirthFrom',
      'dateOfBirthTo',
      'retirementStatus',
    ],
  },
  {
    label: 'Job',
    value: 'job',
    fields: [
      'jobTitle',
      'grade',
      'employmentTerm',
      'qualification',
    ],
  },
  {
    label: 'Experience',
    value: 'experience',
    fields: [
      'hireDateFrom',
      'hireDateTo',
      'companyExperienceMin',
      'companyExperienceMax',
      'previousExperienceMin',
      'previousExperienceMax',
    ],
  },
];

export const EmployeeAdvancedSearch: React.FC<EmployeeAdvancedSearchProps> = ({
  onSearch,
  onReset,
  initialValues = {},
  values: controlledValues,
}) => {
  const theme = useTheme();
  const [tab, setTab] = useState('personal');
  const [expanded, setExpanded] = useState(true);
  const [values, setValues] = useState<EmployeeAdvancedSearchValues>({
    jobTitle: initialValues.jobTitle || '',
    grade: initialValues.grade || '',
    gender: initialValues.gender || '',
    maritalStatus: initialValues.maritalStatus || '',
    hireDateFrom: initialValues.hireDateFrom || null,
    hireDateTo: initialValues.hireDateTo || null,
    dateOfBirthFrom: initialValues.dateOfBirthFrom || null,
    dateOfBirthTo: initialValues.dateOfBirthTo || null,
    employmentTerm: initialValues.employmentTerm || '',
    qualification: initialValues.qualification || '',
    retirementStatus: initialValues.retirementStatus || '',
    companyExperienceMin: initialValues.companyExperienceMin || '',
    companyExperienceMax: initialValues.companyExperienceMax || '',
    previousExperienceMin: initialValues.previousExperienceMin || '',
    previousExperienceMax: initialValues.previousExperienceMax || '',
  });
  const [pendingValues, setPendingValues] = useState<EmployeeAdvancedSearchValues | null>(null);

  // Debounce onSearch to avoid calling setState on parent during render
  useEffect(() => {
    if (pendingValues) {
      const handler = setTimeout(() => {
        onSearch(pendingValues);
        setPendingValues(null);
      }, 0);
      return () => clearTimeout(handler);
    }
  }, [pendingValues, onSearch]);

  // Sync with controlled values
  useEffect(() => {
    if (controlledValues) {
      setValues(prev => ({
        ...prev,
        ...controlledValues,
      }));
    } else if (controlledValues === null) {
      setValues({
        jobTitle: '',
        grade: '',
        gender: '',
        maritalStatus: '',
        hireDateFrom: null,
        hireDateTo: null,
        dateOfBirthFrom: null,
        dateOfBirthTo: null,
        employmentTerm: '',
        qualification: '',
        retirementStatus: '',
        companyExperienceMin: '',
        companyExperienceMax: '',
        previousExperienceMin: '',
        previousExperienceMax: '',
      });
    }
  }, [controlledValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const newVals = { ...prev, [name]: value };
      setPendingValues(newVals);
      return newVals;
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const newVals = { ...prev, [name]: value };
      setPendingValues(newVals);
      return newVals;
    });
  };

  const handleDateChange = (field: keyof EmployeeAdvancedSearchValues, date: Dayjs | null) => {
    setValues((prev) => {
      const newVals = { ...prev, [field]: date };
      setPendingValues(newVals);
      return newVals;
    });
  };

  const handleReset = () => {
    setValues({
      jobTitle: '',
      grade: '',
      gender: '',
      maritalStatus: '',
      hireDateFrom: null,
      hireDateTo: null,
      dateOfBirthFrom: null,
      dateOfBirthTo: null,
      employmentTerm: '',
      qualification: '',
      retirementStatus: '',
      companyExperienceMin: '',
      companyExperienceMax: '',
      previousExperienceMin: '',
      previousExperienceMax: '',
    });
    onReset();
  };

  return (
    <SearchContainer
      sx={{
        p: { xs: 1, sm: 2 },
        mb: 2,
        mt: 1,
        overflowX: 'auto',
        minHeight: 60,
        position: 'relative',
      }}
    >
      {/* Fixed small Reset button in upper right */}

      {/* Beautiful sticky header using grid */}
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          gap: 2,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: theme => theme.palette.background.paper,
          borderBottom: theme => `1.5px solid ${theme.palette.section?.light || '#e1efff'}`,
          px: { xs: 1, sm: 2 },
          py: 2,
          marginBottom: 3,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          boxShadow: '0 2px 8px rgba(33,150,243,0.04)',
          overflow: 'auto',
        }}
      >
        {/* Remove tabs, show all sections stacked with their own titles */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ width: '100%', pt: 5 }}>
            {/* Add pt: 5 to ensure content is never covered by the fixed Reset button */}
            <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, boxShadow: '0 2px 8px rgba(33,150,243,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, letterSpacing: 0.2, color: 'section.main', textAlign: 'center' }}>
                Personal
              </Typography>
              <Divider sx={{ mb: 2, width: '100%', borderColor: theme => theme.palette.section?.light || '#e1efff' }} />
              <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <StyledTextField
                  select
                  name="gender"
                  label="Gender"
                  value={values.gender}
                  onChange={handleSelectChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">All Genders</MenuItem>
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledTextField>
                <StyledTextField
                  select
                  name="maritalStatus"
                  label="Marital Status"
                  value={values.maritalStatus}
                  onChange={handleSelectChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {maritalStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledTextField>
                <StyledDatePicker
                  label="Date of Birth From"
                  value={values.dateOfBirthFrom}
                  onChange={(date) => handleDateChange('dateOfBirthFrom', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <StyledDatePicker
                  label="Date of Birth To"
                  value={values.dateOfBirthTo}
                  onChange={(date) => handleDateChange('dateOfBirthTo', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <StyledTextField
                  select
                  name="retirementStatus"
                  label="Retirement Status"
                  value={values.retirementStatus}
                  onChange={handleSelectChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {retirementStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledTextField>
              </Stack>
            </Paper>
            <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, boxShadow: '0 2px 8px rgba(33,150,243,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, letterSpacing: 0.2, color: 'section.main', textAlign: 'center' }}>
                Job
              </Typography>
              <Divider sx={{ mb: 2, width: '100%', borderColor: theme => theme.palette.section?.light || '#e1efff' }} />
              <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <StyledTextField
                  name="jobTitle"
                  label="Job Title"
                  value={values.jobTitle}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <StyledTextField
                  name="grade"
                  label="Grade"
                  value={values.grade}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <StyledTextField
                  select
                  name="employmentTerm"
                  label="Employment Term"
                  value={values.employmentTerm}
                  onChange={handleSelectChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">All Terms</MenuItem>
                  {employmentTermOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledTextField>
                <StyledTextField
                  name="qualification"
                  label="Qualification"
                  value={values.qualification}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Stack>
            </Paper>
            <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, boxShadow: '0 2px 8px rgba(33,150,243,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, letterSpacing: 0.2, color: 'section.main', textAlign: 'center' }}>
                Experience
              </Typography>
              <Divider sx={{ mb: 2, width: '100%', borderColor: theme => theme.palette.section?.light || '#e1efff' }} />
              <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <StyledDatePicker
                  label="Hire Date From"
                  value={values.hireDateFrom}
                  onChange={(date) => handleDateChange('hireDateFrom', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <StyledDatePicker
                  label="Hire Date To"
                  value={values.hireDateTo}
                  onChange={(date) => handleDateChange('hireDateTo', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <StyledTextField
                  name="companyExperienceMin"
                  label="Min Company Experience (Years)"
                  value={values.companyExperienceMin}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="number"
                />
                <StyledTextField
                  name="companyExperienceMax"
                  label="Max Company Experience (Years)"
                  value={values.companyExperienceMax}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="number"
                />
                <StyledTextField
                  name="previousExperienceMin"
                  label="Min Previous Experience (Years)"
                  value={values.previousExperienceMin}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="number"
                />
                <StyledTextField
                  name="previousExperienceMax"
                  label="Max Previous Experience (Years)"
                  value={values.previousExperienceMax}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="number"
                />
              </Stack>
            </Paper>

          </Box>
        </LocalizationProvider>
      </Box>

    </SearchContainer>
  );
}; 