"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { leaveTypeSchema } from "@/lib/schemas/leave/settings";

export default () => {
  return <MaterialTableWrapper schema={leaveTypeSchema} />;
};
