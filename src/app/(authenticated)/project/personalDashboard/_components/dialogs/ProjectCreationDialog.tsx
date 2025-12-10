'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import ProjectCreateInputForm from '../../../projects/_components/Form'; // Your existing project form

interface ProjectCreationDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (project: any) => void;
    formMode?: 'create' | 'edit';
    initialData?: any;
}

const ProjectCreationDialog: React.FC<ProjectCreationDialogProps> = ({
    open,
    onClose,
    onSuccess,
    formMode = 'create',
    initialData
}) => {
    const theme = useTheme();

    const handleProjectCreated = (project: any) => {
        onSuccess?.(project);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden",
                    backdropFilter: "blur(20px)",
                    background: alpha(theme.palette.background.paper, 0.9),
                },
            }}
        >
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: "section.main",
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 600 }}
                    >
                        {formMode === 'edit' ? 'Edit Project' : 'Create New Project'}
                    </Typography>
                    <IconButton
                        edge="end"
                        onClick={onClose}
                        aria-label="close"
                        sx={{ color: "text.secondary" }}
                    >
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{ p: 0 }}>
                <ProjectCreateInputForm 
                    formMode={formMode}
                    // onSuccess={handleProjectCreated}
                    // initialData={initialData}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ProjectCreationDialog;