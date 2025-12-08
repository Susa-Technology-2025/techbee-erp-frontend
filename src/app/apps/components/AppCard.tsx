"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Button,
  useTheme,
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Whatshot as HotIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { mainDashCards as apps } from "@/lib/store/constants/dash-cards/main-dash-cards";

type Package = (typeof apps)[0];

interface AppCardProps {
  app: Package;
  isFavorite: boolean;
  toggleFavorite: (title: string) => void;
  handleFeatureClick: (app: Package, feature: any) => void;
  handleSubscribeClick: (app: Package) => void;
  index: number;
}

const AppCard: React.FC<AppCardProps> = ({
  app,
  isFavorite,
  toggleFavorite,
  handleFeatureClick,
  handleSubscribeClick,
  index,
}) => {
  const theme = useTheme();

  // Add this guard clause to handle cases where app or app.features is undefined
  if (!app || !app.features) {
    return null;
  }

  const getFeatureCount = (features: any[]) => {
    const subscribed = features.filter((f) => f.subscribed).length;
    return `${subscribed}/${features.length}`;
  };

  return (
    <Card
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 12px 24px ${theme.palette.primary.light}20`,
        },
        borderLeft: `4px solid ${app.color}`,
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Favorite Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: -12,
          right: -12,
          zIndex: 1,
          backgroundColor: "background.paper",
          boxShadow: 1,
          "&:hover": {
            backgroundColor: "background.paper",
          },
        }}
        onClick={() => toggleFavorite(app.title)}
      >
        {isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
      </IconButton>

      {/* Badges */}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${app.color}20`,
              color: app.color,
              mr: 2,
              width: 48,
              height: 48,
              fontSize: 24,
            }}
          >
            {app.icon}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {app.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {app.category.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {app.description}
        </Typography>

        {/* Features Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            KEY FEATURES:
          </Typography>
          <List dense sx={{ py: 0 }}>
            {app.features.slice(0, 3).map((feature, idx) => (
              <ListItem
                key={idx}
                sx={{
                  px: 0,
                  py: 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => handleFeatureClick(app, feature)}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  {feature.subscribed ? (
                    <CheckIcon color="success" sx={{ fontSize: 16 }} />
                  ) : (
                    <LockIcon color="disabled" sx={{ fontSize: 16 }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={feature.name} />
              </ListItem>
            ))}
          </List>
          {app.features.length > 3 && (
            <Button
              size="small"
              sx={{ mt: 0.5 }}
              onClick={() => {
                handleFeatureClick(app, app.features[3]);
              }}
            >
              +{app.features.length - 3} more
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppCard;
