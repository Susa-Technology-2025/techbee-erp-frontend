"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { complianceTaskSchema } from "../_schema/compliance-task";

export default () => {
  return <MaterialTableWrapper schema={complianceTaskSchema} />;
};
