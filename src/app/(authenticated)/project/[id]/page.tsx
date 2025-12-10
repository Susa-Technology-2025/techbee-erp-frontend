'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  AlertTitle,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDataQuery } from '@/lib/tanstack/useDataQuery';

// Import the ProjectDetail component
import ProjectDetail from '../projects/_drag-and-drop/ProjectDetail';

// ========== PROJECT DETAIL PAGE ==========
export default function ProjectDetailPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: projectData, isLoading, isError, error, isFetching, isSuccess, } = useDataQuery({
    apiEndPoint: `https://project.api.techbee.et/api/projects/${projectId}`,
    enabled: !!projectId,

  });

  const handleBackToList = () => {
    router.push('/project'); // Or your projects list route
  };

  const handleProjectSelect = (project: any) => {
    router.push(`/projects/${project.id}`);
  };

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error?.message || 'Project not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }



  return (
    <ProjectDetail
      project={projectData}
      allProjects={[]} // Pass empty array since we don't need all projects for this view
      onBackToList={handleBackToList}
      onProjectSelect={handleProjectSelect}
    />
  );
}