"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { ApplicationCreateInput } from "@/lib/schemas/recruitment/application";

export default () => {
  return <MaterialTableWrapper schema={ApplicationCreateInput} />;
};
