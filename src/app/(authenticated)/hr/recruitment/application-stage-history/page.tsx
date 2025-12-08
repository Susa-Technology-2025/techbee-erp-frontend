"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { applicationStageHistorySchema } from "@/lib/schemas/recruitment/application-stage-history";

export default function ApplicationStageHistoryPage() {
  return <MaterialTableWrapper schema={applicationStageHistorySchema} />;
}
