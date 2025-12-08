import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTheme } from '@mui/material/styles';
import { EmployeeDetailBar } from './EmployeeDetailBar';

interface Message {
  id: string;
  sender: 'me' | 'employee';
  text: string;
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface EmployeeChatSidebarProps {
  open: boolean;
  onClose: () => void;
  employee: { firstName?: string; lastName?: string; email?: string; photoUrl?: string } | null;
}

const mockHistory: Message[] = [
  {
    id: '1',
    sender: 'employee',
    text: 'Hello, I have a question about my payslip.',
    timestamp: '2024-06-01 09:15',
  },
  {
    id: '2',
    sender: 'me',
    text: 'Sure! What would you like to know?',
    timestamp: '2024-06-01 09:16',
  },
  {
    id: '3',
    sender: 'employee',
    text: 'There is a deduction I do not recognize.',
    timestamp: '2024-06-01 09:17',
  },
];

function renderMessageText(text: string) {
  // Auto-link URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', wordBreak: 'break-all' }}>{part}</a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// Helper to render links with dynamic color
function renderMessageTextWithContrast(text: string, linkColor: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, wordBreak: 'break-all' }}>{part}</a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export const EmployeeChatSidebar: React.FC<EmployeeChatSidebarProps> = ({ open, onClose, employee }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(mockHistory);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [detailBarOpen, setDetailBarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [open, messages]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    setSending(true);
    let fileUrl, fileName, fileType;
    if (file) {
      fileUrl = URL.createObjectURL(file);
      fileName = file.name;
      fileType = file.type;
    }
    const newMsg: Message = {
      id: (messages.length + 1).toString(),
      sender: 'me',
      text: input,
      timestamp: new Date().toLocaleString(),
      fileUrl,
      fileName,
      fileType,
    };
    setTimeout(() => {
      setMessages([...messages, newMsg]);
      setInput('');
      setFile(null);
      setFilePreview(null);
      setSending(false);
    }, 600);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(f));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };
  const name = employee?.firstName + ' ' + employee?.lastName;
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, boxShadow: 6, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, display: 'flex', flexDirection: 'column' } }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f7fafd' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', flex: 1 }}
          onClick={() => setDetailBarOpen(true)}
        >
          <Avatar
            src={employee?.photoUrl}
            sx={{ width: 36, height: 36, bgcolor: '#2196f3', color: '#fff', fontSize: 18 }}
          >
            {!employee?.photoUrl && `${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Chat With <span style={{ fontWeight: 800 }}>{employee?.firstName} {employee?.lastName}</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employee?.email}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2, bgcolor: '#f9fbfd' }}>
        <List disablePadding>
          {messages.map((msg) => (
            <ListItem key={msg.id} sx={{ justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', textWrap: 'wrap' }}>
              {msg.sender === 'employee' && (
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#2196f3', color: '#fff', width: 32, height: 32 }} src={employee?.photoUrl}>
                    {!employee?.photoUrl && `${employee?.firstName?.[0] || ''}${employee?.lastName?.[0] || ''}`}
                  </Avatar>
                </ListItemAvatar>
              )}
              <Box
                sx={{
                  bgcolor: msg.sender === 'me' ? 'primary.main' : 'grey.200',
                  color: msg.sender === 'me' ? 'primary.contrastText' : 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: 240,
                  boxShadow: 1,
                  ml: msg.sender === 'me' ? 2 : 0,
                  mr: msg.sender === 'me' ? 0 : 2,
                  position: 'relative',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  overflowWrap: 'anywhere',
                }}
              >
                {msg.fileUrl && msg.fileType?.startsWith('image/') && (
                  <Box sx={{ mb: 1 }}>
                    <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8 }} />
                  </Box>
                )}
                {msg.fileUrl && !msg.fileType?.startsWith('image/') && (
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsertDriveFileIcon sx={{ color: msg.sender === 'me' ? theme.palette.primary.contrastText : '#1976d2', fontSize: 20 }} />
                    <a
                      href={msg.fileUrl}
                      download={msg.fileName}
                      style={{
                        color: msg.sender === 'me' ? theme.palette.primary.contrastText : '#1976d2',
                        textDecoration: 'underline',
                        wordBreak: 'break-all',
                      }}
                    >
                      {msg.fileName}
                    </a>
                  </Box>
                )}
                <Typography variant="body2">
                  {/* Render links with correct contrast */}
                  {renderMessageTextWithContrast(msg.text, msg.sender === 'me' ? theme.palette.primary.contrastText : '#1976d2')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={chatEndRef} />
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'column' }}>
        {file && (
          <Box sx={{ width: '100%', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {filePreview ? (
              <img src={filePreview} alt="preview" style={{ maxWidth: 60, maxHeight: 40, borderRadius: 4 }} />
            ) : (
              <Typography variant="body2">{file.name}</Typography>
            )}
            <Button size="small" onClick={handleRemoveFile} color="error">Remove</Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 1 }}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            fullWidth
            size="small"
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={sending}
            sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton component="label" disabled={sending}>
                    <AttachFileIcon />
                    <input type="file" hidden onChange={handleFileChange} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button onClick={handleSend} disabled={(!input.trim() && !file) || sending} variant="contained" color="primary" sx={{ minWidth: 80 }}>
            {sending ? <CircularProgress size={18} /> : 'Send'}
          </Button>
        </Box>
      </Box>
      <EmployeeDetailBar open={detailBarOpen} onClose={() => setDetailBarOpen(false)} employee={employee} />
    </Drawer>
  );
}; 