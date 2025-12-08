// src/app/user/profile/UserProfilePage.tsx
"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import ResponsiveNavbar from "@/components/modulab/navbar";
import { ReusableFormDrawer } from "@/components/ReusableFormDrawer";
import { z } from "zod";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import dayjs from "dayjs";

// Import separated components
import { ProfileFields } from "./ProfileFields";
import { ProfileSummary } from "./ProfileSummary";
import { ProfileSummarySkeleton } from "./ProfileSummarySkeleton";
import { EmptyProfileState } from "./EmptyProfileState";
import ResetPasswordButton from "./reset-pwd-button";

// --- ZOD Schema (Kept here as it defines the form shape) ---

const profileSchema = z.object({
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address too long"),
  avatarUrl: z.string().optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]{10,}$/, "Please enter a valid phone number")
    .optional(),
  timezone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// --- useProfileData (No Change) ---

function useProfileData(userId: string | undefined) {
  const query = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/auth/userProfiles?where[user][id]=${userId}`,
    enabled: Boolean(userId),
    noFilter: true,
  });

  const is404Error =
    query.isError &&
    (query.error?.message?.includes("No resource was found") ||
      query.error?.status === 404 ||
      query.error?.message?.includes("404") ||
      query.error?.message?.includes("not found"));

  const hasProfile = query.isSuccess && query.data && query.data.length > 0;

  const noProfileFound =
    is404Error || (query.isSuccess && (!query.data || query.data.length === 0));

  const hasRealError = query.isError && !is404Error;

  return {
    ...query,
    hasProfile,
    noProfileFound,
    is404Error,
    hasRealError,
  };
}

// --- UserProfilePage (Main Component) ---

export default function UserProfilePage() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("view");
  const {
    user: { id: userId },
  } = useSelector((state: RootState) => state.session);

  const { data, isLoading, hasProfile, noProfileFound, hasRealError, error } =
    useProfileData(userId);

  const initialUserData = hasProfile && data ? data[0] : undefined;

  const handleCreateProfile = () => {
    setMode("create");
    setOpen(true);
  };

  const handleEditProfile = () => {
    setMode("edit");
    setOpen(true);
  };

  const currentProfileData = hasProfile ? initialUserData : null;

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          pt: 2,
        }}
      >
        {hasProfile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditProfile}
              size="small"
            >
              Edit Profile
            </Button>
            <ResetPasswordButton />
          </Box>
        )}
      </Box>

      {isLoading && <ProfileSummarySkeleton />}

      {hasRealError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading profile: **
          {error?.message || "Unknown error occurred"}**
        </Alert>
      )}

      {noProfileFound && !isLoading && (
        <EmptyProfileState onCreate={handleCreateProfile} />
      )}

      {hasProfile && currentProfileData && (
        <Paper
          elevation={3}
          sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, pb: 2 }}>
            <Avatar
              src={currentProfileData.avatarUrl}
              sx={{
                width: 80,
                height: 80,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              {!currentProfileData.avatarUrl && "U"}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom={false}>
                Profile Summary
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                User ID: {userId}
              </Typography> */}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {currentProfileData.dateOfBirth && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {dayjs(currentProfileData.dateOfBirth).format("MMM D, YYYY")}
                </Typography>
              </Grid>
            )}
            {currentProfileData.phoneNumber && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentProfileData.phoneNumber}
                </Typography>
              </Grid>
            )}
            {currentProfileData.gender && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Gender / Nationality
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentProfileData.gender} •{" "}
                  {currentProfileData.nationality || "Not specified"}
                </Typography>
              </Grid>
            )}
            {currentProfileData.timezone && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Timezone
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentProfileData.timezone}
                </Typography>
              </Grid>
            )}
            {currentProfileData.address && (
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentProfileData.address}
                </Typography>
              </Grid>
            )}
            {currentProfileData.bio && (
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Bio
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontStyle: "italic", whiteSpace: "pre-wrap" }}
                >
                  "{currentProfileData.bio}"
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      <ReusableFormDrawer<ProfileFormData>
        open={open}
        onClose={() => setOpen(false)}
        formMode={mode === "view" ? "edit" : mode}
        apiEndPoint={"https://api.techbee.et/api/auth/userProfiles"}
        zodSchema={profileSchema}
        fieldsComponent={<ProfileFields />}
        createButtonName="Create Profile"
        updateButtonName="Update Profile"
        viewComponent={ProfileSummary}
        initialData={initialUserData}
        additionalData={{ user: { id: userId } }}
        queryKeys={[
          "data",
          `https://api.techbee.et/api/auth/userProfiles?where[user][id]=${userId}`,
        ]}
      />
    </Box>
  );
}
