"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { organizationSchema } from "@/lib/schemas/organization-node";

export default () => {
  return <MaterialTableWrapper schema={organizationSchema} />;
};
