"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { otPolicySchema } from "@/lib/schemas/attendance/ot-policy";

export default () => {
  return <MaterialTableWrapper schema={otPolicySchema} />;
};
