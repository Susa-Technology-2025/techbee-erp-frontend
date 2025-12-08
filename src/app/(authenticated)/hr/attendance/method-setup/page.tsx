"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { attendanceMethodSettingSchema } from "./schema/methdSetup";

export default () => {
  return <MaterialTableWrapper schema={attendanceMethodSettingSchema} />;
};
