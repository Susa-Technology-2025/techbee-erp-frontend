"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { contractSchema } from "@/lib/schemas/contracts";

export default () => {
  return <MaterialTableWrapper schema={contractSchema} />;
};
