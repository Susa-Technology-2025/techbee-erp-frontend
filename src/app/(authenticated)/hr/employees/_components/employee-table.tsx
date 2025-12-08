import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, Avatar, Typography, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
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
import { ConfirmDeleteDialog, ConfirmDeactivateDialog } from './confirm-dialogs';
import { SendMessageDialog } from './SendMessageDialog';
import { useTheme } from '@mui/material/styles';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  email: string;
  status: string;
  dateJoined: string;
  photoUrl?: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onActivate: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onQuickView: (employee: Employee) => void;
  onShowDetail: (employee: Employee) => void;
}

export function EmployeeTable({ employees, onView, onEdit, onDelete, onActivate, onDeactivate, onQuickView, onShowDetail }: EmployeeTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEmployeeId, setMenuEmployeeId] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const theme = useTheme();

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

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        overflowX: 'auto',
        background: theme.palette.background.paper,
        [theme.breakpoints.down('sm')]: {
          boxShadow: 0,
          borderRadius: 0,
        },
      }}
    >
      <Table sx={{ minWidth: 700, width: '100%' }}>
        <TableHead>
          <TableRow sx={{ background: theme.palette.grey[100] }}>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Employee Code</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} hover sx={{
              [theme.breakpoints.down('sm')]: {
                '& td': { py: 1, px: 1 },
              },
            }}>
              <TableCell>
                <Avatar
                  sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontSize: 18, cursor: 'pointer' }}
                  onClick={() => onShowDetail(employee)}
                >
                  {employee.photoUrl ? (
                    <img src={employee.photoUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    `${employee.firstName?.[0] || ''}${employee.lastName?.[0] || ''}`
                  )}
                </Avatar>
              </TableCell>
              <TableCell>
                <Typography
                  fontWeight={600}
                  sx={{ cursor: 'pointer', fontSize: { xs: 14, sm: 16 } }}
                  onClick={() => onShowDetail(employee)}
                >
                  {employee.firstName} {employee.lastName}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{employee.employeeCode}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{employee.email}</TableCell>
              <TableCell>
                <Typography
                  sx={{
                    color:
                      employee.status === 'active'
                        ? theme.palette.success.main
                        : employee.status === 'inactive'
                        ? theme.palette.text.secondary
                        : theme.palette.warning.main,
                    fontWeight: 500,
                    fontSize: { xs: 13, sm: 15 },
                  }}
                >
                  {employee.status}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onQuickView(employee)} title="Quick View" sx={{ bgcolor: 'white', boxShadow: 1, mr: 1, '&:hover': { bgcolor: 'grey.100' } }}>
                  <Visibility fontSize="small" color="primary" />
                </IconButton>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, employee.id)}>
                  <MoreVert fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={menuEmployeeId === employee.id}
                  onClose={handleMenuClose}
                  onClick={e => e.stopPropagation()}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      borderRadius: '12px',
                      minWidth: '220px',
                      py: 0.5,
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); onView(employee); }} dense sx={{ py: 1 }}>
                    <PersonAdd sx={{ mr: 1.5, fontSize: '20px' }} />
                    View Full Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenDialog('message', employee)} dense sx={{ py: 1 }}>
                    <ChatBubbleOutline sx={{ mr: 1.5, fontSize: '20px' }} />
                    Send Message
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenDialog('schedule')} dense sx={{ py: 1 }}>
                    <CalendarToday sx={{ mr: 1.5, fontSize: '20px' }} />
                    Schedule Activity
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenDialog('task')} dense sx={{ py: 1 }}>
                    <Task sx={{ mr: 1.5, fontSize: '20px' }} />
                    Assign Task
                  </MenuItem>
                  <Divider sx={{ my: '4px !important' }} />
                  <MenuItem onClick={() => handleOpenDialog('documents')} dense sx={{ py: 1 }}>
                    <AttachFile sx={{ mr: 1.5, fontSize: '20px' }} />
                    Documents
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenDialog('history')} dense sx={{ py: 1 }}>
                    <History sx={{ mr: 1.5, fontSize: '20px' }} />
                    View History
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenDialog('performance')} dense sx={{ py: 1 }}>
                    <StarOutline sx={{ mr: 1.5, fontSize: '20px' }} />
                    Performance
                  </MenuItem>
                  <Divider sx={{ my: '4px !important' }} />
                  <MenuItem onClick={() => handleOpenDialog('payroll')} dense sx={{ py: 1 }}>
                    <Receipt sx={{ mr: 1.5, fontSize: '20px' }} />
                    Payroll Info
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenDialog('reset')} dense sx={{ py: 1 }}>
                    <AssignmentTurnedIn sx={{ mr: 1.5, fontSize: '20px' }} />
                    Attendance
                  </MenuItem>
                  {employee.status === 'active' ? (
                    <MenuItem
                      onClick={() => handleOpenDialog('deactivate', employee)}
                      dense
                      sx={{
                        py: 1,
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'error.contrastText' },
                      }}
                    >
                      <ExitToApp sx={{ mr: 1.5, fontSize: '20px' }} />
                      Deactivate
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => onActivate(employee)}
                      dense
                      sx={{
                        py: 1,
                        color: 'success.main',
                        '&:hover': { backgroundColor: 'success.contrastText' },
                      }}
                    >
                      <PersonAdd sx={{ mr: 1.5, fontSize: '20px' }} />
                      Activate
                    </MenuItem>
                  )}
                  <Divider sx={{ my: '4px !important' }} />
                  <MenuItem
                    onClick={() => handleOpenDialog('delete', employee)}
                    dense
                    sx={{
                      py: 1,
                      color: 'error.main',
                      '&:hover': { backgroundColor: 'error.contrastText' },
                    }}
                  >
                    <DeleteOutline sx={{ mr: 1.5, fontSize: '20px' }} />
                    Delete
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDeleteDialog
        open={activeDialog === 'delete'}
        employee={selectedEmployee}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDeactivateDialog
        open={activeDialog === 'deactivate'}
        employee={selectedEmployee}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDeactivate}
      />
      <SendMessageDialog
        open={activeDialog === 'message'}
        employee={selectedEmployee}
        onClose={handleCloseDialog}
        onSend={async (msg) => { await new Promise(res => setTimeout(res, 800)); /* mock send */ }}
      />
    </TableContainer>
  );
} 