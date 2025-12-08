"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { JobPostingCreateInput } from "@/lib/schemas/recruitment/job-posting";

export default () => {
  return <MaterialTableWrapper schema={JobPostingCreateInput} />;
};
