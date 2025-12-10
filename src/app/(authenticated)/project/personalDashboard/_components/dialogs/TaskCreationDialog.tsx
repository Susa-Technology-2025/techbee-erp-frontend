// 'use client';

// import React from 'react';
// import {
//     Dialog,
//     DialogContent,
//     AppBar,
//     Toolbar,
//     Typography,
//     IconButton,
//     useTheme,
//     alpha
// } from '@mui/material';
// import Close from '@mui/icons-material/Close';
// import TaskCreationDialogForm from './taskDialog'; // Assuming this is your existing task form

// interface TaskCreationDialogProps {
//     open: boolean;
//     onClose: () => void;
//     onSuccess?: (task: any) => void;
//     formMode?: 'create' | 'edit';
//     initialData?: any;
// }

// const TaskCreationDialog: React.FC<TaskCreationDialogProps> = ({
//     open,
//     onClose,
//     onSuccess,
//     formMode = 'create',
//     initialData
// }) => {
//     const theme = useTheme();

//     const handleTaskCreated = (task: any) => {
//         onSuccess?.(task);
//         onClose();
//     };

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth="md"
//             fullWidth
//             PaperProps={{
//                 sx: {
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     backdropFilter: "blur(20px)",
//                     background: alpha(theme.palette.background.paper, 0.9),
//                 },
//             }}
//         >
//             <AppBar
//                 position="static"
//                 elevation={0}
//                 sx={{
//                     bgcolor: "section.main",
//                     borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                 }}
//             >
//                 <Toolbar>
//                     <Typography
//                         variant="h6"
//                         component="div"
//                         sx={{ flexGrow: 1, fontWeight: 600 }}
//                     >
//                         {formMode === 'edit' ? 'Edit Task' : 'Create New Task'}
//                     </Typography>
//                     <IconButton
//                         edge="end"
//                         onClick={onClose}
//                         aria-label="close"
//                         sx={{ color: "text.secondary" }}
//                     >
//                         <Close />
//                     </IconButton>
//                 </Toolbar>
//             </AppBar>
//             <DialogContent sx={{ p: 0 }}>
//                 <TaskCreationDialogForm
//                     formMode={formMode}
//                     onSuccess={handleTaskCreated}
//                     initialData={initialData}
//                 />
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default TaskCreationDialog;