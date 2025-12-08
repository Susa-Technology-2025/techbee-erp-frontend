"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { PermissionSchema } from "@/lib/schemas/auth/permissions";

export default () => {
  return <MaterialTableWrapper schema={PermissionSchema} />;
};
