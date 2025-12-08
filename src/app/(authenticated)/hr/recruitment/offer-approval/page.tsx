"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { OfferApprovalCreateSchema } from "@/lib/schemas/recruitment/offer-approval";

export default () => {
  return <MaterialTableWrapper schema={OfferApprovalCreateSchema} />;
};
