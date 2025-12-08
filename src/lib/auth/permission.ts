interface User {
  roleIds: string[];
}

interface Role {
  id: string;
  permissionIds: string[];
}

interface Permission {
  id: string;
  code: string;
}

interface AccessResult {
  hasAccess: boolean;
  error: string | null;
}

export async function canAccess(
  userId: string,
  allowedPermissions: string[]
): Promise<AccessResult> {
  try {
    const userResponse = await fetch(
      `https://auth.api.techbee.et/api/users/${userId}`
    );
    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return {
          hasAccess: false,
          error: `User with ID '${userId}' not found.`,
        };
      }
      return {
        hasAccess: false,
        error: `Failed to fetch user data for ID '${userId}'. Status: ${userResponse.status}`,
      };
    }
    const userData: User = await userResponse.json();

    const rolePromises = userData.roleIds.map((roleId) =>
      fetch(`https://auth.api.techbee.et/api/roles/${roleId}`).then((res) => {
        if (!res.ok)
          throw new Error(
            `Failed to fetch role data for ID '${roleId}'. Status: ${res.status}`
          );
        return res.json();
      })
    );

    const roles: Role[] = await Promise.all(rolePromises);

    const allPermissionIds = roles.flatMap((role) => role.permissionIds);
    const uniquePermissionIds = [...new Set(allPermissionIds)];

    const permissionPromises = uniquePermissionIds.map((permissionId) =>
      fetch(`https://auth.api.techbee.et/api/permissions/${permissionId}`).then(
        (res) => {
          if (!res.ok)
            throw new Error(
              `Failed to fetch permission data for ID '${permissionId}'. Status: ${res.status}`
            );
          return res.json();
        }
      )
    );

    const permissions: Permission[] = await Promise.all(permissionPromises);
    const userPermissionCodes = new Set(permissions.map((p) => p.code));

    const hasAccess = allowedPermissions.some((permissionCode) =>
      userPermissionCodes.has(permissionCode)
    );

    if (!hasAccess) {
      return {
        hasAccess: false,
        error: `Access denied. User does not have any of the required permissions: ${allowedPermissions.join(
          ", "
        )}`,
      };
    }

    return { hasAccess: true, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { hasAccess: false, error: error.message };
    }
    return {
      hasAccess: false,
      error: "An unknown error occurred during permission check.",
    };
  }
}
