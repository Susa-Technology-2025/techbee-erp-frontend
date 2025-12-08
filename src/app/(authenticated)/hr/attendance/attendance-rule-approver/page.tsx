"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { attendanceRuleApproverSchema } from "./schema/AttendanceRuleApprover";

export default () => {
  return <MaterialTableWrapper schema={attendanceRuleApproverSchema} />;
};
