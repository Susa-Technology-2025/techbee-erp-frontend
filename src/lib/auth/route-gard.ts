import { NextRequest, NextResponse } from "next/server";
import { session } from "@/lib/auth/session";
import { protectedRoutes } from "@/lib/auth/protected-routes";

function normalizePath(path: string): string {
  try {
    return new URL("http://dummy.com" + path).pathname;
  } catch {
    return path;
  }
}

export async function handleProtectedRoutes(
  request: NextRequest
): Promise<NextResponse | null> {
  const originalPath = request.nextUrl.pathname;
  const normalizedPath = normalizePath(originalPath.toLowerCase());

  const redirectToSignin = () =>
    NextResponse.redirect(new URL(`/auth/signin`, request.url));

  const redirectToDashboard = () =>
    NextResponse.redirect(new URL(`/dashboard`, request.url));

  const userSession = await session();
  const isAuthPage = normalizedPath.startsWith("/auth");
  const isAuthSigninOrSignup =
    normalizedPath === "/auth" ||
    normalizedPath === "/auth" ||
    normalizedPath === "/auth";

  if (isAuthSigninOrSignup && userSession.loggedIn) {
    return redirectToDashboard();
  }

  if (isAuthPage && !userSession.loggedIn && !isAuthSigninOrSignup) {
    return redirectToSignin();
  }

  const sortedRoutes = [...protectedRoutes].sort(
    (a, b) => b.path.length - a.path.length
  );

  for (const route of sortedRoutes) {
    const routePath = normalizePath(route.path.toLowerCase());
    if (
      normalizedPath === routePath ||
      normalizedPath.startsWith(routePath + "/")
    ) {
      if (!userSession.loggedIn) {
        return redirectToSignin();
      }

      const hasPermission = userSession.role.some((userRole) =>
        route.allowedRoles.includes(userRole)
      );

      if (!hasPermission) {
        return redirectToSignin();
      }

      break;
    }
  }

  return null;
}
