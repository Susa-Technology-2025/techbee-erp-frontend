// src/app/organization/profile/OrganizationProfilePage.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Edit, Business } from "@mui/icons-material";
import { ReusableFormDrawer } from "@/components/ReusableFormDrawer";
import { z } from "zod";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

import { OrganizationFields } from "./OrganizationFields";
import { OrganizationSummary } from "./OrganizationSummary";
import { ProfileSummarySkeleton } from "./ProfileSummarySkeleton";
import { EmptyProfileState } from "./EmptyProfileState";

const organizationProfileSchema = z.object({
  code: z.string().min(1, "Code is required"),
  isActive: z.boolean().default(true),
  isSaaS: z.boolean().default(false),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  logoUrl: z.string().optional().or(z.literal("")),
  metadata: z.object({
    email: z.email("Invalid email format").optional().or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
  }),
  // tenantConfig: z.object({
  //   id: z.string().optional().nullable(),
  //   allowOrgStructure: z.boolean().optional().nullable().default(true),
  //   fiscalYearEnd: z.date().optional().nullable(),
  //   fiscalYearStart: z.date().optional().nullable(),
  //   locale: z.string().optional().nullable(),
  //   maxEmployees: z.number().int().min(1).nullable().optional(),
  //   requireCompanyNode: z.boolean().optional().nullable().default(true),
  //   timezone: z.string().optional().nullable(),
  // }),
});

type OrganizationFormData = z.infer<typeof organizationProfileSchema>;

// --- useOrganizationData (Adapted Hook) ---

function useOrganizationData(orgID: string | undefined) {
  const apiEndPoint = `https://api.techbee.et/api/core/tenants/${orgID}`;

  const query = useDataQuery({
    apiEndPoint: apiEndPoint,
    enabled: Boolean(orgID),
    noFilter: true,
  });

  const hasProfile = query.isSuccess && query.data;

  const is404Error =
    query.isError &&
    (query.error?.message?.includes("No resource was found") ||
      query.error?.status === 404 ||
      query.error?.message?.includes("404") ||
      query.error?.message?.includes("not found"));

  const noProfileFound = is404Error || (query.isSuccess && !query.data);

  const hasRealError = query.isError && !is404Error;

  return {
    ...query,
    data: query.data as OrganizationFormData | undefined,
    hasProfile,
    noProfileFound,
    is404Error,
    hasRealError,
    apiEndPoint,
  };
}

// --- OrganizationProfilePage (Main Component) ---

export default function OrganizationProfilePage() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("view");

  // Get the organization data from the session
  const {
    organization: {
      id: orgID,
      code: tenantCode,
      name: sessionName,
      logo: sessionLogoUrl,
    },
  } = useSelector((state: RootState) => state.session || {});

  const {
    data,
    isLoading,
    hasProfile,
    noProfileFound,
    hasRealError,
    error,
    apiEndPoint,
  } = useOrganizationData(orgID);

  // Combine fetched data with session data for initial form values
  const initialOrganizationData = useMemo(() => {
    // If we have fetched data, use it as the base
    if (hasProfile && data) {
      return {
        ...data,
        // Ensure non-editable code is present, preferring fetched data, but using session as fallback
        code: data.code || tenantCode,
        // Use fetched name/logo, if available, otherwise use session data
        name: data.name || sessionName,
        logoUrl: data.logoUrl || sessionLogoUrl || "",
      } as OrganizationFormData;
    }

    // If no profile is found but we have session identifiers (e.g., in 'create' mode)
    if (tenantCode) {
      return {
        // Essential minimum fields from session/default for the form to work
        code: tenantCode,
        name: sessionName,
        logoUrl: sessionLogoUrl || "",
        isSaaS: false,
        metadata: {},
        tenantConfig: {},
      } as OrganizationFormData;
    }

    return undefined;
  }, [hasProfile, data, tenantCode, sessionName, sessionLogoUrl]);

  const handleCreateProfile = () => {
    setMode("create");
    setOpen(true);
  };

  const handleEditProfile = () => {
    setMode("edit");
    setOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", p: { xs: 2, md: 4 } }}>
      {hasProfile && (
        <Box
          sx={{ pb: 2, width: "100%", display: "flex", justifyContent: "end" }}
        >
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEditProfile}
            size="medium"
          >
            Edit Configuration
          </Button>
        </Box>
      )}

      {isLoading && <ProfileSummarySkeleton />}

      {hasRealError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading organization profile: **
          {error?.message || "Unknown error occurred"}**
        </Alert>
      )}

      {noProfileFound && !isLoading && (
        <EmptyProfileState
          // @ts-ignore
          onCreate={handleCreateProfile}
        >
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "error.main",
            }}
          >
            <Business sx={{ fontSize: 50, color: "error.dark", mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Profile Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              No organization profile was found for tenant code **{orgID}
              **. Please contact support.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Business />}
              onClick={handleCreateProfile}
              size="large"
              disabled={!orgID}
            >
              Attempt Creation
            </Button>
          </Box>
        </EmptyProfileState>
      )}

      {hasProfile && initialOrganizationData && (
        <OrganizationSummary data={initialOrganizationData} />
      )}

      <ReusableFormDrawer<OrganizationFormData>
        open={open}
        onClose={() => setOpen(false)}
        formMode={mode === "view" ? "edit" : mode}
        apiEndPoint={"https://api.techbee.et/api/core/tenants"}
        zodSchema={organizationProfileSchema}
        fieldsComponent={<OrganizationFields />}
        createButtonName="Create Profile"
        updateButtonName="Save Changes"
        viewComponent={OrganizationSummary}
        initialData={initialOrganizationData}
        queryKeys={["data", apiEndPoint]}
      />
    </Box>
  );
}
