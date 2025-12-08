import { NextRequest, NextResponse } from "next/server";
import { canAccess, getUserPermissions } from "./lib/auth/route-permission";
import { navItems } from "./components/nav-items/nav-links-index";
const links = navItems.map((item) => item.link);
const userInfoCache = new Map<string, { data: any; expiry: number }>();
async function getUserInfo(request: NextRequest) {
  try {
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const tenant = host?.split(".")[0];
    const refreshToken = request.cookies.get("refreshToken")?.value;
    // console.log("Refresh Token From Browser:", refreshToken);
    if (!refreshToken) {
      return null;
    }
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const cacheKey = `${refreshToken}:${userAgent}:${ip}`;
    const cached = userInfoCache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiry > now) {
      return cached.data;
    }
    const refreshUrl = "https://api.techbee.et/api/auth/auth/refresh-token";
    const res = await fetch(refreshUrl, {
      method: "GET",
      headers: {
        "x-tenant-code": tenant,
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });
    const rawText = await res.text();
    if (!res.ok) {
      return null;
    }

    const data = JSON.parse(rawText);
    if (!data) {
      return null;
    }
    userInfoCache.set(cacheKey, { data, expiry: now + 15 * 60 * 1000 });
    return data;
  } catch (err) {
    console.log("refreshing error", JSON.stringify(err));

    return null;
  }
}
export async function proxy(request: NextRequest) {
  try {
    links.push("/super-admin/landing-page");
    links.push("/dashboard");
    const pathname = request.nextUrl.pathname;
    if (!links.includes(pathname)) {
      return NextResponse.next();
    }
    const userInfo = await getUserInfo(request);
    // console.log("user info from refresh request", JSON.stringify(userInfo));
    if (!userInfo) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    const permissions = getUserPermissions(userInfo);
    if (!permissions || permissions.length === 0) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (permissions.includes("super_admin")) {
      return NextResponse.next();
    }
    const allowed = canAccess(pathname, permissions);
    if (!allowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.log("middleware error", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
