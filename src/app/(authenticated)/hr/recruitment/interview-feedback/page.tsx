"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { interviewFeedbackSchema } from "@/lib/schemas/recruitment/interview-feedback";

export default () => {
  return <MaterialTableWrapper schema={interviewFeedbackSchema} />;
};
