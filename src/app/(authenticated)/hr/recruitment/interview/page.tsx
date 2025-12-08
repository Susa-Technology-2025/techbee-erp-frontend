"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { interviewSchema } from "@/lib/schemas/recruitment/interview";

export default () => {
  return <MaterialTableWrapper schema={interviewSchema} />;
};
