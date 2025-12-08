"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Grid,
  List,
  Paper,
  Button,
  useTheme,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { mainDashCards as apps } from "@/lib/store/constants/dash-cards/main-dash-cards";
import Link from "next/link";

type Package = (typeof apps)[0];

interface FeaturesDialogProps {
  open: boolean;
  onClose: () => void;
  selectedApp: Package | null;
  selectedFeature: any;
  setSelectedFeature: (feature: any) => void;
  handleSubscribeClick: (app: Package) => void;
}

const FeaturesDialog: React.FC<FeaturesDialogProps> = ({
  open,
  onClose,
  selectedApp,
  selectedFeature,
  setSelectedFeature,
  handleSubscribeClick,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: `${selectedApp?.color}20`,
              color: selectedApp?.color,
              mr: 2,
              width: 40,
              height: 40,
              fontSize: 20,
            }}
          >
            {selectedApp?.icon}
          </Avatar>
          <Typography variant="h6">{selectedApp?.title} Features</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Available Features
            </Typography>
            <List sx={{ mb: 2 }}>
              {selectedApp?.features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    "&:before": { display: "none" },
                    display: "flex",
                    alignItems: "center",
                    flexGrow: 1,
                    backgroundColor: feature.subscribed ? "#e8f5e9" : "#f5f5f5",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                  onClick={() => setSelectedFeature(feature)}
                >
                  {feature.subscribed ? (
                    <CheckIcon color="success" sx={{ mr: 2 }} />
                  ) : (
                    <LockIcon color="action" sx={{ mr: 2 }} />
                  )}
                  <Typography>{feature.name}</Typography>
                </Box>
              ))}
            </List>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Feature Details
            </Typography>
            {selectedFeature ? (
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {selectedFeature.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {selectedApp?.title} • {selectedFeature.plan} plan
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedFeature.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Key Benefits:
                  </Typography>
                  <List dense>
                    {[
                      "Increases operational efficiency",
                      "Reduces manual errors",
                      "Provides real-time insights",
                      "Integrates with other modules",
                    ].map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckIcon color="success" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="contained"
                    component={Link}
                    href={selectedApp?.href}
                  >
                    Explore
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleSubscribeClick(selectedApp!)}
                  >
                    Subscription
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <SearchIcon
                  sx={{ fontSize: 48, color: "action.disabled", mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary">
                  Select a feature to view detailed information
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturesDialog;
