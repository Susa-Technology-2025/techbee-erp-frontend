"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { BackgroundCheckCreateInputSchema } from "@/lib/schemas/recruitment/background-check";

export default () => {
  return <MaterialTableWrapper schema={BackgroundCheckCreateInputSchema} />;
};
