import React from "react";
import { Dialog, Box } from "@mui/material";
import { ReusableFormDrawerProps } from "./types";
import { FormProviderWrapper } from "./formContext";
import { Header } from "./header";
import { Renderer } from "./renderer";
import { ViewOnlyRenderer } from "./viewonly";
import { NotificationProvider } from "./notifications";
import { Footer } from "./footer";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { FieldValues } from "react-hook-form";
export function ReusableFormDrawer<FormValues extends FieldValues>({
  open,
  onClose,
  formMode,
  fieldsComponent,
  apiEndPoint,
  zodSchema,
  viewComponent,
  viewData: initialViewData,
  additionalData,
  queryKeys,
  additionalButtons,
  createButtonName,
  updateButtonName,
  ...restProps
}: ReusableFormDrawerProps<FormValues>) {
  const { data: fetchedViewData, isLoading: viewLoading } =
    useDataQuery<FormValues>({
      apiEndPoint,
      enabled: formMode === "view" && !initialViewData,
    });
  const viewData = initialViewData || fetchedViewData;
  const formAndHeaderProps = {
    open,
    onClose,
    formMode,
    fieldsComponent,
    apiEndPoint,
    zodSchema,
    additionalButtons,
    createButtonName,
    updateButtonName,
    ...restProps,
  };
  return (
    <NotificationProvider>
      <Dialog open={open} onClose={onClose} maxWidth={"lg"}>
        {}
        <FormProviderWrapper<FormValues> props={formAndHeaderProps}>
          {}
          <Header<FormValues> props={formAndHeaderProps} />
          {}
          <Box sx={{ p: 4, flexGrow: 1, overflowY: "auto" }}>
            {formMode === "view" && viewComponent ? (
              <ViewOnlyRenderer<FormValues>
                zodSchema={zodSchema}
                viewComponent={viewComponent}
                data={viewData || ({} as FormValues)}
                loading={viewLoading}
              />
            ) : (
              <Renderer<FormValues> fieldsComponent={fieldsComponent} />
            )}
          </Box>
          {}
          {formMode === "view" &&
            viewComponent &&
            additionalButtons &&
            viewData && (
              <Footer<FormValues>
                apiEndPoint={apiEndPoint}
                additionalButtons={additionalButtons}
                viewData={viewData}
                additionalData={additionalData}
                queryKeys={queryKeys}
              />
            )}
          {}
          {formMode !== "view" && (
            <Footer<FormValues>
              apiEndPoint={apiEndPoint}
              additionalButtons={additionalButtons}
              createButtonName={createButtonName}
              updateButtonName={updateButtonName}
              additionalData={additionalData}
              queryKeys={queryKeys}
            />
          )}
        </FormProviderWrapper>
      </Dialog>
    </NotificationProvider>
  );
}
