"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { AssessmentResultCreateInputSchema } from "@/lib/schemas/recruitment/assesment-result";

export default function AssessmentResultPage() {
  return <MaterialTableWrapper schema={AssessmentResultCreateInputSchema} />;
}
