"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { complianceAuditSchema } from "../_schema/compliance-audit";

export default () => {
  return <MaterialTableWrapper schema={complianceAuditSchema} />;
};
