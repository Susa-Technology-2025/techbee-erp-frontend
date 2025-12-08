"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { approvalFlowSchema } from "@/lib/schemas/core/approval-policy";

export default () => {
  return <MaterialTableWrapper schema={approvalFlowSchema} />;
};
