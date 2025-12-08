// @/lib/schemas/performance.ts should be declared to export all of your schemas
"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { incidentSchema } from "@/lib/schemas/performance";

export default () => {
  return <MaterialTableWrapper schema={incidentSchema} />;
};
