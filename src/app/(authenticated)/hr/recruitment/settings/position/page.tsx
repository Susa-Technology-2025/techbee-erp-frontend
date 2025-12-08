"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { positionSchema } from "@/lib/schemas/position";

export default () => {
  return <MaterialTableWrapper schema={positionSchema} />;
};
