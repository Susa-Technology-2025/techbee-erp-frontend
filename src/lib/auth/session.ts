"use server";

import { cookies } from "next/headers";
import { Role } from "./protected-routes";

export type Session = {
  loggedIn: boolean;
  role: Role[];
  id: string;
  organizationId: string;
  profilePicture: string;
  username: string;
  xTenantCode: string;
  accessToken?: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  tenantName: string;
  tenantLogoUrl: string;
  profilePicUrl: string;
};

const profilePicture =
  "https://placehold.co/200x200/cccccc/333333?text=Profile";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

export async function session(): Promise<Session> {
  const accessTokenCookie = (await cookies()).get("accessToken");

  if (!accessTokenCookie) {
    return {
      loggedIn: false,
      role: ["guest"],
      id: "",
      organizationId: "",
      username: "",
      profilePicture,
      xTenantCode: "",
      employeeId: "",
      profilePicUrl: "",
      firstName: "",
      lastName: "",
      tenantLogoUrl: "",
      tenantName: "",
    };
  }

  try {
    const payload = decodeJwtPayload(accessTokenCookie.value);

    if (!payload) {
      return {
        loggedIn: false,
        role: ["guest"],
        id: "",
        organizationId: "",
        username: "",
        profilePicture,
        xTenantCode: "",
        employeeId: "",
        profilePicUrl: "",
        firstName: "",
        lastName: "",
        tenantLogoUrl: "",
        tenantName: "",
      };
    }

    if (typeof payload.id !== "string" || !payload.id) {
      throw new Error("Invalid 'id' in JWT payload.");
    }
    if (typeof payload.username !== "string" || !payload.username) {
      throw new Error("Invalid 'username' in JWT payload.");
    }
    if (typeof payload.tenantCode !== "string" || !payload.tenantCode) {
    }

    let roles: Role[];
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      roles = payload.roles.map((r: any) => r as Role);
    } else {
      roles = ["guest"];
    }

    return {
      loggedIn: true,
      role: roles,
      id: payload.id as string,
      organizationId: (payload.tenantId || "") as string,
      username: payload.username as string,
      profilePicture,
      xTenantCode: (payload.tenantCode || "") as string,
      accessToken: accessTokenCookie.value,
      employeeId: payload.employeeId as string,
      profilePicUrl: payload.profilePicUrl,
      firstName: payload.firstName,
      lastName: payload.lastName,
      tenantLogoUrl:
        payload.xTenantCode === "beaeka"
          ? "https://www.beaeka.com/wp-content/uploads/2022/08/beaeka-logo-finaghhhgghle-Recovered-2048x749.png"
          : payload.xTenantCode === "minda"
          ? "https://mindabg.com/public/admin/assets/images/settings/gVQiQQwtHB.png"
          : payload.tenantLogoUrl,
      tenantName: payload.tenantName,
    };
  } catch (e: any) {
    return {
      loggedIn: false,
      role: ["guest"],
      id: "",
      organizationId: "",
      username: "",
      profilePicture,
      xTenantCode: "",
      employeeId: "",
      profilePicUrl: "",
      firstName: "",
      lastName: "",
      tenantLogoUrl: "",
      tenantName: "",
    };
  }
}
