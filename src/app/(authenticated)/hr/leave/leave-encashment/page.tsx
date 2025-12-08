"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { leaveEncashmentSchema } from "@/lib/schemas/leave/main";

export default () => {
  return <MaterialTableWrapper schema={leaveEncashmentSchema} />;
};
