"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginArgs = {
  username: string;
  password: string;
  tenantCode: string;
};

const AUTH_API_BASE_URL = "https://auth.api.techbee.et/api";

export async function login({
  username,
  password,
  tenantCode,
}: LoginArgs): Promise<{
  success: boolean;
  message: string;
  mustResetPassword: boolean;
}> {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-code": tenantCode,
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Login failed",
        mustResetPassword: false,
      };
    }

    const data = await response.json();

    (await cookies()).set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    (await cookies()).set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      success: true,
      mustResetPassword: data.mustResetPassword,
      message: "Logged in successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Login failed: ${error.message || "Unknown error"}`,
      mustResetPassword: false,
    };
  }
}

export async function refreshAccessToken(
  tenantCode: string
): Promise<{ success: boolean; accessToken?: string; message?: string }> {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!refreshToken) {
      return { success: false, message: "No refresh token found" };
    }

    const response = await fetch(`${AUTH_API_BASE_URL}/auth/refresh-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
        "x-tenant-code": tenantCode,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();

      (await cookies()).delete("accessToken");
      (await cookies()).delete("refreshToken");
      return {
        success: false,
        message: errorData.message || "Failed to refresh token",
      };
    }

    const data = await response.json();

    (await cookies()).set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { success: true, accessToken: data.accessToken };
  } catch (error: any) {
    console.error("Refresh token error:", error);

    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");
    return {
      success: false,
      message: `Failed to refresh token: ${error.message || "Unknown error"}`,
    };
  }
}

export async function logout(
  tenantCode: string
): Promise<{ success: boolean; message: string }> {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (accessToken) {
      await fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-tenant-code": tenantCode,
        },
      });
    }

    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");

    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: `Logout failed: ${error.message || "Unknown error"}`,
    };
  }
}
