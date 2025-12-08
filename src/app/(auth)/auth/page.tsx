"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  Grid,
  Fade,
  alpha,
  Divider,
  Snackbar,
  Alert,
  Modal,
  Autocomplete, // Added Autocomplete
} from "@mui/material";
import ToggleTheme from "@/theme/toogle-theme";

import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  VpnKey,
  CorporateFare,
  Code,
  Badge,
  Home as HomeIcon,
  LockReset,
} from "@mui/icons-material";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useDispatch, useSelector } from "react-redux";
import { sessionActions } from "@/lib/store/global-state/auth/auth-slice";
import { redirect, useSearchParams } from "next/navigation";
import { RootState } from "@/lib/store/store";

type AlertState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  orgDetail: z.object({
    organizationName: z.string().min(1, "Organization name is required"),
    organizationShortCode: z.string().min(1, "Short code is required"),
  }),
  adminAccount: z.object({
    adminUserName: z.string().min(1, "Admin username is required"),
    adminEmail: z.email("Invalid email address"),
    adminPassword: z.string().min(8, "Password must be at least 8 characters"),
    adminPhoneNumber: z.string().min(1, "Phone number is required"),
    usagePlan: z.enum(["saas", "onpremise"]),
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// Schemas for Forgot Password Steps
const notificationOptions = ["Email", "Telegram", "WhatsApp", "SMS"] as const; // Defined notification options

const requestResetCodeSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  // MODIFIED: Added notificationOption with Zod enum and default
  notificationOption: z.enum(notificationOptions).default("Email"),
});

// UPDATED: Added confirmNewPassword and a refinement for password match
const verifyResetCodeSchema = z
  .object({
    // These are placeholders for defaultValues, not required for form submission
    userId: z.string().optional().nullable(),
    resetCode: z.string().optional().nullable(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"], // Set the error on the confirm field
  });

type RequestResetCodeFormData = z.infer<typeof requestResetCodeSchema>;
type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>;

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

// MODIFIED: Simplified to only handle the request code step
const ForgotPasswordModal: React.FC<{
  open: boolean;
  onClose: () => void;
  showAlert: (message: string, severity: AlertState["severity"]) => void;
}> = ({ open, onClose, showAlert }) => {
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      resetRequestForm({
        identifier: "",
        notificationOption: "Email", // Set default when opening
      });
    }
  }, [open]);

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest },
    reset: resetRequestForm,
    control, // Added control
  } = useForm<RequestResetCodeFormData>({
    resolver: zodResolver(requestResetCodeSchema),
    defaultValues: {
      identifier: "",
      notificationOption: "Email", // Default value
    },
  });

  const { mutate: requestResetCode, isPending: isRequesting } = useDataMutation<
    ResetCodeResponse,
    RequestResetCodeFormData
  >({
    apiEndPoint: "https://auth.api.techbee.et/api/auth/forgot-password", // Full URL
    method: "POST",
    onSuccessInvalidate: false,
    onSuccess: (data) => {
      // MODIFIED: Only show the "check email" text
      showAlert(
        "A password reset link has been sent to your email. Please check your inbox.",
        "info"
      );
      onClose(); // Close the modal immediately
    },
    onError: (err: any) => {
      const errorMessage =
        err?.message ||
        "Failed to send reset code. Please check the identifier.";
      showAlert(errorMessage, "error");
    },
  });

  const onSubmitRequest = (data: RequestResetCodeFormData) => {
    // MODIFIED: Send the notificationOption in the payload
    requestResetCode({
      identifier: data.identifier,
      notificationOption: data.notificationOption,
    });
  };

  const RequestContent = (
    <Box
      component="form"
      onSubmit={handleSubmitRequest(onSubmitRequest)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="body2" color="text.secondary">
        Enter your{" "}
        <Typography component={"span"} sx={{ fontWeight: "bold" }}>
          username or email address
        </Typography>{" "}
        to receive a password reset link.
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Username or Email"
        variant="standard"
        placeholder="e.g., john.doe or john.doe@acme.com"
        {...registerRequest("identifier")}
        error={!!errorsRequest.identifier}
        helperText={errorsRequest.identifier?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email fontSize="small" color="primary" />
            </InputAdornment>
          ),
        }}
      />

      {/* NEW FIELD: Notification Option Autocomplete */}
      <Controller
        name="notificationOption"
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            {...rest}
            fullWidth
            size="small"
            options={notificationOptions as readonly string[]} // Use the defined options
            getOptionDisabled={(option) => option !== "Email"} // Disable all options except Email
            onChange={(_, data) => onChange(data || "Email")} // Update form value
            value={value}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Send Reset Link via"
                placeholder="Select notification method"
                error={!!errorsRequest.notificationOption}
                helperText={
                  errorsRequest.notificationOption?.message ||
                  "Currently, only Email is supported for link delivery."
                }
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        )}
      />
      {/* END NEW FIELD */}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="small"
        sx={{ mt: 2, py: 1, borderRadius: 2, fontWeight: 600 }}
        startIcon={<LockReset />}
        disabled={isRequesting}
      >
        {isRequesting ? "Sending Link..." : "Request Reset Link"}
      </Button>
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
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
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Forgot Password
          </Typography>
          <Divider />

          {RequestContent}

          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={onClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

// NEW COMPONENT: Handles the password reset after clicking the email link
const ResetPasswordForm: React.FC<{
  userId: string;
  resetCode: string;
  showAlert: (message: string, severity: AlertState["severity"]) => void;
}> = ({ userId, resetCode, showAlert }) => {
  const theme = useTheme();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      userId: userId,
      resetCode: resetCode,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: verifyResetCode, isPending: isVerifying } = useDataMutation<
    any,
    any
  >({
    apiEndPoint: "https://auth.api.techbee.et/api/auth/verify-reset-code", // Full URL
    method: "POST",
    onSuccessInvalidate: false,
    onSuccess: () => {
      // Redirect user back to the login page (or dashboard, but login seems appropriate here)
      showAlert("Password reset successfully! Please sign in.", "success");
      // Use window.location.replace to clear the reset parameters from the URL history
      setTimeout(() => {
        // Redirect to the base auth page, clearing the URL query params
        window.location.replace(
          window.location.origin + window.location.pathname
        );
      }, 1000);
    },
    onError: (err: any) => {
      const errorMessage =
        err?.message ||
        "Password reset failed. Please check the reset code or password.";
      showAlert(errorMessage, "error");
    },
  });

  const onSubmit = (data: VerifyResetCodeFormData) => {
    // Construct the payload as required by the backend, using props for userId and resetCode
    verifyResetCode({
      newPassword: data.newPassword,
      user: { id: userId }, // From props/URL
      resetCode: resetCode, // From props/URL
    });
  };

  return (
    <Fade in={true} timeout={400}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: "450px",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your identity has been verified. Enter your new password below.
        </Typography>

        <TextField
          fullWidth
          size="small"
          variant="standard"
          label="New Password"
          placeholder="Enter your new password"
          type={showNewPassword ? "text" : "password"}
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={
            errors.newPassword
              ? errors.newPassword.message
              : "Must be at least 8 characters long."
          }
          sx={{ mb: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKey fontSize="small" color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          size="small"
          variant="standard"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmNewPassword")}
          error={!!errors.confirmNewPassword}
          helperText={
            errors.confirmNewPassword
              ? errors.confirmNewPassword.message
              : "Re-enter your new password."
          }
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKey fontSize="small" color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="small"
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            transition: "all 0.2s ease",
          }}
          startIcon={<LockReset />}
          disabled={isVerifying}
        >
          {isVerifying ? "Resetting Password..." : "Set New Password"}
        </Button>
      </Box>
    </Fade>
  );
};

const LoginForm: React.FC<{
  showAlert: (message: string, severity: AlertState["severity"]) => void;
  onForgotPasswordClick: () => void;
}> = ({ showAlert, onForgotPasswordClick }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending: isLOggingIn } = useDataMutation<any, any>({
    apiEndPoint: "https://auth.api.techbee.et/api/auth/login",
    method: "POST",
    onSuccessInvalidate: false,

    onSuccess: (data) => {
      dispatch(
        sessionActions.setSession({
          accessToken: data.accessToken,
          loggedIn: true,
          tenantCode: data.tenantCode,
          organization: data.organization,
          user: data.user,
          permissions: data.permissions,
        })
      );
      showAlert("Login successful! Redirecting to dashboard...", "success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    },
    onError: (err: any) => {
      const errorMessage =
        err?.message || "Login failed. Please check your credentials.";
      showAlert(errorMessage, "error");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login({ username: data.username, password: data.password });
  };

  return (
    <Fade in={true} timeout={400}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Box>
          <TextField
            fullWidth
            size="small"
            variant="standard"
            label="Username"
            placeholder="Enter your username"
            {...register("username")}
            error={!!errors.username}
            helperText={
              errors.username
                ? errors.username.message
                : "The username you use to log in."
            }
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            size="small"
            variant="standard"
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={
              errors.password
                ? errors.password.message
                : "Your secret login password."
            }
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey fontSize="small" color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 3,
            }}
          >
            <Button
              variant="text"
              size="small"
              onClick={onForgotPasswordClick}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                fontWeight: 500,
                p: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Button>
          </Box>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="small"
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            transition: "all 0.2s ease",
            mt: "auto",
          }}
          disabled={isLOggingIn}
        >
          {isLOggingIn ? "Signing In..." : "Sign In"}
        </Button>
      </Box>
    </Fade>
  );
};

const RegisterForm: React.FC<{
  showAlert: (message: string, severity: AlertState["severity"]) => void;
  onSuccess: () => void;
}> = ({ showAlert, onSuccess }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [usagePlan, setUsagePlan] = useState<"saas" | "onpremise">("saas");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      adminAccount: {
        usagePlan: "saas",
      },
    },
  });

  const { mutate: registerOrganization, isPending: isRegistering } =
    useDataMutation<any, any>({
      apiEndPoint: "https://core.api.techbee.et/api/tenants",
      method: "POST",
      onSuccessInvalidate: false,
      onSuccess: (data) => {
        showAlert(
          `Organization "${data.organizationName}" registered successfully! Please sign in with your admin credentials.`,
          "success"
        );
        reset();
        onSuccess();
      },
      onError: (err: any) => {
        const errorMessage =
          err?.message || "Registration failed. Please try again.";
        showAlert(errorMessage, "error");
      },
    });

  const onSubmit = (data: RegisterFormData) => {
    const isSaaSValue = data.adminAccount.usagePlan === "saas";

    const apiData = {
      code: data.orgDetail.organizationShortCode,
      name: data.orgDetail.organizationName,
      isSaaS: isSaaSValue,
      isActive: true,
      metadata: {
        admin: {
          username: data.adminAccount.adminUserName,
          email: data.adminAccount.adminEmail,
          password: data.adminAccount.adminPassword,
          phoneNumber: data.adminAccount.adminPhoneNumber,
        },
      },
    };

    registerOrganization(apiData);
  };

  return (
    <Fade in={true} timeout={400}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CorporateFare fontSize="small" />
            Organization
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Org Name"
              placeholder="Company name"
              {...register("orgDetail.organizationName")}
              error={!!errors.orgDetail?.organizationName}
              helperText={
                errors.orgDetail?.organizationName
                  ? errors.orgDetail.organizationName.message
                  : "The full legal name of your organization."
              }
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Short Code"
              placeholder="e.g., ACME"
              {...register("orgDetail.organizationShortCode")}
              error={!!errors.orgDetail?.organizationShortCode}
              helperText={
                errors.orgDetail?.organizationShortCode
                  ? errors.orgDetail.organizationShortCode.message
                  : "A short, unique code for your organization (e.g., ACME)."
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Code fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Badge fontSize="small" />
            Admin Account
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Username"
              placeholder="Admin username"
              {...register("adminAccount.adminUserName")}
              error={!!errors.adminAccount?.adminUserName}
              helperText={
                errors.adminAccount?.adminUserName
                  ? errors.adminAccount.adminUserName.message
                  : "The primary administrative username."
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Email"
              placeholder="admin@company.com"
              type="email"
              {...register("adminAccount.adminEmail")}
              error={!!errors.adminAccount?.adminEmail}
              helperText={
                errors.adminAccount?.adminEmail
                  ? errors.adminAccount.adminEmail.message
                  : "The email address for the admin account."
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Password"
              placeholder="Secure password"
              type={showPassword ? "text" : "password"}
              {...register("adminAccount.adminPassword")}
              error={!!errors.adminAccount?.adminPassword}
              helperText={
                errors.adminAccount?.adminPassword
                  ? errors.adminAccount.adminPassword.message
                  : "Must be at least 8 characters long."
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey fontSize="small" color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Phone"
              placeholder="+1 (555) 123-4567"
              {...register("adminAccount.adminPhoneNumber")}
              error={!!errors.adminAccount?.adminPhoneNumber}
              helperText={
                errors.adminAccount?.adminPhoneNumber
                  ? errors.adminAccount.adminPhoneNumber.message
                  : "The contact phone number for the admin."
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography
            variant="subtitle2"
            sx={{
              mt: 2,
              mb: 1,
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            Usage Plan
          </Typography>
          <Grid size={{ xs: 12 }} container spacing={1} sx={{ mb: 3 }}>
            {[
              { value: "saas" as const, label: "SaaS" },
              { value: "onpremise" as const, label: "On-Premise" },
            ].map((plan) => (
              <Grid size={{ xs: 6 }} key={plan.value}>
                <Button
                  fullWidth
                  variant={usagePlan === plan.value ? "contained" : "outlined"}
                  size="small"
                  onClick={() => {
                    setUsagePlan(plan.value);
                    setValue("adminAccount.usagePlan", plan.value);
                  }}
                  sx={{
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    borderRadius: 1.5,
                  }}
                >
                  {plan.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="small"
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            transition: "all 0.2s ease",
            mt: 2,
            flexShrink: 0,
          }}
          disabled={isRegistering}
        >
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </Box>
    </Fade>
  );
};

const ModernAuthComponent: React.FC = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [tenant, setTenant] = useState();
  const [image, setImage] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      setTenant(parts[0]);
    }
  }, []);
  const { data: landingData, isSuccess } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/core/landingPages?where[code]=${tenant}`,
    enabled: Boolean(tenant),
    fetchWithoutRefresh: true,
    noFilter: true,
  });
  useEffect(() => {
    if (isSuccess) {
      setImage(landingData[0]?.backgroundImage);
    }
  }, [isSuccess, landingData]);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
  });

  // Check URL for password reset mode
  const mode = searchParams.get("mode");
  const userId = searchParams.get("user");
  const resetCode = searchParams.get("code");
  const isResetMode = mode === "reset" && userId && resetCode;

  const showAlert = useCallback(
    (message: string, severity: AlertState["severity"]) => {
      setAlert({ open: true, message, severity });
    },
    []
  );

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleOpenForgotModal = useCallback(() => {
    setIsForgotModalOpen(true);
  }, []);

  const handleCloseForgotModal = useCallback(() => {
    setIsForgotModalOpen(false);
  }, []);

  const staticImage = "ethiopia.jpg";

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRegistrationSuccess = () => {
    setCurrentTab(0);
  };

  // Determine the content to display in the main form area
  const mainContent = useMemo(() => {
    if (isResetMode) {
      // Show the password reset form if URL parameters are present
      return (
        <ResetPasswordForm
          userId={userId as string}
          resetCode={resetCode as string}
          showAlert={showAlert}
        />
      );
    }

    // Otherwise, show Login or Register based on the tab state
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: "450px",
          pb: 1,
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {currentTab === 0 && (
          <LoginForm
            showAlert={showAlert}
            onForgotPasswordClick={handleOpenForgotModal}
          />
        )}
        {currentTab === 1 && (
          <RegisterForm
            showAlert={showAlert}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </Box>
    );
  }, [
    isResetMode,
    userId,
    resetCode,
    showAlert,
    currentTab,
    handleOpenForgotModal,
    handleRegistrationSuccess,
  ]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255, 255, 255, 0.49)",
          borderRadius: 2,
          backdropFilter: "blur(10px)",
        }}
      >
        <IconButton component={Link} href="/">
          <HomeIcon />
        </IconButton>
        <ToggleTheme />
      </Box>

      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            tenant === "minda"
              ? `url("https://mindabg.com/public/web/assets/images/bio/75583ZWjzyPm.jpg")`
              : `url("https://static.tildacdn.com/tild6162-3234-4734-a432-373432646163/photo.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              135deg,
              ${alpha(theme.palette.common.black)} 0%,
              ${alpha(theme.palette.common.black, 0.7)} 30%,
              ${alpha(theme.palette.common.black, 0.4)} 70%,
              ${alpha(theme.palette.common.black, 0.2)} 100%
            )`,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            p: 8,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { lg: "2.4rem", xl: "2.8rem" },
              letterSpacing: "0.03em",
              // textTransform: "uppercase",
            }}
          >
            {isResetMode
              ? "Final Step: Reset Password"
              : currentTab === 0
              ? `Welcome`
              : "Empower Your Organization"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 300,
              maxWidth: 600,
              lineHeight: 1.6,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            {isResetMode
              ? "You are one step away from securely accessing your account. Choose a new, strong password."
              : currentTab === 0
              ? "Manage every aspect of your business seamlessly with  ERP — an intelligent platform designed to simplify operations, enhance collaboration, and drive performance across all departments."
              : "Join the TechBee ERP ecosystem and experience the future of enterprise management — where efficiency meets innovation, and your organization’s potential knows no limits."}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "30%", lg: "25%" },
          display: "flex",
          alignItems: { xs: "flex-start", lg: "center" },
          justifyContent: "center",
          background: theme.palette.background.paper,
          p: { xs: 3, sm: 4 },
          overflowY: { xs: "auto", lg: "hidden" },
          py: { xs: 4, sm: 6, lg: 0 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            height: { xs: "auto", lg: "100%" },
            display: "flex",
            flexDirection: "column",
            minHeight: "450px",
          }}
        >
          {/* Tabs are hidden in reset mode */}
          {!isResetMode && (
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 4,
                minHeight: 48,
                height: 48,
                flexShrink: 0,
                "& .MuiTabs-indicator": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  height: 3,
                  borderRadius: 1,
                },
                "& .MuiTab-root": {
                  minHeight: 48,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: theme.palette.text.secondary,
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Register" />
            </Tabs>
          )}

          {/* Render the appropriate content based on mode/tab */}
          {mainContent}
        </Box>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Forgot password modal is still used for the request step */}
      <ForgotPasswordModal
        open={isForgotModalOpen}
        onClose={handleCloseForgotModal}
        showAlert={showAlert}
      />
    </Box>
  );
};

export default ModernAuthComponent;
