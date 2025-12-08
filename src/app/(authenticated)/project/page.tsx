'use client';

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import PersonalDashboard from './personalDashboard/page';
import Dashboard from './_dashboard/dashBoard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

export default function DashboardPage() {
  const session = useSelector((state: RootState) => state.session);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);

  // Mock session - replace with your actual session

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const isAdmin = session?.permissions?.includes("super_admin");

  return (
    <Box sx={{
      bgcolor: theme.palette.background.paper,
      minHeight: '100vh',
      // backgroundImage: 'radial-gradient(#e0e7ff 1px, transparent 1px)',
      // backgroundSize: '20px 20px',
      width: "100%"
    }}>

      <Container maxWidth="100%">
        {/* Dashboard Tabs Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            // border: '1px solid',
            // borderColor: '#e2e8f0',
            // boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            mb: 4,
            // bgcolor: alpha(theme.palette.background.paper, 0.1),
          }}
        >
          {/* Tabs Header */}
          <Box sx={{
            bgcolor: theme.palette.background.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: '#e2e8f0',
            px: 3,
            py: 1
          }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#4361ee',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: theme.palette.primary.main,
                }
              }}
            >
              <Tab
                icon={<PersonOutlineIcon />}
                iconPosition="start"
                label="Personal Dashboard"
                {...a11yProps(0)}
                sx={{
                  mr: 2,
                  '& .MuiTab-iconWrapper': {
                    color: tabValue === 0 ? '#4361ee' : '#64748b',
                  }
                }}
              />
              {isAdmin && (
                <Tab
                  icon={<BusinessIcon />}
                  iconPosition="start"
                  label="Company Dashboard"
                  {...a11yProps(1)}
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      color: tabValue === 1 ? '#4361ee' : '#64748b',
                    }
                  }}
                />
              )}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{
            // bgcolor: theme.palette.background.paper,
            p: isMobile ? 2 : 4
          }}>
            <TabPanel value={tabValue} index={0}>
              <PersonalDashboard />
            </TabPanel>

            {isAdmin && (
              <TabPanel value={tabValue} index={1}>
                <Dashboard />
              </TabPanel>
            )}
          </Box>
        </Paper>

        {/* Role-based Message */}
        {!isAdmin && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid',
              borderColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <BusinessIcon color="disabled" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Administrator access required</strong> to view company-wide analytics and manage team resources.
              </Typography>
            </Box>
          </Paper>
        )}
      </Container>
    </Box >
  );
}