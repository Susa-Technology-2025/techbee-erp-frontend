'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ComplianceItem } from '../types/dashboard';

interface ComplianceListProps {
  compliances: ComplianceItem[];
}

const ComplianceList: React.FC<ComplianceListProps> = ({ compliances }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Legal':
        return theme.palette.primary.main;
      case 'Policy':
        return theme.palette.secondary.main;
      case 'Safety':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Compliance Details</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Export" variant="outlined" clickable />
          <Chip label="Filter" variant="outlined" clickable />
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {compliances.map((compliance) => (
          <ComplianceListItem 
            key={compliance.id} 
            compliance={compliance} 
            getTypeColor={getTypeColor}
            isMobile={isMobile}
          />
        ))}
      </Stack>
    </Box>
  );
};

interface ComplianceListItemProps {
  compliance: ComplianceItem;
  getTypeColor: (type: string) => string;
  isMobile: boolean;
}

const ComplianceListItem: React.FC<ComplianceListItemProps> = ({ 
  compliance, 
  getTypeColor, 
  isMobile 
}) => {
  const theme = useTheme();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const lastAuditInfo = compliance.lastAudit 
    ? `Last audit: ${formatDate(compliance.lastAudit.performedAt)} by ${compliance.lastAudit.performedBy}`
    : 'No audit data';

  const complianceRate = compliance.complianceRate ?? 0;
  const rateSource = compliance.ratesDetail.rateSource;

  return (
    <Card variant="outlined" sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 2 } }}>
      <CardContent>
        {/* Header */}
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          justifyContent="space-between" 
          alignItems={isMobile ? 'flex-start' : 'flex-start'}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              {compliance.name}
            </Typography>
            <Chip 
              label={compliance.code} 
              size="small" 
              variant="outlined"
              sx={{ mr: 1 }}
            />
          </Box>
          <Chip 
            label={compliance.type}
            sx={{ 
              backgroundColor: getTypeColor(compliance.type),
              color: 'white',
              minWidth: 80
            }}
          />
        </Stack>

        {/* Stats */}
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={isMobile ? 1 : 3}
          sx={{ mb: 2 }}
        >
          <StatItem value={compliance.requirementCount} label="Requirements" />
          <StatItem value={compliance.taskStats.total} label="Total Tasks" />
          <StatItem value={compliance.taskStats.completed} label="Completed" />
          <StatItem value={compliance.taskStats.overdue} label="Overdue" />
        </Stack>

        {/* Compliance Rate */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="h6" color="primary">
            {compliance.complianceRate !== null ? `${compliance.complianceRate}%` : 'No data'}
          </Typography>
          {rateSource && rateSource !== 'none' && (
            <Chip 
              label={`Source: ${rateSource}`} 
              size="small" 
              variant="filled"
              color="default"
            />
          )}
        </Stack>

        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={complianceRate}
          sx={{ 
            height: 6, 
            borderRadius: 3,
            mb: 1,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
            }
          }}
        />

        {/* Last Audit Info */}
        <Typography variant="caption" color="text.secondary">
          {lastAuditInfo}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  value: number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
      <Typography variant="h6" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

export default ComplianceList;