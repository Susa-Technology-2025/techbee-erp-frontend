const routes = ["/hr", "/hr/employees", "hr/recruitment/*", "/hr/*"];

export const routePermissions = routes.map((item) => ({
  route: item,
  permissions: ["View HR Dashboard"],
}));

export function canAccess(route: string, userPermissions: string[]): boolean {
  if (!route || !Array.isArray(userPermissions)) return false;

  const routePermission = routePermissions.find((r) => r.route === route);
  if (!routePermission || !Array.isArray(routePermission.permissions))
    return false;

  return routePermission.permissions.some((p) => userPermissions.includes(p));
}

export function getUserPermissions(decodedToken: any): string[] {
  if (!decodedToken || typeof decodedToken !== "object") return [];
  if (!Array.isArray(decodedToken.permissions)) return [];
  return decodedToken.permissions.filter((p: string) => typeof p === "string");
}
