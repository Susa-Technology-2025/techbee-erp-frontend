"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { bankAccountSchema } from "./_schema/bank-account-schema";

export default () => {
  return <MaterialTableWrapper schema={bankAccountSchema} />;
};
