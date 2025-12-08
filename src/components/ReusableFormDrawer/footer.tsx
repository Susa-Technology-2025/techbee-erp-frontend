import React from "react";
import { Stack, Button } from "@mui/material";

import { useReusableFormContext } from "./formContext";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import { FieldValues } from "react-hook-form";
import { transformToPrismaInput } from "./prisma-transform";

interface FooterProps<FormValues extends FieldValues> {
  apiEndPoint: string;
  additionalButtons?: (props: { formData: FormValues }) => React.ReactNode;
  createButtonName?: string;
  updateButtonName?: string;
  viewData?: FormValues;
  additionalData?: any;
  queryKeys?: string[];
}

export function Footer<FormValues extends FieldValues>({
  apiEndPoint,
  additionalButtons,
  createButtonName,
  updateButtonName,
  queryKeys,
  additionalData,
}: FooterProps<FormValues>) {
  const { methods, formMode, notify } = useReusableFormContext<FormValues>();
  console.log(
    "zod resolution result",
    JSON.stringify(methods.formState.errors)
  );
  // console.log("before transform result", JSON.stringify(methods.getValues()));
  // console.log(
  //   "after transform result",
  //   JSON.stringify(transformToPrismaInput(methods.getValues()))
  // );

  const createMutation = useDataMutation<FormValues, FormValues>({
    apiEndPoint,
    method: "POST",
    invalidateQueryKey: queryKeys,
    tenantCode: apiEndPoint.includes("landingPages")
      ? methods.getValues("code")
      : undefined,
    fetchWithoutRefresh: true,
    onSuccess: (data) =>
      notify?.({
        type: "success",
        message: data?.message || "Created successfully!",
      }),
    onError: (error) =>
      notify?.({
        type: "error",
        message: (error as any)?.message || "Creation failed",
      }),
  });

  const updateMutation = useDataMutation<FormValues, FormValues>({
    apiEndPoint: `${apiEndPoint}/${(methods.getValues() as any)?.id ?? ""}`,
    method: "PATCH",
    invalidateQueryKey: queryKeys,
    tenantCode: apiEndPoint.includes("landingPages")
      ? methods.getValues("code")
      : undefined,
    fetchWithoutRefresh: true,
    onSuccess: (data) =>
      notify?.({
        type: "success",
        message: data?.message || "Updated successfully!",
      }),
    onError: (error) =>
      notify?.({
        type: "error",
        message: (error as any)?.message || "Update failed",
      }),
  });

  if (formMode === "view") return null;

  const isLoading =
    formMode === "create" ? createMutation.isPending : updateMutation.isPending;
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ p: 2, alignItems: "center", justifyContent: "end" }}
    >
      <Button
        variant="contained"
        onClick={methods.handleSubmit((data) => {
          if (formMode === "create")
            createMutation.mutate(
              transformToPrismaInput({ ...data, ...additionalData })
            );
          else if (formMode === "edit") {
            if (
              apiEndPoint.includes("https://api.techbee.et/api/core/tenants")
            ) {
              const { code, ...data2 } = transformToPrismaInput({
                ...data,
                ...additionalData,
              });
              updateMutation.mutate(data2);
            } else
              updateMutation.mutate(
                transformToPrismaInput({ ...data, ...additionalData })
              );
          }
        })}
        loading={isLoading}
      >
        {formMode === "create"
          ? createButtonName || "Create"
          : updateButtonName || "Update"}
      </Button>

      {additionalButtons &&
        additionalButtons({ formData: methods.getValues() })}
    </Stack>
  );
}
