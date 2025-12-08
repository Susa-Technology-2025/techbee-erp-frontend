// components/ResetPasswordButton.tsx
import React, { useState, useCallback } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  useTheme,
  Fade,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert, // Import MuiAlert
} from "@mui/material";
import {
  LockReset,
  Email,
  Close,
  Sms,
  Telegram,
  WhatsApp,
} from "@mui/icons-material";

// --- Redux Imports ---
import { useSelector } from "react-redux";
// Assuming this path is correct based on page.tsx imports
import { RootState } from "@/lib/store/store";

// --- Data/Form Logic Imports (Simplified as no form input is used) ---
import { useDataMutation } from "@/lib/tanstack/useDataQuery";

// --- Types and Constants ---
type AlertStateSeverity = "success" | "error" | "info" | "warning";

type ResetMethod = "email" | "sms" | "whatsapp" | "telegram";

type ResetCodeResponse = {
  success: boolean;
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    tenantCode: string;
  };
  otp: {
    expiresAt: string;
    ttlSeconds: number;
  };
};

const RESET_METHODS: {
  value: ResetMethod;
  label: string;
  Icon: React.ElementType;
  disabled: boolean;
}[] = [
  { value: "email", label: "Email", Icon: Email, disabled: false },
  { value: "sms", label: "SMS", Icon: Sms, disabled: true },
  { value: "whatsapp", label: "WhatsApp", Icon: WhatsApp, disabled: true },
  { value: "telegram", label: "Telegram", Icon: Telegram, disabled: true },
];

// --- Component Definition ---

// Removed showAlert prop as the alert is now internal to the modal
interface ResetPasswordButtonProps {}

// Internal Alert State Type
interface InternalAlertState {
  message: string;
  severity: AlertStateSeverity;
}

const ResetPasswordButton: React.FC<ResetPasswordButtonProps> = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [sendMethod, setSendMethod] = useState<ResetMethod>("email");
  // 1. New internal state for alert message
  const [alertState, setAlertState] = useState<InternalAlertState | null>(null);

  // 1. Fetch user email from Redux
  const userEmail = useSelector(
    (state: RootState) => state.session.user?.email
  );

  const handleOpen = useCallback(() => {
    // Clear any previous alerts when opening
    setAlertState(null);
    setSendMethod("email");
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  // Mutation logic (copied from page.tsx)
  const {
    mutate: requestResetCode,
    isPending: isRequesting,
    isSuccess,
  } = useDataMutation<
    ResetCodeResponse,
    { identifier: string } // Request body expects an identifier (email)
  >({
    apiEndPoint: "https://auth.api.techbee.et/api/auth/forgot-password", // Full URL from page.tsx
    method: "POST",
    onSuccessInvalidate: false,
    onSuccess: () => {
      // 2. Set internal success alert and close the modal
      setAlertState({
        message: "Success, please check your email.",
        severity: "success",
      });
      handleClose(); // Close the modal on successful request
    },
    onError: (err: any) => {
      const errorMessage =
        err?.message ||
        "Failed to send reset link/code. Please try again or contact support.";
      // 2. Set internal error alert (modal remains open)
      setAlertState({
        message: errorMessage,
        severity: "error",
      });
    },
  });

  // Handle API submission
  const handleSubmitRequest = () => {
    // Clear previous alerts before submitting
    setAlertState(null);

    // Use the logged-in user's email as the identifier
    if (userEmail) {
      requestResetCode({ identifier: userEmail });
    } else {
      // 2. Set internal error alert for missing email
      setAlertState({
        message: "Cannot find your registered email. Please contact support.",
        severity: "error",
      });
    }
  };

  const RequestContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* 3. Display the MuiAlert here */}
      {alertState && alertState.severity === "error" && (
        <Alert
          severity={alertState.severity}
          onClose={() => setAlertState(null)}
          sx={{ mb: 1 }}
        >
          {alertState.message}
        </Alert>
      )}

      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
          Choose a password reset method
        </FormLabel>
        <RadioGroup
          aria-label="reset-method"
          name="reset-method-group"
          value={sendMethod}
          onChange={(e) => setSendMethod(e.target.value as ResetMethod)}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          {RESET_METHODS.map((method) => (
            <FormControlLabel
              key={method.value}
              value={method.value}
              control={<Radio size="small" disabled={method.disabled} />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <method.Icon
                    fontSize="small"
                    color={method.disabled ? "disabled" : "primary"}
                  />
                  <Typography
                    variant="body2"
                    color={method.disabled ? "text.disabled" : "text.primary"}
                  >
                    {method.label}
                    {method.value === "email" && ` (${userEmail})`}
                    {method.disabled}
                  </Typography>
                </Box>
              }
              disabled={method.disabled}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 1 }} />

      <Typography variant="body2" color="text.secondary">
        A link will be sent to your account's primary contact method. Your
        identifier used for the request will be:{" "}
        <Typography component={"span"} sx={{ fontWeight: "bold" }}>
          {userEmail}
        </Typography>
      </Typography>

      <Button
        type="button"
        fullWidth
        variant="contained"
        size="small"
        sx={{ mt: 2, py: 1, borderRadius: 2, fontWeight: 600 }}
        startIcon={<LockReset />}
        onClick={handleSubmitRequest}
        loading={isRequesting}
      >
        {sendMethod === "email"
          ? "Send Link via Email"
          : `Send Code via ${
              RESET_METHODS.find((m) => m.value === sendMethod)?.label
            }`}
      </Button>
    </Box>
  );

  return (
    <>
      {/* The main button to be used on the user profile page */}
      <Button
        variant="outlined"
        color="warning"
        startIcon={<LockReset />}
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          py: 1,
          px: 3,
        }}
      >
        Reset Password
      </Button>

      {/* 3. Display external MuiAlert for success *after* modal closes */}
      {alertState && alertState.severity === "success" && (
        <Box sx={{ position: "fixed", top: 20, right: 20, zIndex: 1301 }}>
          <Fade in={open === false && alertState.message.length > 0}>
            <Alert
              severity={alertState.severity}
              onClose={() => setAlertState(null)}
              sx={{ boxShadow: 6 }}
            >
              {alertState.message}
            </Alert>
          </Fade>
        </Box>
      )}

      {/* The Modal containing the form */}
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              maxWidth: "90%",
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              outline: "none",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                Reset Password Request
              </Typography>
              <Button onClick={handleClose} size="small">
                <Close />
              </Button>
            </Box>
            <Divider />

            {RequestContent}

            <Button
              fullWidth
              variant="text"
              size="small"
              onClick={handleClose}
              sx={{ color: theme.palette.text.secondary }}
            >
              Cancel
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ResetPasswordButton;
