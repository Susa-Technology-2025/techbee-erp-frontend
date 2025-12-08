// @/lib/schemas/performance.ts should be declared to export all of your schemas
"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { recommendationRuleCreateInputSchema } from "@/lib/schemas/performance/recommendation-rules";

export default () => {
  return <MaterialTableWrapper schema={recommendationRuleCreateInputSchema} />;
};
