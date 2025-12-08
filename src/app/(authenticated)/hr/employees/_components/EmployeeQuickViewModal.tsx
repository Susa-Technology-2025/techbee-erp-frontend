import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Typography, Box, IconButton, Button, Divider, styled, useTheme, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { EmployeeAvatar } from './employee-card';
import { EmployeeDetailBar } from './EmployeeDetailBar';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
    boxShadow: `0 8px 32px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
    border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.backgroundSection?.main || '#f0f7ff'} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  borderBottom: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  padding: theme.spacing(3),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.backgroundSection?.main || '#f0f7ff'} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  borderTop: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  padding: theme.spacing(2, 3),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  borderRadius: 10,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.section?.light || '#64b5f6'} 0%, ${theme.palette.section?.main || '#0b579f'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    transform: 'scale(1.05)',
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
  '&.outlined': {
    border: `2px solid ${theme.palette.section?.main || '#0b579f'}`,
    color: theme.palette.section?.main || '#0b579f',
    background: 'transparent',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
      color: theme.palette.section?.contrastText || '#ffffff',
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.25)`,
    },
  },
  '&.contained': {
    background: `linear-gradient(135deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.25)`,
    '&:hover': {
      boxShadow: `0 6px 16px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.35)`,
      transform: 'translateY(-1px)',
    },
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 11,
  height: 24,
  borderRadius: 12,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  boxShadow: `0 2px 8px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
  '&.MuiChip-colorSuccess': {
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
    color: theme.palette.success.contrastText,
  },
  '&.MuiChip-colorDefault': {
    background: `linear-gradient(135deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[300]} 100%)`,
    color: theme.palette.grey[800],
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 10,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  border: `1px solid ${theme.palette.section?.light || '#64b5f6'}15`,
  transition: 'all 0.2s ease',
  '&:hover': {
    border: `1px solid ${theme.palette.section?.light || '#64b5f6'}30`,
    boxShadow: `0 2px 8px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.1)`,
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.section?.main || '#0b579f',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.875rem',
}));

interface EmployeeQuickViewModalProps {
  open: boolean;
  onClose: () => void;
  employee: any | null;
  onViewFullProfile?: (employee: any) => void;
}

export const EmployeeQuickViewModal: React.FC<EmployeeQuickViewModalProps> = ({
  open,
  onClose,
  employee,
  onViewFullProfile,
}) => {
  const theme = useTheme();
  
  if (!employee) return null;

  const handleViewFullProfile = () => {
    onClose();
  };

  const handleCloseDetailBar = () => {
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <StyledDialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 0 }}>
          <EmployeeAvatar
            src={employee.avatarUrl || ''}
            alt={employee.firstName + ' ' + employee.lastName}
            sx={{ 
              width: 72, 
              height: 72, 
              mr: 2, 
              fontSize: 28,
              background: `linear-gradient(135deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
            }}
          >
            {employee.firstName?.[0]}{employee.lastName?.[0]}
          </EmployeeAvatar>
          <Box flex={1}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              gutterBottom
              sx={{ color: theme.palette.section?.main || '#0b579f' }}
            >
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {employee.jobTitle} {employee.grade ? `| ${employee.grade}` : ''}
            </Typography>
            <StatusChip
              label={employee.isActive ? 'Active' : 'Inactive'}
              color={employee.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>
          <CloseButton onClick={onClose} size="small">
            <CloseIcon />
          </CloseButton>
        </StyledDialogTitle>
        
        <StyledDialogContent sx={{ pt: 2 }}>
          <Divider sx={{ mb: 3, borderColor: `${theme.palette.section?.light || '#64b5f6'}30` }} />
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <InfoItem>
              <InfoLabel>Employee Code</InfoLabel>
              <InfoValue>{employee.employeeCode}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{employee.phoneNumber || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{employee.email || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Hire Date</InfoLabel>
              <InfoValue>
                {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '-'}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Gender</InfoLabel>
              <InfoValue>{employee.gender || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Marital Status</InfoLabel>
              <InfoValue>{employee.maritalStatus || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Organization Node</InfoLabel>
              <InfoValue>{employee.organizationNodeId || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Department</InfoLabel>
              <InfoValue>{employee.department || '-'}</InfoValue>
            </InfoItem>
          </Box>
        </StyledDialogContent>
        
        <StyledDialogActions sx={{ justifyContent: 'space-between' }}>
          {/* {onViewFullProfile && (
            <ActionButton
              className="outlined"
              startIcon={<VisibilityIcon />}
              onClick={handleViewFullProfile}
            >
              View Full Profile
            </ActionButton>
          )} */}
          <ActionButton 
            className="contained"
            onClick={onClose}
          >
            Close
          </ActionButton>
        </StyledDialogActions>
      </StyledDialog>

    </>
  );
}; 