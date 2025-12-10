// components/TaskCreationDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import WbsItemCreateInput from '../../../wbsItems/_components/Form';

interface TaskCreationDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (task: any) => void;
}

export default function TaskCreationDialog({ open, onClose, onSuccess }: TaskCreationDialogProps) {
    const handleSuccess = (task: any) => {
        if (onSuccess) onSuccess(task);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ color: '#4361ee', bgcolor: '#f8fafc' }}>
                Create New Task
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <WbsItemCreateInput
                    formMode="create"
                    defaultValues={{}}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}