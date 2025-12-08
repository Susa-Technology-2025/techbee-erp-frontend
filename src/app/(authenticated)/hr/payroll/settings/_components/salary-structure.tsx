"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { salaryStructureSchema } from "../salary-structure/_schema/salary-structure-schema";

export default () => {
  return <MaterialTableWrapper schema={salaryStructureSchema} />;
};
