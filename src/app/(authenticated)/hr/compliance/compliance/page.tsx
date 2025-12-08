"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { complianceSchema } from "../_schema/compliance";

export default () => {
  return <MaterialTableWrapper schema={complianceSchema} />;
};
