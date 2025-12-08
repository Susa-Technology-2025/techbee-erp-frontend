"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { contractComponentSchema } from "@/lib/schemas/employee/contract-component";

export default () => {
  return <MaterialTableWrapper schema={contractComponentSchema} />;
};
