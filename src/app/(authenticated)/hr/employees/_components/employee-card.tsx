import { Box, Chip, Avatar, Typography, IconButton, Tooltip, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const EmployeeCardBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  borderRadius: 20,
  boxShadow: `0 4px 20px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.08)`,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.section?.light || '#64b5f6'}15`,
  overflow: 'hidden',

  '&:hover': {
    boxShadow: `0 8px 32px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
    transform: 'translateY(-4px)',
    border: `1px solid ${theme.palette.section?.light || '#64b5f6'}30`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle, ${theme.palette.section?.light || '#64b5f6'}05 0%, transparent 70%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

export const StatusBadge = styled(Chip)(({ theme }) => ({
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
  '&.MuiChip-colorWarning': {
    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
    color: theme.palette.warning.contrastText,
  },
  '&.MuiChip-colorDefault': {
    background: `linear-gradient(135deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[300]} 100%)`,
    color: theme.palette.grey[800],
  },
}));

export const QuickActions = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 16,
  left: 16,
  display: "flex",
  gap: 4,
  zIndex: 2,
}));

export const EmployeeAvatar = styled(Avatar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
  boxShadow: `0 4px 16px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.25)`,
  border: `3px solid ${theme.palette.background.paper}`,
  fontWeight: 600,
  fontSize: '1.2rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 6px 20px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.35)`,
  },
}));

export const EmployeeName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  fontSize: '1.1rem',
}));

export const EmployeeInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
  boxShadow: `0 2px 8px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
  border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.section?.light || '#64b5f6'} 0%, ${theme.palette.section?.main || '#0b579f'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    transform: 'scale(1.1)',
    boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.25)`,
  },
}));

export const CardTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    background: `linear-gradient(135deg, ${theme.palette.section?.main || '#0b579f'} 0%, ${theme.palette.section?.light || '#64b5f6'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    borderRadius: 8,
    fontSize: '0.75rem',
    fontWeight: 500,
    boxShadow: `0 4px 12px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.25)`,
  },
})); 