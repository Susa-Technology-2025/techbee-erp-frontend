"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { approvalDocumentTypeSchema } from "@/lib/schemas/core/approval-doc-type";

export default () => {
  return <MaterialTableWrapper schema={approvalDocumentTypeSchema} />;
};
