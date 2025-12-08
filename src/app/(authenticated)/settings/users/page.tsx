"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { userSchema } from "@/lib/schemas/users";

export default () => {
  return (
    <MaterialTableWrapper
      defaultValues={{ password: "" }}
      schema={userSchema}
    />
  );
};
