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
import {ApprovalAndBillingSection} from "./ApprovalAndBillingSection"
import {ProgressSection} from "./ProgressSection"
import {ScheduleSection} from "./ScheduleSection"
import {DetailsSection} from "./DetailsSection"
import {AssignmentSection} from "./AssignmentSection"
import {FilesSection} from "./FilesSection"
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import {  FormResolverErrors } from "./FormResolverErrors";
import { MilestoneFormSchema } from "./schema";
import { transformToPrismaInput } from "./transformToPrismaInput";
import { zodResolver } from "@hookform/resolvers/zod";
export default function MilestoneForm ({
 formMode = "create",
  defaultValues = {},
  invalidateQueryKey = ["data","https://api.techbee.et/api/project/milestones"]
}: {
  formMode: "create" | "edit";
  defaultValues: any;
  invalidateQueryKey: string[]
}) {
  const methods = useForm({
    defaultValues,
     resolver: zodResolver(MilestoneFormSchema)
  });
  const { mutate, isPending } = useDataMutation({
    invalidateQueryKey,
    apiEndPoint:
      formMode === "create"
        ? "https://api.techbee.et/api/project/milestones"
        : "https://api.techbee.et/api/project/milestones/" + defaultValues?.id,
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
                  label="ApprovalAndBilling"
                  value="ApprovalAndBilling"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Progress"
                  value="Progress"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Schedule"
                  value="Schedule"
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
                  label="Assignment"
                  value="Assignment"
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                  }}
                /> <Tab
                  label="Files"
                  value="Files"
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
                  value={"ApprovalAndBilling"}
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
                  <ApprovalAndBillingSection />
                </TabPanel> <TabPanel
                  value={"Progress"}
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
                  <ProgressSection />
                </TabPanel> <TabPanel
                  value={"Schedule"}
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
                  <ScheduleSection />
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
                  value={"Assignment"}
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
                  <AssignmentSection />
                </TabPanel> <TabPanel
                  value={"Files"}
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
                  <FilesSection />
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