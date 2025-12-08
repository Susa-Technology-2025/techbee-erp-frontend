"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Stack,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PaidIcon from "@mui/icons-material/Paid";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MDEditor from "@uiw/react-md-editor";
import { useDataQuery, useDataMutation } from "@/lib/tanstack/useDataQuery";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAdditionalQuestions } from "@/lib/store/question-slice";
import { session } from "@/lib/auth/session";
import { ReusableFormModal } from "@/components/form-table/reusable-form/form-modal";
import { applySchema } from "@/lib/schemas/recruitment/apply";

// --- Interfaces ---
interface Position {
  id: string;
  title: string;
  code: string;
}

interface RequisitionDetailResponse {
  budget: number | null;
  createdAt: string;
  createdBy: string | null;
  employmentTerm: string;
  id: string;
  jobSummary: string | null;
  languageRequirements: string | null;
  physicalRequirements: string | null;
  position: Position | null;
  qualifications: string[] | null;
  responsibilities: string | null;
  status: string;
  title: string;
  travelRequirement: string | null;
  updatedAt: string;
  vacancyType: string;
  workLocation: string | null;
  workLocationDetail: string | null;
  workSchedule: string | null;
}

interface JobPosting {
  id: string;
  closingDate: string;
  description: string;
  isActive: boolean;
  postingChannels: string[];
  publishedAt: string | null;
  recruiterUserId: string;
  requisition: {
    id: string;
    title: string;
    status: string;
    vacancyType: string;
    employmentTerm: string;
    position: Position | null;
  };
  unpublishedAt: string | null;
  updatedAt: string;
  jobFormTemplateId: string; // Key to link to the form template
}

interface JobDetailDialogProps {
  open: boolean;
  handleClose: () => void;
  job: JobPosting | null;
}

interface ApplicationResponse {
  id: string;
}

// --- Helper Functions ---

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid date";
  }
};

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
    case "active":
      return { color: "success", label: "Active" };
    case "closed":
      return { color: "error", label: "Closed" };
    case "draft":
      return { color: "warning", label: "Draft" };
    default:
      return { color: "default", label: status };
  }
};

const formatBudget = (budget: number | null): string => {
  if (budget === null || budget === undefined || budget === 0)
    return "Not specified / Negotiable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget);
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  if (!value || value.toLowerCase() === "n/a" || value.toLowerCase() === "none")
    return null;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        {icon}
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="body1" fontWeight={600} color="text.primary">
        {value}
      </Typography>
    </Box>
  );
};

interface MarkdownSectionProps {
  title: string;
  source: string | null;
  icon: React.ReactNode;
  themeMode: "light" | "dark";
}

const MarkdownSection = ({
  title,
  source,
  icon,
  themeMode,
}: MarkdownSectionProps) => {
  if (!source) return null;

  return (
    <Box data-color-mode={themeMode}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        {icon}
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor:
            themeMode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.02)",
          border: `1px solid lightgray`,
          "& .wmde-markdown": {
            fontSize: "1rem",
            color: themeMode === "dark" ? "#fff" : "#000",
          },
          "& .wmde-markdown ul, & .wmde-markdown ol": {
            paddingLeft: 2,
          },
          "& .wmde-markdown li": {
            marginBottom: 0.5,
          },
        }}
      >
        <MDEditor.Markdown
          source={source}
          style={{ background: "transparent" }}
        />
      </Box>
    </Box>
  );
};

// --- JobDetailDialog Component ---

const JobDetailDialog = ({ open, handleClose, job }: JobDetailDialogProps) => {
  const theme = useTheme();
  const themeMode = theme.palette.mode;
  const dispatch = useDispatch();

  // 1. ALL HOOK CALLS MUST BE UNCONDITIONAL AT THE TOP
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Fetch Requisition Details
  const {
    data: requisitionDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useDataQuery<RequisitionDetailResponse>({
    // Conditionally provide the URL based on 'job' to avoid errors in fetch setup
    apiEndPoint: job
      ? `https://api.techbee.et/api/hr/jobRequisitions/${job.requisition.id}`
      : "",
    // Only enable the query if the dialog is open AND we have a job object
    enabled: open && !!job,
  });

  // Fetch Templates (Unconditional call)
  const { data: { data: templates } = [] } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/templates",
  });

  // Mutation Hook for Application Submission (Unconditional call)
  const applyMutation = useDataMutation<ApplicationResponse, any>({
    apiEndPoint: "https://api.techbee.et/api/hr/applications",
    method: "POST",
    onSuccess: () => {
      setSubmissionStatus("success");
      setIsApplyModalOpen(false); // Close modal on success
    },
    onError: (error) => {
      console.error("Application submission failed:", error);
      setSubmissionStatus("error");
    },
  });

  // Get selected template (Logic, not a hook, but related to the data flow)
  const selectedTemplate =
    templates?.find((t: any) => t.id === job?.jobFormTemplateId) || null;

  // Set additional questions to Redux store (useEffect is a hook)
  useEffect(() => {
    if (selectedTemplate) {
      dispatch(setAdditionalQuestions(selectedTemplate.questions));
    }
  }, [selectedTemplate, dispatch]);

  // Fetch User Session Data (useEffect is a hook)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await session();
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    };
    fetchUserData();
  }, []); // Run once on mount

  // 2. CONDITIONAL RETURN (SAFE NOW)
  if (!job) {
    return null;
  }

  // 3. Handlers and Derived State

  const handleApplyClick = () => {
    setSubmissionStatus("idle");
    setIsApplyModalOpen(true);
  };

  const handleApplyModalClose = () => {
    setIsApplyModalOpen(false);
    // Note: You can optionally reset the form state here if necessary
  };

  const handleFormSubmit = async (formData: any) => {
    // Call the mutation hook with the form data
    try {
      await applyMutation.mutateAsync(formData);
    } catch (e) {
      // Error handled in onError callback of mutation
    }
  };

  const isJobClosed = job.requisition.status.toLowerCase() === "closed";
  const isDeadlinePassed = job.closingDate
    ? new Date(job.closingDate).getTime() < new Date().getTime()
    : false;

  const showApplyButton = !isJobClosed && !isDeadlinePassed;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[24],
          },
        }}
      >
        {/* --- Dialog Header --- */}
        <DialogTitle sx={{ m: 0, p: 3, pb: 2 }}>
          <Typography
            variant="caption"
            color="primary.main"
            fontWeight={700}
            letterSpacing={1}
            textTransform="uppercase"
          >
            {job.requisition.vacancyType || "Vacancy"}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={700} mt={0.5}>
            {job.requisition.title || "Untitled Position"}
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={0.5}>
            {job.requisition.position?.title || "Position Not Specified"}
          </Typography>

          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        {/* --- Dialog Content --- */}
        <DialogContent sx={{ p: 4 }}>
          {isDetailLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress size={40} />
            </Box>
          ) : isDetailError || !requisitionDetail ? (
            <Alert severity="warning">
              Failed to load detailed requisition information.
            </Alert>
          ) : (
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={4}>
                  <MarkdownSection
                    title="Job Description / Summary"
                    source={job.description || requisitionDetail.jobSummary}
                    icon={<WorkOutlineIcon color="primary" fontSize="medium" />}
                    themeMode={themeMode}
                  />

                  {requisitionDetail.responsibilities && (
                    <MarkdownSection
                      title="Key Responsibilities"
                      source={requisitionDetail.responsibilities}
                      icon={
                        <CheckCircleOutlineIcon
                          color="primary"
                          fontSize="medium"
                        />
                      }
                      themeMode={themeMode}
                    />
                  )}

                  {requisitionDetail.qualifications &&
                    requisitionDetail.qualifications.length > 0 && (
                      <Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          mb={2}
                        >
                          <SchoolIcon color="primary" fontSize="medium" />
                          <Typography variant="h5" fontWeight={700}>
                            Minimum Qualifications
                          </Typography>
                        </Stack>
                        <Stack spacing={1} sx={{ pl: 1 }}>
                          {requisitionDetail.qualifications.map((q, index) => (
                            <Stack
                              key={index}
                              direction="row"
                              alignItems="flex-start"
                              spacing={1}
                            >
                              <Typography variant="body1">•</Typography>
                              <Typography variant="body1">{q}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    )}

                  <Box>
                    <Stack spacing={3}>
                      <MarkdownSection
                        title="Language Requirements"
                        source={requisitionDetail.languageRequirements}
                        icon={<LanguageIcon color="action" fontSize="small" />}
                        themeMode={themeMode}
                      />

                      <MarkdownSection
                        title="Physical Requirements"
                        source={requisitionDetail.physicalRequirements}
                        icon={
                          <FitnessCenterIcon color="action" fontSize="small" />
                        }
                        themeMode={themeMode}
                      />

                      <MarkdownSection
                        title="Travel Requirement"
                        source={requisitionDetail.travelRequirement}
                        icon={
                          <FlightTakeoffIcon color="action" fontSize="small" />
                        }
                        themeMode={themeMode}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack
                  spacing={3}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    Job Snapshot
                  </Typography>

                  <Divider />

                  <DetailItem
                    icon={<WorkOutlineIcon color="action" fontSize="small" />}
                    label="Employment Term"
                    value={requisitionDetail.employmentTerm}
                  />

                  <DetailItem
                    icon={<PaidIcon color="action" fontSize="small" />}
                    label="Budget/Salary"
                    value={formatBudget(requisitionDetail.budget)}
                  />

                  <DetailItem
                    icon={<LocationOnIcon color="action" fontSize="small" />}
                    label="Work Location"
                    value={
                      requisitionDetail.workLocationDetail ||
                      requisitionDetail.workLocation
                    }
                  />

                  <Divider />

                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Admin Info
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        **Requisition ID:** {requisitionDetail.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        **Vacancy Type:**{" "}
                        {requisitionDetail.vacancyType || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        **Published On:**{" "}
                        {formatDate(job.publishedAt || "") || "N/A"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}

          {submissionStatus === "success" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your application has been submitted successfully!
            </Alert>
          )}
          {submissionStatus === "error" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              There was an error submitting your application. Please try again.
            </Alert>
          )}
        </DialogContent>

        {/* --- Dialog Actions (Footer) --- */}
        <DialogActions
          sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Close
          </Button>
          {showApplyButton ? (
            <Button
              onClick={handleApplyClick}
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 150 }}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Apply Now"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              disabled
              sx={{ minWidth: 150 }}
            >
              {isDeadlinePassed ? "Deadline Passed" : "Job Closed"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* --- Application Form Modal (Opens Over the Dialog) --- */}
      {isApplyModalOpen && (
        <ReusableFormModal
          schema={applySchema}
          title={"Application Form"}
          formMode="create"
          defaultValues={{
            posting: { id: job?.id },
            candidate: { firstName, fatherName: lastName },
          }}
          disabledValues={{
            "posting.id": true,
            "candidate.firstName": true,
            "candidate.fatherName": true,
          }}
          sections={applySchema.meta().sections}
          onClose={handleApplyModalClose}
          onSubmit={handleFormSubmit}
          open={isApplyModalOpen}
          isSubmitting={applyMutation.isPending}
        />
      )}
    </>
  );
};

export default JobDetailDialog;
