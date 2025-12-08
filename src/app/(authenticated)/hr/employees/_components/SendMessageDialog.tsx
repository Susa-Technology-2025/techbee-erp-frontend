import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { EmployeeChatSidebar } from './EmployeeChatSidebar';

interface SendMessageDialogProps {
  open: boolean;
  employee: { firstName?: string; lastName?: string; email?: string } | null;
  onClose: () => void;
  onSend: (message: string) => Promise<void> | void;
}
export const SendMessageDialog: React.FC<SendMessageDialogProps> = ({ open, employee, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatEmployee, setChatEmployee] = useState<typeof employee | null>(null);

  const handleSend = async () => {
    setSending(true);
    setError(null);
    try {
      await onSend(message);
      setSuccess(true);
      setMessage('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (e) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            To: <b>{employee?.firstName} {employee?.lastName}</b> {employee?.email && (<span style={{ color: '#888', fontSize: 14 }}>({employee.email})</span>)}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Message"
            type="text"
            fullWidth
            multiline
            minRows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={sending || success}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          {success && <Alert severity="success">Message sent!</Alert>}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button
            onClick={() => {
              setChatEmployee(employee);
              setChatOpen(true);
              handleClose();
            }}
            color="secondary"
            variant="text"
          >
            Chat History
          </Button>
          <Box>
            <Button onClick={handleClose} disabled={sending || success} variant="outlined" sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={handleSend} disabled={!message.trim() || sending || success} variant="contained" color="primary" startIcon={sending ? <CircularProgress size={18} /> : undefined}>
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <EmployeeChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} employee={chatEmployee} />
    </>
  );
}; 