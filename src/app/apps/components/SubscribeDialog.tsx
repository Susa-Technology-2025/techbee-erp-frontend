"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";

type PackageFeature = {
  name: string;
  description: string;
  plan: "free" | "starter" | "basic" | "pro" | "premium" | "enterprise";
  subscribed: boolean;
  active: boolean;
  underMaintainance: boolean;
};

type Package = {
  title: string;
  onTrial: string;
  description: string;
  icon: string;
  href: string;
  rolesAllowed: string[];
  color: string;
  category: "module" | "moduleFeature";
  features: PackageFeature[];
  parentModule?: string;
};

interface SubscribeDialogProps {
  open: boolean;
  onClose: () => void;
  selectedApp: Package | null;
}

const pricingPlans = [
  {
    name: "Free",
    price: "0 ETB",
    period: "/month",
    features: ["Basic modules", "Community support"],
    recommended: false,
    planType: "free",
    color: "#8B8B8B",
  },
  {
    name: "Starter",
    price: "300 ETB",
    period: "/month",
    features: ["Up to 10 users", "Essential modules", "Email support"],
    recommended: false,
    planType: "starter",
    color: "#4CAF50",
  },
  {
    name: "Pro",
    price: "799 ETB",
    period: "/month",
    features: [
      "Up to 50 users",
      "Advanced modules",
      "Priority support",
      "API access",
    ],
    recommended: true,
    planType: "pro",
    color: "#2196F3",
  },
  {
    name: "Premium",
    price: "999 ETB",
    period: "",
    features: [
      "Unlimited users",
      "All modules",
      "24/7 support",
      "Dedicated account manager",
      "Custom integrations",
    ],
    recommended: false,
    planType: "enterprise",
    color: "#9C27B0",
  },
];

const PaymentDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  planName: string;
}> = ({ open, onClose, planName }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">Payment for {planName} Plan</Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <Box
        component="form"
        sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField label="Card Number" fullWidth />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField label="Expiry Date" fullWidth />
          <TextField label="CVC" fullWidth />
        </Box>
        <TextField label="Cardholder Name" fullWidth />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="primary">
        Pay Now
      </Button>
    </DialogActions>
  </Dialog>
);

const SubscribeDialog: React.FC<SubscribeDialogProps> = ({
  open,
  onClose,
  selectedApp,
}) => {
  const theme = useTheme();
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const handleChoosePlan = (planName: string) => {
    onClose();
    setSelectedPlanName(planName);
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        about="Manage subscription plans"
      >
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              m: "auto",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {pricingPlans.map((plan, index) => (
              <Box key={index} sx={{ flex: 1 }}>
                <Paper
                  sx={{
                    p: 2,

                    display: "flex",
                    height: "95%",
                    m: "auto",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: `1px solid ${theme.palette.divider}`,
                    ...(plan.recommended && {
                      borderColor: plan.color,
                      borderWidth: 2,
                    }),
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      {plan.name} Plan
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={plan.color}
                      sx={{ mb: 1 }}
                    >
                      {plan.price}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {plan.period}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Includes{" "}
                      {
                        selectedApp?.features.filter(
                          (f) => f.plan === plan.planType
                        ).length
                      }{" "}
                      of {selectedApp?.features.length} features
                    </Typography>

                    <List dense>
                      {selectedApp?.features.map((feature, idx) => {
                        const isIncluded =
                          plan.planType === "enterprise" ||
                          feature.plan === plan.planType;
                        return (
                          <ListItem
                            key={idx}
                            sx={{
                              px: 0,
                              py: 0.5,
                              opacity: isIncluded ? 1 : 0.5,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              {isIncluded ? (
                                <CheckIcon
                                  color="success"
                                  sx={{ fontSize: 16 }}
                                />
                              ) : (
                                <CloseIcon
                                  color="error"
                                  sx={{ fontSize: 16 }}
                                />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  {feature.name}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {feature.description}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>

                  <Button
                    fullWidth
                    variant={plan.recommended ? "contained" : "outlined"}
                    sx={{
                      mt: 2,
                      backgroundColor: plan.recommended
                        ? plan.color
                        : undefined,
                      "&:hover": {
                        backgroundColor: plan.recommended
                          ? plan.color
                          : undefined,
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleChoosePlan(plan.name)}
                  >
                    Choose {plan.name}
                  </Button>
                </Paper>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <PaymentDialog
        open={openPayment}
        onClose={handleClosePayment}
        planName={selectedPlanName}
      />
    </>
  );
};

export default SubscribeDialog;
