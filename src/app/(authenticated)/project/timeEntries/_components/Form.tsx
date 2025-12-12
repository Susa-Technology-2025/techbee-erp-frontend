"use client";
import {
  Box,
  Paper,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState, useEffect } from "react";
import {GeneralSection} from "./GeneralSection"
import {DetailsSection} from "./DetailsSection"
import {FinancialSection} from "./FinancialSection"
import {TimeSection} from "./TimeSection"
import {RelationSection} from "./RelationSection"
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import {  FormResolverErrors } from "./FormResolverErrors";
import { TimeEntryCreateInputFormSchema } from "./schema";
import { transformToPrismaInput } from "./transformToPrismaInput";
import { zodResolver } from "@hookform/resolvers/zod";
export default function TimeEntryCreateInputForm ({
 formMode = "create",
  defaultValues = {},
  invalidateQueryKey = ["data","https://api.techbee.et/api/project/timeEntries"]
}: {
  formMode: "create" | "edit";
  defaultValues: any;
  invalidateQueryKey: string[]
}) {
  const methods = useForm({
    defaultValues,
     resolver: zodResolver(TimeEntryCreateInputFormSchema)
  });
  const { mutate, isPending } = useDataMutation({
    invalidateQueryKey,
    apiEndPoint:
      formMode === "create"
        ? "https://api.techbee.et/api/project/timeEntries"
        : "https://api.techbee.et/api/project/timeEntries/" + defaultValues?.id,
    method: formMode === "create" ? "POST" : "PATCH",
    onError: (error: any) => {
      toast.error("Error: " + (error.message || "Failed to submit form"));
    },
    onSuccess: (message) => {
      toast.success(
        message.message ||
          "Data " +
            (formMode === "create" ? "created" : "updated") +
            " successfully!"
      );
    },
  });
  const [tab, setTab] = useState("General");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
 
 
 const onSubmit = (data: any) => {
    console.log(JSON.stringify(transformToPrismaInput(data)));
    mutate(transformToPrismaInput(data));
  };
  return (
    <FormProvider {...methods}>
      <Toaster />
      <Paper
        component={"form"}
        sx={{
          width: "100%",
          height:  "100%",
          mx: "auto",
          p: { xs: 2, sm: 3 },
          boxShadow:  3,
          borderRadius:  2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              sx={{
                minHeight: 48,
                "& .MuiTab-root": {
                  minHeight: 48,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                  py: 1,
                  px: 2,
                  minWidth: "auto",
                  mr: 1,
                },
              }}
            >
              <Tab
                  label="General"
                  value="General"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Details"
                  value="Details"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Financial"
                  value="Financial"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Time"
                  value="Time"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Relation"
                  value="Relation"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                />
            </TabList>
          </Box>
          <Box
            sx={{
              height: "50vh",
              overflow: "auto",
              scrollbarWidth: "thin",
            }}
          >
             <TabPanel
                  value={"General"}
                  sx={{
                    p: 0,
                    pt: 2,
                    "& .MuiFormControl-root": {
                      mb: 1.5,
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiButton-root": {
                      fontSize: "0.8125rem",
                    },
                  }}
                >
                  <GeneralSection />
                </TabPanel> <TabPanel
                  value={"Details"}
                  sx={{
                    p: 0,
                    pt: 2,
                    "& .MuiFormControl-root": {
                      mb: 1.5,
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiButton-root": {
                      fontSize: "0.8125rem",
                    },
                  }}
                >
                  <DetailsSection />
                </TabPanel> <TabPanel
                  value={"Financial"}
                  sx={{
                    p: 0,
                    pt: 2,
                    "& .MuiFormControl-root": {
                      mb: 1.5,
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiButton-root": {
                      fontSize: "0.8125rem",
                    },
                  }}
                >
                  <FinancialSection />
                </TabPanel> <TabPanel
                  value={"Time"}
                  sx={{
                    p: 0,
                    pt: 2,
                    "& .MuiFormControl-root": {
                      mb: 1.5,
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiButton-root": {
                      fontSize: "0.8125rem",
                    },
                  }}
                >
                  <TimeSection />
                </TabPanel> <TabPanel
                  value={"Relation"}
                  sx={{
                    p: 0,
                    pt: 2,
                    "& .MuiFormControl-root": {
                      mb: 1.5,
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiButton-root": {
                      fontSize: "0.8125rem",
                    },
                  }}
                >
                  <RelationSection />
                </TabPanel>
          </Box>
        </TabContext>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: 1,
            borderColor: "divider",
            mt: 2,
            gap: 2,
          }}
        >
          <FormResolverErrors />
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            variant="contained"
            disabled={isPending}
            loading={isPending}
            sx={{
              minWidth: 100,
              fontSize: "0.8125rem",
              py: 0.75,
              px: 2,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {formMode === "create" ? "Create" : "Update"}
          </Button>
        </Box>
      </Paper>
    </FormProvider>
  );
};