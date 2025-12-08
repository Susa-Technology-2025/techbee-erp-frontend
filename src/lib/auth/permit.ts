"use client";
import { useState, useEffect, useMemo } from "react";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { session } from "./session";

export const useUserPermissions = () => {
  const [userId, setUserId] = useState<null | string>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    session()
      .then((user) => {
        setUserId(user.id);
      })
      .finally(() => setLoadingSession(false));
  }, []);

  const userQuery = useDataQuery({
    apiEndPoint: `https://auth.api.techbee.et/api/users/detail/${userId}`,
    enabled: !!userId,
  });

  const userData = userQuery.data as any;

  const permissions = useMemo(() => {
    return userData?.permissions || [];
  }, [userData]);

  const hasAccess = (allowedPermissions: string[]) => {
    if (!allowedPermissions || !Array.isArray(allowedPermissions)) {
      console.error("hasAccess requires an array of permissions.");
      return false;
    }
    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }
    return allowedPermissions.some((perm) => permissions.includes(perm));
  };

  return {
    loading: userQuery.isLoading || loadingSession,
    error: userQuery.error,
    userData,
    permissions,
    hasAccess,
  };
};

export const permitted = (requiredPermissions: string[]) => {
  const { permissions, loading } = useUserPermissions();

  const canAccess = useMemo(() => {
    if (loading) {
      return false;
    }
    if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
      return false;
    }
    return requiredPermissions.some((perm) => permissions.includes(perm));
  }, [requiredPermissions, permissions, loading]);

  return {
    canAccess,
    loading,
  };
};
