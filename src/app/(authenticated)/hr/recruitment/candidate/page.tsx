"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { candidateSchema } from "@/lib/schemas/recruitment/candidate";

export default () => {
  return <MaterialTableWrapper schema={candidateSchema} />;
};
