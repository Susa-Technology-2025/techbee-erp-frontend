"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { TaxBracketSchema } from "./_schema/tex-bracket-schema";

export default () => {
  return <MaterialTableWrapper schema={TaxBracketSchema} />;
};
