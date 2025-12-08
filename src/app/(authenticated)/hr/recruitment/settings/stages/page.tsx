"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { pipelineStageSchema } from "@/lib/schemas/recruitment/pipeline";

export default () => {
  return <MaterialTableWrapper schema={pipelineStageSchema} />;
};
