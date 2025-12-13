import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
            <DialogTitle sx={{
                color: '#4361ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pr: 2
            }}>
                Create New Task
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ ml: 2 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <WbsItemCreateInput
                    formMode="create"
                    defaultValues={{}}
                    onSuccess={handleSuccess}
                />
            </DialogContent>
        </Dialog>
    );
}