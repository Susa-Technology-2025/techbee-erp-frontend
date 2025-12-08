"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { ReferralCreateSchema } from "@/lib/schemas/recruitment/referrals";

export default () => {
  return <MaterialTableWrapper schema={ReferralCreateSchema} />;
};
