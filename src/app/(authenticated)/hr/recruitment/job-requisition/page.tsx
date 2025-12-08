"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { JobRequisitionCreateInputSchema } from "@/lib/schemas/recruitment/job-req";

export default () => {
  return <MaterialTableWrapper schema={JobRequisitionCreateInputSchema} />;
};
