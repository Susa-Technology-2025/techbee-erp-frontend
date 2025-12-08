"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { salaryStructureRuleSchema } from "../salary-structure-rules/_schema/salary-structure-rules";

export default () => {
  return <MaterialTableWrapper schema={salaryStructureRuleSchema} />;
};
