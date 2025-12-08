"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { titleSchema } from "@/lib/schemas/title";

export default () => {
  return <MaterialTableWrapper schema={titleSchema} />;
};
