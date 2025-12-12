"use client";
import { Toaster } from "react-hot-toast";
import MaterialTableWrapper from "./_components/Table";
export default ({ idString, defaultValues,invalidateQueryKey }: { idString?: string,defaultValues?:any ,invalidateQueryKey: string[]}) => {
  return (
    <>
      <Toaster />
      <MaterialTableWrapper idString={idString} defaultValues={defaultValues} 
      invalidateQueryKey={[
          "data",
          ...(Array.isArray(invalidateQueryKey) ? invalidateQueryKey : []),
          "https://api.techbee.et/api/auth/userProfiles" + idString,
        ].filter((v): v is string => Boolean(v))}
      />;
    </>
  );
};