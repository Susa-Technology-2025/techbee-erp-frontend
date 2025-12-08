"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { attendanceRuleSchema } from "./schema/attendanceRules";

export default () => {
  return <MaterialTableWrapper schema={attendanceRuleSchema} />;
};
