'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  ListAlt,
  TrendingUp,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ComplianceData } from '../types/dashboard';
import ComplianceList from './ComplianceList';

interface ComplianceDashboardProps {
  data: ComplianceData;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [timePeriod, setTimePeriod] = React.useState('last30');
  const [department, setDepartment] = React.useState('all');

  const handleTimePeriodChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setDepartment(event.target.value);
  };

  // Prepare data for Compliance by Type Pie Chart
  const complianceByTypeData = Object.entries(data.byType).map(([name, value]) => ({
    name,
    value,
  }));

  const COMPLIANCE_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
  ];

  // Prepare data for Task Status
  const taskStatsData = [
    { name: 'Completed', value: data.taskStats.completed, fill: theme.palette.success.main },
    { name: 'Pending', value: data.taskStats.pending, fill: theme.palette.warning.main },
    { name: 'Overdue', value: data.taskStats.overdue, fill: theme.palette.error.main },
  ].filter(item => item.value > 0);

  // If no tasks, show a placeholder
  const displayTaskData = taskStatsData.length > 0 ? taskStatsData : [
    { name: 'No Tasks', value: 1, fill: theme.palette.grey[500] }
  ];

  // Prepare trend data for compliance items that have trend data
  const trendData = data.compliances
    .filter(compliance => compliance.trend && compliance.trend.length > 0)
    .flatMap(compliance => 
      compliance.trend.map(trendItem => ({
        name: compliance.code,
        date: new Date(trendItem.performedAt).toLocaleDateString(),
        complianceRate: trendItem.complianceRate,
        result: trendItem.result,
      }))
    );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1 }}>
          <Typography variant="body2">{`${label}`}</Typography>
          <Typography variant="body2" color={payload[0].fill}>
            {`${payload[0].name}: ${payload[0].value}`}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3, position: 'relative',maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
        spacing={2}
        sx={{ mb: 4, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Box>
          <Typography sx={{color: 'white'}} variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Compliance Dashboard
          </Typography>
          <Typography sx={{color: 'white'}} variant="body2" color="text.secondary">
            Monitor compliance status across your organization
          </Typography>
        </Box>
        {/* <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={timePeriod}
              onChange={handleTimePeriodChange}
              displayEmpty
            >
              <MenuItem value="last7">Last 7 Days</MenuItem>
              <MenuItem value="last30">Last 30 Days</MenuItem>
              <MenuItem value="last90">Last 90 Days</MenuItem>
              <MenuItem value="ytd">Year to Date</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={department}
              onChange={handleDepartmentChange}
              displayEmpty
            >
              <MenuItem value="all">All Departments</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              <MenuItem value="operations">Operations</MenuItem>
            </Select>
          </FormControl>
        </Stack> */}
      </Stack>

      {/* Stats Cards */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={3}
        sx={{ mb: 4 }}
        useFlexGap
        flexWrap="wrap"
      >
        <StatCard
          title="Overall Compliance Rate"
          value={`${data.overallComplianceRate}%`}
          description="Across all compliance types"
          icon={<TrendingUp />}
          color={theme.palette.primary.main}
          isMobile={isMobile}
        />
        <StatCard
          title="Total Compliances"
          value={data.totalCompliances.toString()}
          description="Active compliance requirements"
          icon={<ListAlt />}
          color={theme.palette.secondary.main}
          isMobile={isMobile}
        />
        <StatCard
          title="Completed Tasks"
          value={data.taskStats.completed.toString()}
          description={`Out of ${data.taskStats.total} total tasks`}
          icon={<CheckCircle />}
          color={theme.palette.success.main}
          isMobile={isMobile}
        />
        <StatCard
          title="Overdue Tasks"
          value={data.taskStats.overdue.toString()}
          description="Requiring immediate attention"
          icon={<Warning />}
          color={theme.palette.error.main}
          isMobile={isMobile}
        />
      </Stack>

      {/* Charts */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={3}
        sx={{ mb: 4 }}
      >
        {/* Compliance by Type Pie Chart */}
        <Card sx={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compliance by Type
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {complianceByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COMPLIANCE_COLORS[index % COMPLIANCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card sx={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Task Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayTaskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {displayTaskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Trend Chart for Compliance Rates */}
      {trendData.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compliance Rate Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="complianceRate" name="Compliance Rate %" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Compliance List */}
      <Card>
        <CardContent>
          <ComplianceList compliances={data.compliances} />
        </CardContent>
      </Card>
    </Box>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isMobile: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, color, isMobile }) => {
  return (
    <Card sx={{ 
      flex: 1, 
      minWidth: isMobile ? '100%' : 200,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      }
    }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ComplianceDashboard;