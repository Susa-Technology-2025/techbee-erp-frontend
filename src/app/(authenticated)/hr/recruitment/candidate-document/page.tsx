"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { candidateDocumentSchema } from "@/lib/schemas/recruitment/candidate-document";

export default () => {
  return <MaterialTableWrapper schema={candidateDocumentSchema} />;
};
