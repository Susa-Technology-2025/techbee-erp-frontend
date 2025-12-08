"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { pensionPolicySchema } from "./_schema/pension-policy-schema";

export default () => {
  return <MaterialTableWrapper schema={pensionPolicySchema} />;
};
