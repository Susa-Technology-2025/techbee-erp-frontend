import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Tooltip, ListItemIcon, ListItemText, styled, useTheme } from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Block, CheckCircle } from '@mui/icons-material';
import { 
  EmployeeCardBox, 
  StatusBadge, 
  QuickActions, 
  EmployeeAvatar, 
  EmployeeName, 
  EmployeeInfo, 
  ActionButton, 
  CardTooltip 
} from './employee-card';
import React, { useState } from 'react';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Task from '@mui/icons-material/Task';
import AttachFile from '@mui/icons-material/AttachFile';
import History from '@mui/icons-material/History';
import StarOutline from '@mui/icons-material/StarOutline';
import Receipt from '@mui/icons-material/Receipt';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import ExitToApp from '@mui/icons-material/ExitToApp';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { ConfirmDeleteDialog, ConfirmDeactivateDialog } from './confirm-dialogs';
import { SendMessageDialog } from './SendMessageDialog';
import { AddEmployeeModal } from './AddEmployeeModal';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3), // default, always defined
  marginBottom: theme.spacing(20),
  padding: theme.spacing(1),
  overflowY: 'auto',
  scrollbarWidth: 'none',

}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 16,
    padding: theme.spacing(0.5),
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.backgroundSection?.light || '#e1efff'} 100%)`,
    boxShadow: `0 8px 32px rgba(${theme.palette.section?.main || '#11, 87, 159'}, 0.15)`,
    border: `1px solid ${theme.palette.section?.light || '#64b5f6'}20`,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 8,
  margin: theme.spacing(0.25),
  padding: theme.spacing(1, 1.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.section?.light || '#64b5f6'} 0%, ${theme.palette.section?.main || '#0b579f'} 100%)`,
    color: theme.palette.section?.contrastText || '#ffffff',
    transform: 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: 36,
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderColor: `${theme.palette.section?.light || '#64b5f6'}30`,
}));

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  email: string;
  status: string;
  hireDate: string;
  photoUrl?: string;
  isActive: boolean;
}

interface EmployeeGridProps {
  employees: Employee[];
  cardSize: 'small' | 'medium' | 'large';
  cardSizeStyles: any;
  cardGap: number;
  minCardWidth: number;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onActivate: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onQuickView: (employee: Employee) => void;
  onShowDetail: (employee: Employee) => void;
  // Selection props
  showCheckboxes: boolean;
  selectedEmployees: string[];
  onCardSelect: (employeeId: string) => void;
  onCardRightClick: (e: React.MouseEvent, employeeId: string) => void;
  onCardDoubleClick: (e: React.MouseEvent, employeeId: string) => void;
}

export function EmployeeGrid({
  employees,
  cardSize,
  cardSizeStyles,
  cardGap,
  minCardWidth,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onQuickView,
  onShowDetail,
  showCheckboxes,
  selectedEmployees,
  onCardSelect,
  onCardRightClick,
  onCardDoubleClick,
}: EmployeeGridProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEmployeeId, setMenuEmployeeId] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  // Selection state
  // const [showCheckboxes, setShowCheckboxes] = useState(false);
  // const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // const handleCardSelect = (employeeId: string) => {
  //   setSelectedEmployees((prev) =>
  //     prev.includes(employeeId)
  //       ? prev.filter((id) => id !== employeeId)
  //       : [...prev, employeeId]
  //   );
  // };
  // const handleCardRightClick = (e: React.MouseEvent, employeeId: string) => {
  //   e.preventDefault();
  //   setShowCheckboxes(true);
  //   handleCardSelect(employeeId);
  // };
  // const handleCardDoubleClick = (e: React.MouseEvent, employeeId: string) => {
  //   if (!showCheckboxes) return;
  //   e.preventDefault();
  //   setShowCheckboxes(true);
  //   handleCardSelect(employeeId);
  // };
  // const handleSelectAll = (checked: boolean) => {
  //   setSelectedEmployees(checked ? employees.map(e => e.id) : []);
  // };
  // const allSelected = employees.length > 0 && selectedEmployees.length === employees.length;
  // const someSelected = selectedEmployees.length > 0 && selectedEmployees.length < employees.length;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setMenuEmployeeId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEmployeeId(null);
  };

  const handleOpenDialog = (type: string, employee?: Employee) => {
    setActiveDialog(type);
    setSelectedEmployee(employee || null);
    handleMenuClose();
  };
  const handleCloseDialog = () => {
    setActiveDialog(null);
    setSelectedEmployee(null);
  };
  const handleConfirmDelete = () => {
    if (selectedEmployee) onDelete(selectedEmployee);
    handleCloseDialog();
  };
  const handleConfirmDeactivate = () => {
    if (selectedEmployee) onDeactivate(selectedEmployee);
    handleCloseDialog();
  };

  const handleSendMessage = async (message: string) => {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    console.log('Sending message to employee:', selectedEmployee?.firstName, 'Message:', message);
    // Here you would typically make an API call to send the message
    // await sendMessageToEmployee(selectedEmployee?.id, message);
  };

  return (
    <GridContainer
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`,
        position: 'relative',
      }}
    >

      {employees.map((employee) => (
        <EmployeeCardBox
          key={employee.id}
          sx={{
            width: cardSizeStyles[cardSize].card.width,
            minHeight: cardSizeStyles[cardSize].card.minHeight,
            p: cardSizeStyles[cardSize].card.padding,
            position: 'relative',
            cursor: showCheckboxes ? 'pointer' : 'default',
          }}
          onClick={() => !showCheckboxes && onShowDetail(employee)}
          onContextMenu={e => onCardRightClick(e, employee.id)}
          onDoubleClick={e => onCardDoubleClick(e, employee.id)}
        >
          {/* Status and Quick View + Edit Icon */}
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            gap: 1, 
            zIndex: 2 
          }}>
            <StatusBadge
              label={employee.isActive ? 'Active' : 'Inactive'}
              color={employee.isActive ? 'success' : 'default'}
              size="small"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>

              {/* Other quick actions (quick view, edit, delete) */}
              <CardTooltip title="Quick View">
                <ActionButton 
                  size="small" 
                  onClick={e => { e.stopPropagation(); onQuickView(employee); }}
                >
                  <Visibility fontSize="small" />
                </ActionButton>
              </CardTooltip>
              <CardTooltip title="Edit Employee">
                <ActionButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    setEditingEmployee(employee);
                    setEditModalOpen(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </ActionButton>
              </CardTooltip>
              {/* <CardTooltip title="Delete Employee">
                <ActionButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenDialog('delete', employee);
                  }}
                >
                  <Delete fontSize="small" />
                </ActionButton>
              </CardTooltip> */}
            </Box>
          </Box>

          {/* Menu Actions */}
          <QuickActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <ActionButton
              size="small"
              sx={{ borderRadius: '50%', minWidth: 36, minHeight: 36, width: 36, height: 36 }}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); handleMenuOpen(e, employee.id); }}
            >
              <MoreVert fontSize="small" />
            </ActionButton>
            {showCheckboxes && selectedEmployees.length > 0 && (
              <Checkbox
                checked={selectedEmployees.includes(employee.id)}
                onChange={() => onCardSelect(employee.id)}
              />
            )}
            <StyledMenu
              anchorEl={anchorEl}
              open={menuEmployeeId === employee.id}
              onClose={handleMenuClose}
              onClick={e => e.stopPropagation()}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <StyledMenuItem onClick={() => { handleMenuClose(); onQuickView(employee); }}>
                <ListItemIcon>
                  <Visibility fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Quick View" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOpenDialog('message', employee)}>
                <ListItemIcon>
                  <ChatBubbleOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Send Message" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOpenDialog('schedule')}>
                <ListItemIcon>
                  <CalendarToday fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Schedule Activity" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOpenDialog('task')}>
                <ListItemIcon>
                  <Task fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Assign Task" />
              </StyledMenuItem>
              <StyledDivider />
              <StyledMenuItem onClick={() => handleOpenDialog('documents')}>
                <ListItemIcon>
                  <AttachFile fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Documents" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOpenDialog('history')}>
                <ListItemIcon>
                  <History fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="View History" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOpenDialog('performance')}>
                <ListItemIcon>
                  <StarOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Performance" />
              </StyledMenuItem>
              <StyledDivider />
              <StyledMenuItem onClick={() => handleOpenDialog('payroll')}>
                <ListItemIcon>
                  <Receipt fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Payroll Info" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => handleOpenDialog('reset')}>
                <ListItemIcon>
                  <AssignmentTurnedIn fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Attendance" />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => onActivate({ ...employee, isActive: !employee.isActive })}>
                <ListItemIcon>
                  {employee.isActive ? 
                    <Block color="error" fontSize="small" /> : 
                    <CheckCircle color="success" fontSize="small" />
                  }
                </ListItemIcon>
                <ListItemText primary={employee.isActive ? 'Deactivate' : 'Activate'} />
              </StyledMenuItem>
            {/* <StyledMenuItem
                onClick={() => handleOpenDialog('delete', employee)}
                sx={{
                  color: 'error.main',
                  '&:hover': { 
                    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                    color: theme.palette.error.contrastText,
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete Employee" />
              </StyledMenuItem> */}
            </StyledMenu>
          </QuickActions>

          {/* Employee Avatar */}
          <EmployeeAvatar
            sx={{
              width: cardSizeStyles[cardSize].avatar.width,
              height: cardSizeStyles[cardSize].avatar.height,
              fontSize: cardSizeStyles[cardSize].avatar.fontSize,
              mb: 2,
            }}
          >
            {employee.firstName?.charAt(0)?.toUpperCase()}{employee.lastName?.charAt(0)?.toUpperCase()}
          </EmployeeAvatar>

          {/* Employee Info */}
          <EmployeeName variant="h6">
            {employee.firstName} {employee.lastName}
          </EmployeeName>
          <EmployeeInfo variant="body2" gutterBottom>
            {employee.employeeCode}
          </EmployeeInfo>
          <EmployeeInfo variant="body2" color="text.secondary">
            {employee.email}
          </EmployeeInfo>
          <EmployeeInfo variant="caption" color="text.secondary">
            Joined: {dayjs(employee.hireDate).isValid() ? dayjs(employee.hireDate).format('MMM D, YYYY') : 'N/A'}
          </EmployeeInfo>
        </EmployeeCardBox>
      ))}

      {/* Dialogs */}
      <ConfirmDeleteDialog
        open={activeDialog === 'delete'}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        employee={selectedEmployee}
      />
      <ConfirmDeactivateDialog
        open={activeDialog === 'deactivate'}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDeactivate}
        employee={selectedEmployee}
      />
      <SendMessageDialog
        open={activeDialog === 'message'}
        onClose={handleCloseDialog}
        employee={selectedEmployee}
        onSend={handleSendMessage}
      />
      <AddEmployeeModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => { setEditModalOpen(false); setEditingEmployee(null); }}
        mode="edit"
        employee={editingEmployee || undefined}
      />
    </GridContainer>
  );
} 