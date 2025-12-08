"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { AttendanceDeviceSchema } from "./schema/attendanceDevice";

export default () => {
  return <MaterialTableWrapper schema={AttendanceDeviceSchema} />;
};
