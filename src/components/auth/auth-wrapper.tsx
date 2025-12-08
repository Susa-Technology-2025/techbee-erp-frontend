"use server";

import { Role } from "@/lib/auth/protected-routes";
import { session } from "@/lib/auth/session";
import { ReactNode } from "react";

interface AccessControlProps {
  allowedRoles: Role[];
  children: ReactNode;
  requireLoggedIn?: boolean;
}

export default async function AccessControl({
  allowedRoles,
  children,
  requireLoggedIn = true,
}: AccessControlProps) {
  const userSession = await session();

  if (requireLoggedIn && !userSession.loggedIn) {
    return null;
  }

  const hasPermission = userSession.role.some((userRole) =>
    allowedRoles.includes(userRole)
  );

  if (!hasPermission) {
    return null;
  }

  return children;
}
