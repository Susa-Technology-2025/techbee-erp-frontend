"use client"
import { Suspense, useState } from "react";
import { Box, Typography, IconButton, Badge, Modal, Stack, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import ModuleCardGrid from "@/components/reusable-cards/cards-container";
import { mainDashCards } from "@/lib/store/constants/dash-cards/main-dash-cards";
import { session } from "@/lib/auth/session";
import Image from "next/image";
import GreetingBox from "./greeting";

const COMPANY_BRANDING = {
  name: "AuraLuxe",
  logo: {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=60&fit=crop&auto=format", // Random beauty/logo image
    alt: "AuraLuxe Logo",
    width: 160,
    height: 48
  },
  colors: {
    primary: "#8B5FBF",
    secondary: "#FF6B9D",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }
};

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

export const CompanyHeader = ({ onNotificationClick }: { onNotificationClick: () => void }) => {
      const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 4,
        p: 3,
        background: COMPANY_BRANDING.colors.background,
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 1,
        }}
      />
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, zIndex: 2 }}>
        {/* Logo Image */}
        <Box
          sx={{
            width: COMPANY_BRANDING.logo.width,
            height: COMPANY_BRANDING.logo.height,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Image
            src={COMPANY_BRANDING.logo.src}
            alt={COMPANY_BRANDING.logo.alt}
            width={COMPANY_BRANDING.logo.width}
            height={COMPANY_BRANDING.logo.height}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: "bold",
              mb: 0.5,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            Welcome to {COMPANY_BRANDING.name}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9,
              fontSize: "1.1rem"
            }}
          >
            Your gateway to excellence and innovation
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 2 }}>
        <Suspense fallback="loading...">
          <GreetingBox username={"admin"} />
        </Suspense>
        
        {/* Notification Bell */}
        <IconButton 
          onClick={onNotificationClick}
          sx={{ 
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            '&:hover': {
              bgcolor: "rgba(255,255,255,0.3)",
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
}