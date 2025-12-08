"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { approvalGroupSchema } from "@/lib/schemas/core/approval-group";

export default () => {
  return <MaterialTableWrapper schema={approvalGroupSchema} />;
};
