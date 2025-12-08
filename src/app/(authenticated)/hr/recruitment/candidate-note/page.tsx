"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { CandidateNoteSchema } from "@/lib/schemas/recruitment/candidate-note";

export default () => {
  return <MaterialTableWrapper schema={CandidateNoteSchema} />;
};
