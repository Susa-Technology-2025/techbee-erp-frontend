"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { UserRoleSchema } from "@/lib/schemas/auth/user-roles";
import { userSchema } from "@/lib/schemas/users";

export default () => {
  return <MaterialTableWrapper schema={userSchema} />;
};
