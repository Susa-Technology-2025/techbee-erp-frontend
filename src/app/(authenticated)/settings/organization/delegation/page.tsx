"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { delegationSchema } from "@/lib/schemas/core/delegation";

export default () => {
  return <MaterialTableWrapper schema={delegationSchema} />;
};
