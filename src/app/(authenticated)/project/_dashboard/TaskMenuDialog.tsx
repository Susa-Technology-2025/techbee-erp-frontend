'use client';

import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    alpha,
    CircularProgress
} from '@mui/material';
import {
    Edit,
    Delete,
    Close,
    Warning,
    MoreVert
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useDataMutation } from '@/lib/tanstack/useDataQuery';
import { toast } from 'react-hot-toast';

interface TaskMenuDialogProps {
    task: any;
    colors: {
        primary: string;
        success: string;
        warning: string;
        error: string;
        info: string;
        purple: string;
        pink: string;
        teal: string;
        indigo: string;
        orange: string;
        gray: string;
    };
    refetch: () => void;
    apiUrl: string;
    formatCurrency?: (amount: number | null) => string;
    TaskCreateInputForm: React.ComponentType<{
        formMode: 'create' | 'edit';
        defaultValues: any;
        invalidateQueryKey: string[];
    }>;
}

export default function TaskMenuDialog({
    task,
    colors,
    refetch,
    apiUrl,
    formatCurrency,
    TaskCreateInputForm
}: TaskMenuDialogProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const deleteMutation = useDataMutation({
        apiEndPoint: `${apiUrl}/:id`,
        method: 'DELETE',
        invalidateQueryKey: ["dashboardData", apiUrl],
        onSuccess: (data) => {
            toast.success('Task deleted successfully');
            handleDeleteDialogClose();
            refetch();
        },
        onError: (error: any) => {
            toast.error(`Failed to delete task: ${error.message || 'Unknown error'}`);
        }
    });

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleMenuClose();
        setOpenEditDialog(true);
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        setOpenDeleteDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = () => {
        if (task?.id) {
            deleteMutation.mutate({
                __pathParams: { id: task.id }
            });
        }
    };

    return (
        <>
            {/* Menu Button */}
            <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                    '&:hover': {
                        bgcolor: alpha(theme.palette.action.hover, 0.1)
                    }
                }}
            >
                <MoreVert fontSize="small" />
            </IconButton>

            {/* Menu Dropdown */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <MenuItem onClick={handleEditClick}>
                    <Edit fontSize="small" sx={{ mr: 1, color: colors.primary }} />
                    <Typography variant="body2">Edit Task</Typography>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <Delete fontSize="small" sx={{ mr: 1, color: colors.error }} />
                    <Typography variant="body2" sx={{ color: colors.error }}>
                        Delete Task
                    </Typography>
                </MenuItem>
            </Menu>

            {/* Edit Task Dialog */}
            <Dialog
                open={openEditDialog}
                onClose={handleEditDialogClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '90vh',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: alpha(colors.primary, 0.05),
                    borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pr: 2,
                    py: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            bgcolor: alpha(colors.primary, 0.1)
                        }}>
                            <Edit sx={{ color: colors.primary }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Edit Task
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 500 }}>
                                {task?.code} - {task?.title}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={handleEditDialogClose}
                        size="small"
                        sx={{
                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.action.hover, 0.1),
                                borderColor: theme.palette.divider
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {task && (
                        <TaskCreateInputForm
                            formMode="edit"
                            defaultValues={task}
                            invalidateQueryKey={["dashboardData", apiUrl]}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    bgcolor: alpha(colors.error, 0.05),
                    borderBottom: `1px solid ${alpha(colors.error, 0.1)}`
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.error }}>
                        Delete Task
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Warning sx={{ color: colors.error, mr: 2 }} />
                        <Typography variant="body1">
                            Are you sure you want to delete this task?
                        </Typography>
                    </Box>
                    <Box sx={{
                        p: 2,
                        bgcolor: alpha(colors.error, 0.05),
                        borderRadius: 2,
                        border: `1px solid ${alpha(colors.error, 0.1)}`
                    }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {task?.code} - {task?.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.gray }}>
                            Project: {task?.projectTitle || 'N/A'}
                        </Typography>
                        {task?.plannedHours && (
                            <Typography variant="body2" sx={{ color: colors.gray }}>
                                Planned Hours: {task.plannedHours}
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.error, display: 'block', mt: 2 }}>
                        This action cannot be undone. All task data will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(colors.error, 0.1)}` }}>
                    <Button
                        onClick={handleDeleteDialogClose}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2 }}
                        startIcon={deleteMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Delete />}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Task'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}