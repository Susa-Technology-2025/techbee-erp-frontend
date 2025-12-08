"use client";
import {
  Box,
  Paper,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState, useEffect } from "react";
import {Main} from "./Main"
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
export default ({
  formMode = "create",
  defaultValues = {},
}: {
  formMode: "create" | "edit";
  defaultValues: any;
}) => {
  const methods = useForm({
    defaultValues,
  });
  const { mutate, isPending } = useDataMutation({
    apiEndPoint:
      formMode === "create"
        ? "https://example.com/api"
        : "https://example.com/api/" + defaultValues.id,
    method: formMode === "create" ? "PUT" : "PATCH",
    onError: (error: any) => {
      toast.error("Error: " + (error.message || "Failed to submit form"));
    },
    onSuccess: (message) => {
      toast.success(
        message ||
          "Data " +
            (formMode === "create" ? "created" : "updated") +
            " successfully!"
      );
    },
  });
  const [tab, setTab] = useState("main");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: any) => {
        console.error("Error attempting to enable fullscreen:  " + err.message);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  const onSubmit = (data: any) => {
    mutate(data);
  };
  return (
    <FormProvider {...methods}>
      <Toaster />
      <Paper
        component={"form"}
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          maxWidth: isFullscreen ? "100%" : 800,
          width: isFullscreen ? "100%" : "auto",
          height: isFullscreen ? "100vh" : "auto",
          mx: "auto",
          mt: isFullscreen ? 0 : 3,
          p: { xs: 2, sm: 3 },
          boxShadow: isFullscreen ? 0 : 3,
          borderRadius: isFullscreen ? 0 : 2,
          position: "relative",
          overflow: "auto",
        }}
      >
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                arrayForm
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.5,
                }}
              >
                Testing array fields
              </Typography>
            </Box>
            <IconButton
              onClick={toggleFullscreen}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
              size="small"
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Box>
        </Stack>
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
                  label="main"
                  value="main"
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
              height: isFullscreen ? "calc(100vh - 200px)" : "50vh",
              overflow: "auto",
              scrollbarWidth: "thin",
            }}
          >
             <TabPanel
                  value={"main"}
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
                  <Main />
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
          }}
        >
          <Button
            type="submit"
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