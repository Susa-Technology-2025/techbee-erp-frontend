"use client"
import { useState } from "react";
import { Box, Typography, IconButton, Badge, Modal, Stack, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";


const mockNotifications = [
  {
    id: 1,
    title: "System Update Scheduled",
    message: "There will be a system maintenance on Friday at 10:00 PM",
    time: "2 hours ago",
    type: "info",
    read: false
  },
  {
    id: 2,
    title: "New Message Received",
    message: "You have a new message from the support team",
    time: "5 hours ago",
    type: "info",
    read: false
  },
  {
    id: 3,
    title: "Meeting Reminder",
    message: "Team meeting starts in 30 minutes",
    time: "1 day ago",
    type: "event",
    read: true
  },
  {
    id: 4,
    title: "Action Required",
    message: "Please update your profile information",
    time: "2 days ago",
    type: "warning",
    read: true
  }
];

export const NotificationModal =({ open, onClose }: { open: boolean; onClose: () => void }) =>{
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <EventIcon color="primary" />;
      case "warning":
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        p: 2,
        mt: 8,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: 400 },
          maxHeight: "80vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" component="h2">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Notifications List */}
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.primary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Mark all as read
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
