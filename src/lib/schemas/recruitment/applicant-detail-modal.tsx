"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Check,
  Close,
  Score,
  HistoryToggleOff,
  Person,
  PostAdd,
  Quiz,
  ExpandMore,
  Edit,
  Delete,
  Add,
  Forward,
  CalendarMonth,
} from "@mui/icons-material";
import { useDataQuery, useDataMutation } from "@/lib/tanstack/useDataQuery";
import { ReusableFormModal } from "@/components/form-table/reusable-form/form-modal";
import { interviewSchema } from "./interview";

// --- Constants & Types ---

const APPLICATION_STATUSES = [
  "New",
  "Qualified",
  "Interview",
  "Offer",
  "ContractSigned",
  "Rejected",
  "OnHold",
  "Archived",
];

interface PipelineStage {
  id: string;
  name: string;
  isTerminal: boolean;
  createdAt: string;
  sequence: number;
  status: string;
}

interface PipelineStagesResponse {
  data: PipelineStage[];
}

interface CurrentStage {
  id: string;
  name?: string;
  sequence?: number;
  status?: string;
}

interface AssessmentResult {
  id: string;
  maxScore: number;
  name: string;
  remarks: string;
  score: number;
  takenAt: string;
  stage: { id: string; name: string };
}

interface AssessmentsResponse {
  data: AssessmentResult[];
}

interface ApplicationUpdateResponse {
  message: string;
  currentStage: CurrentStage;
}

interface MoveStagePayload {
  currentStage: {
    id: string;
  };
  requisition: {
    id: string;
  };
}

interface ScorePayload {
  application?: {
    id: string;
  };
  maxScore: number;
  name: string;
  remarks: string;
  score: number;
  stage: {
    id: string;
  };
  takenAt: string;
}

interface Question {
  code: string;
  question: string;
  section: string;
  required: boolean;
  answerType: string;
  min?: number;
  max?: number;
  weight?: number;
  weighted?: boolean;
}

interface Candidate {
  id: string;
  firstName: string;
  fatherName: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  consentGiven: boolean;
  documents: string[];
  notes: string[];
  referrals: string[];
}

interface Interview {
  id: string;
  scheduledAt: string;
  durationMin: number;
  type: string;
  location: string;
}

interface Requisition {
  id: string;
  title: string;
  status: string;
  employmentTerm: string;
  vacancyType: string;
  qualifications: string[];
  workSchedule: {
    name: string;
    avgHoursPerDay: number;
  } | null;
  position: {
    title: string;
    code: string;
  } | null;
  postings: Array<{
    id: string;
    jobPostingText: string;
    jobFormTemplate: {
      id: string;
      code: string;
      title: string;
      questions: Question[];
    };
  }>;
}

interface ApplicationData {
  id: string;
  appliedAt: string;
  background: any | null;
  candidate: Candidate;
  currentStage: CurrentStage | null;
  offer: any | null;
  refuseReason: string | null;
  requisition: Requisition;
  answers: Record<string, any>;
  interviews: Interview[];
}

interface ApplicationDetailsDialogProps {
  row: ApplicationData;
  open: boolean;
  handleClose: () => void;
}

// --- Utility Functions ---

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAnswer = (question: Question, answer: any): string => {
  if (answer === null || answer === undefined) return "Not answered";
  if (
    question.answerType === "number" &&
    question.min !== undefined &&
    question.max !== undefined
  ) {
    return `${answer} (Scale: ${question.min}-${question.max})`;
  }
  return answer.toString();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Qualified":
      return "success";
    case "Interview":
      return "info";
    case "Offer":
    case "ContractSigned":
      return "primary";
    case "Rejected":
    case "Archived":
      return "error";
    case "OnHold":
      return "warning";
    default:
      return "default";
  }
};

const calculateFinalAssessmentResult = (
  assessments: AssessmentResult[]
): { totalScore: number; totalMaxScore: number; averagePercentage: number } => {
  if (assessments.length === 0) {
    return { totalScore: 0, totalMaxScore: 0, averagePercentage: 0 };
  }

  const totalScore = assessments.reduce((sum, a) => sum + a.score, 0);
  const totalMaxScore = assessments.reduce((sum, a) => sum + a.maxScore, 0);
  const averagePercentage =
    totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

  return { totalScore, totalMaxScore, averagePercentage };
};

// =================================================================
// --- Schedule Interview Modal Component ---
// =================================================================

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  applicationData: ApplicationData;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  open,
  onClose,
  applicationData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Schedule Interview Action (Sample)</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          This is a sample modal to trigger the Schedule Interview process. In a
          real application, this would contain a form to set the date, time, and
          location.
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: "grey.100" }}>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {JSON.stringify(applicationData, null, 2)}
          </pre>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =================================================================
// --- Edit/Add Score Modal Component ---
// =================================================================

interface ScoreModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  stage: PipelineStage;
  assessment?: AssessmentResult | null;
  onSuccess: () => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({
  open,
  onClose,
  applicationId,
  stage,
  assessment,
  onSuccess,
}) => {
  const isEdit = !!assessment;
  const dialogTitle = isEdit
    ? "Edit Assessment Score"
    : "Add New Assessment Score";
  const buttonText = isEdit ? "Save Changes" : "Save Score";
  const apiEndpoint = isEdit
    ? `https://api.techbee.et/api/hr/assessmentResults/${assessment.id}`
    : "https://api.techbee.et/api/hr/assessmentResults";
  const method = isEdit ? "PATCH" : "POST";

  const [name, setName] = useState(assessment?.name || "");
  const [score, setScore] = useState<number | string>(assessment?.score || "");
  const [maxScore, setMaxScore] = useState<number | string>(
    assessment?.maxScore || ""
  );
  const [remarks, setRemarks] = useState(assessment?.remarks || "");
  const [error, setError] = useState("");

  const scoreMutation = useDataMutation<any, ScorePayload>({
    apiEndPoint: apiEndpoint,
    method: method,
    onSuccess: () => {
      onClose();
      onSuccess();
      setError("");
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to save score.";
      setError(errorMessage);
    },
  });

  useEffect(() => {
    if (open) {
      setName(assessment?.name || "");
      setScore(assessment?.score || "");
      setMaxScore(assessment?.maxScore || "");
      setRemarks(assessment?.remarks || "");
      setError("");
    }
  }, [open, assessment]);

  const isScoreValid = useCallback(() => {
    const numScore = Number(score);
    const numMaxScore = Number(maxScore);

    if (numScore < 0) {
      setError("Score cannot be negative.");
      return false;
    }
    if (numMaxScore <= 0) {
      setError("Maximum score must be greater than zero.");
      return false;
    }
    if (numScore > numMaxScore) {
      setError("Score cannot be higher than the maximum score.");
      return false;
    }
    return true;
  }, [score, maxScore]);

  const handleSubmit = () => {
    setError("");
    if (!name || score === "" || maxScore === "") {
      setError("Please fill in assessment name, score, and max score.");
      return;
    }

    if (!isScoreValid()) {
      return;
    }

    const basePayload: ScorePayload = {
      maxScore: Number(maxScore),
      name: name,
      remarks: remarks,
      score: Number(score),
      stage: { id: stage.id },
      takenAt: new Date().toISOString(),
    };

    const payload = isEdit
      ? basePayload
      : { ...basePayload, application: { id: applicationId } };

    scoreMutation.mutate(payload);
  };

  const isSubmitting = scoreMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography variant="subtitle2" color="primary">
            Stage: {stage.name}
          </Typography>

          <TextField
            label="Assessment Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Score"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                fullWidth
                required
                disabled={isSubmitting}
                inputProps={{ min: 0 }}
                error={
                  Number(score) > Number(maxScore) ||
                  (error.includes("higher") && score !== "")
                }
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Max Score"
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                fullWidth
                required
                disabled={isSubmitting}
                inputProps={{ min: 1 }}
                error={
                  Number(maxScore) <= 0 ||
                  (error.includes("greater than zero") && maxScore !== "")
                }
              />
            </Grid>
          </Grid>

          <TextField
            label="Remarks (Optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            multiline
            rows={3}
            fullWidth
            disabled={isSubmitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isSubmitting || !name || score === "" || maxScore === ""}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : isEdit ? (
              <Edit />
            ) : (
              <Score />
            )
          }
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =================================================================
// --- Delete Confirmation Modal Component ---
// =================================================================

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  assessment: AssessmentResult;
  onSuccess: () => void;
  setAlertMessage: (
    message: { type: "success" | "error" | "info"; message: string } | null
  ) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  assessment,
  onSuccess,
  setAlertMessage,
}) => {
  const deleteMutation = useDataMutation({
    apiEndPoint: `https://api.techbee.et/api/hr/assessmentResults/${assessment.id}`,
    method: "DELETE",
    onSuccess: () => {
      setAlertMessage({
        type: "success",
        message: `Assessment '${assessment.name}' deleted successfully.`,
      });
      onClose();
      onSuccess();
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to delete score.";
      setAlertMessage({
        type: "error",
        message: errorMessage,
      });
      onClose();
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({});
  };

  const isDeleting = deleteMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the assessment{" "}
          <Typography component="span" fontWeight="bold">
            "{assessment.name}"
          </Typography>{" "}
          with a score of{" "}
          <Typography component="span" fontWeight="bold" color="primary">
            {assessment.score}/{assessment.maxScore}
          </Typography>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={
            isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Delete />
            )
          }
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =================================================================
// --- MoveStageModal Component ---
// =================================================================

interface MoveStageModalProps {
  open: boolean;
  onClose: () => void;
  requisitionId: string;
  currentStage: CurrentStage | null;
  stages: PipelineStage[];
  isStagesLoading: boolean;
  onStageMove: (stageId: string) => void;
  isMoving: boolean;
}

const MoveStageModal: React.FC<MoveStageModalProps> = ({
  open,
  onClose,
  currentStage,
  stages,
  isStagesLoading,
  onStageMove,
  isMoving,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(
    currentStage?.id || ""
  );

  const handleStageClick = (stageId: string) => {
    setSelectedStageId(stageId);
  };

  const handleConfirmMove = () => {
    if (selectedStageId) {
      onStageMove(selectedStageId);
    } else {
      console.error("No stage selected.");
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedStageId(currentStage?.id || "");
    }
  }, [open, currentStage]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Application Stage</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Typography variant="body1" color="text.secondary">
            Select the new pipeline stage to move the application to.
          </Typography>

          {isStagesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {stages.map((stage) => {
                const isCurrentStage = currentStage?.id === stage.id;
                const isDisabled = isMoving;
                const isSelected = selectedStageId === stage.id;

                return (
                  <Grid size={{ xs: 12, md: 6 }} key={stage.id}>
                    <Button
                      fullWidth
                      variant={
                        isCurrentStage || isSelected ? "contained" : "outlined"
                      }
                      color={
                        isCurrentStage || isSelected ? "primary" : "inherit"
                      }
                      onClick={() => handleStageClick(stage.id)}
                      disabled={isDisabled}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      {stage.sequence}. {stage.name}
                      {isCurrentStage && " (Current)"}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmMove}
          color="success"
          variant="contained"
          disabled={isMoving || !selectedStageId}
          startIcon={
            isMoving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Forward />
            )
          }
        >
          Confirm Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =================================================================
// --- StageAndActionsTabContent (Refactored) ---
// =================================================================

interface StageAndActionsTabProps {
  row: ApplicationData;
  stages: PipelineStage[];
  fullCurrentStage: CurrentStage | null;
  isStagesLoading: boolean;
  isAssessmentsLoading: boolean;
  assessments: AssessmentResult[];
  refetchAssessments: () => void;
  moveStageMutation: any;
  onStageMove: (stageId: string) => void;
  setAlertMessage: (
    message: { type: "success" | "error" | "info"; message: string } | null
  ) => void;
  handleOpenScheduleModal: () => void;
  finalAssessmentResult: ReturnType<typeof calculateFinalAssessmentResult>;
}

const StageAndActionsTabContent: React.FC<StageAndActionsTabProps> = ({
  row,
  stages,
  fullCurrentStage,
  isStagesLoading,
  isAssessmentsLoading,
  assessments,
  refetchAssessments,
  moveStageMutation,
  onStageMove,
  setAlertMessage,
  handleOpenScheduleModal,
  finalAssessmentResult,
}) => {
  const { id: applicationId } = row;

  const [expanded, setExpanded] = useState<string | false>(
    fullCurrentStage?.id || false
  );
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStageForScore, setSelectedStageForScore] =
    useState<PipelineStage | null>(null);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentResult | null>(null);

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleOpenMoveModal = () => setIsMoveModalOpen(true);
  const handleCloseMoveModal = () => {
    setAlertMessage(null);
    setIsMoveModalOpen(false);
  };

  const handleOpenAddScoreModal = (stage: PipelineStage) => {
    setSelectedStageForScore(stage);
    setIsScoreModalOpen(true);
  };

  const handleOpenEditScoreModal = (
    stage: PipelineStage,
    assessment: AssessmentResult
  ) => {
    setSelectedStageForScore(stage);
    setSelectedAssessment(assessment);
    setIsEditScoreModalOpen(true);
  };

  const handleCloseScoreModals = () => {
    setIsScoreModalOpen(false);
    setIsEditScoreModalOpen(false);
    setSelectedStageForScore(null);
    setSelectedAssessment(null);
  };

  const handleOpenDeleteModal = (assessment: AssessmentResult) => {
    setSelectedAssessment(assessment);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAssessment(null);
  };

  const groupedAssessments = assessments.reduce((acc, assessment) => {
    const stageId = assessment.stage.id;
    if (!acc[stageId]) {
      acc[stageId] = [];
    }
    acc[stageId].push(assessment);
    return acc;
  }, {} as Record<string, AssessmentResult[]>);

  const upcomingInterviews = row.interviews
    .filter((interview) => new Date(interview.scheduledAt) > new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  const pastInterviews = row.interviews
    .filter((interview) => new Date(interview.scheduledAt) <= new Date())
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  const hasScheduledInterview = row.interviews.length > 0;

  const sortedStages = useMemo(
    () => [...stages].sort((a, b) => a.sequence - b.sequence),
    [stages]
  );

  return (
    <Stack spacing={3}>
      {/* Overall Assessment Result */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" color="info.main">
              Overall Assessment Result (All Stages)
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "right" }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {finalAssessmentResult.totalScore} /{" "}
              {finalAssessmentResult.totalMaxScore}
            </Typography>
            {finalAssessmentResult.totalMaxScore > 0 && (
              <Typography variant="body2" color="text.secondary">
                ({finalAssessmentResult.averagePercentage.toFixed(1)}% Total
                Average)
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Global Actions */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Status:{" "}
              <Chip
                label={fullCurrentStage?.status || "N/A"}
                size="small"
                color={getStatusColor(fullCurrentStage?.status || "default")}
                sx={{ ml: 1, fontWeight: "bold" }}
              />
            </Typography>
            <Typography variant="body2">
              Use the button to move the application to a different stage in the
              pipeline.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: "right" }}>
            <Button
              onClick={handleOpenMoveModal}
              color="success"
              startIcon={<Forward />}
              variant="contained"
              disabled={moveStageMutation.isPending}
            >
              Update Stage
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Pipeline Stages Accordion */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Pipeline Stages & Actions
        </Typography>
        {isStagesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : sortedStages.length === 0 ? (
          <Alert severity="warning">No pipeline stages configured.</Alert>
        ) : (
          <Stack spacing={1}>
            {sortedStages.map((stage) => {
              const isCurrent = stage.id === fullCurrentStage?.id;
              const assessmentResults = groupedAssessments[stage.id] || [];
              const isInterviewStage = stage.status === "Interview";
              const canScheduleInterview =
                isInterviewStage && !hasScheduledInterview;

              return (
                <Accordion
                  key={stage.id}
                  expanded={expanded === stage.id}
                  onChange={handleAccordionChange(stage.id)}
                  variant="outlined"
                  sx={{
                    border: isCurrent
                      ? `2px solid ${getStatusColor(stage.status)}.main`
                      : "1px solid",
                    borderColor: isCurrent
                      ? `${getStatusColor(stage.status)}.main`
                      : "divider",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`${stage.id}-content`}
                    id={`${stage.id}-header`}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body1" fontWeight="bold">
                        {stage.sequence}. {stage.name}
                      </Typography>
                      {isCurrent && (
                        <Chip
                          label="CURRENT"
                          size="small"
                          color="primary"
                          sx={{
                            bgcolor: `${getStatusColor(stage.status)}.main`,
                            color: "white",
                          }}
                        />
                      )}
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack spacing={3}>
                      {/* Interview Management Section (only for Interview status stages) */}
                      {isInterviewStage && (
                        <>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Interview Action
                              </Typography>
                              {canScheduleInterview ? (
                                <Button
                                  onClick={handleOpenScheduleModal}
                                  startIcon={<CalendarMonth />}
                                  variant="contained"
                                  color="info"
                                >
                                  Schedule Interview
                                </Button>
                              ) : (
                                <Chip
                                  label="Interview(s) scheduled"
                                  size="medium"
                                  color="success"
                                  icon={<Check />}
                                />
                              )}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} />
                          </Grid>
                          <Divider />
                        </>
                      )}

                      {/* Assessments Section */}
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6">Stage Scores</Typography>
                          <Button
                            onClick={() => handleOpenAddScoreModal(stage)}
                            startIcon={<Add />}
                            variant="outlined"
                            size="small"
                            color="secondary"
                          >
                            Add Score
                          </Button>
                        </Box>
                        {isAssessmentsLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 2,
                            }}
                          >
                            <CircularProgress size={20} />
                          </Box>
                        ) : assessmentResults.length === 0 ? (
                          <Alert severity="info" variant="outlined">
                            No assessment scores recorded for this stage.
                          </Alert>
                        ) : (
                          <Stack
                            divider={<Divider />}
                            spacing={1}
                            sx={{
                              border: "1px solid #eee",
                              borderRadius: 1,
                              p: 1,
                            }}
                          >
                            {assessmentResults.map((result) => (
                              <Box key={result.id} sx={{ p: 1 }}>
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                    >
                                      {result.name}
                                    </Typography>
                                    <Chip
                                      label={`Score: ${result.score}/${result.maxScore}`}
                                      size="small"
                                      color={
                                        result.score >= result.maxScore / 2
                                          ? "success"
                                          : "warning"
                                      }
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 10, md: 6 }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Remarks: {result.remarks || "N/A"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.disabled"
                                    >
                                      Taken:{" "}
                                      {new Date(
                                        result.takenAt
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    size={{ xs: 2, md: 2 }}
                                    sx={{ textAlign: "right" }}
                                  >
                                    <Tooltip title="Edit Assessment">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleOpenEditScoreModal(
                                            stage,
                                            result
                                          )
                                        }
                                        color="primary"
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Assessment">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleOpenDeleteModal(result)
                                        }
                                        color="error"
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}
                          </Stack>
                        )}
                      </Box>

                      {/* Interviews Section (only for Interview status stages) */}
                      {isInterviewStage && (
                        <>
                          <Divider />
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              Scheduled Interviews
                            </Typography>
                            {row.interviews.length === 0 ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No interviews scheduled for this application.
                              </Typography>
                            ) : (
                              <Stack spacing={1}>
                                {upcomingInterviews.map((i) => (
                                  <Chip
                                    key={i.id}
                                    icon={<CalendarMonth fontSize="small" />}
                                    label={`${i.type}: ${formatDate(
                                      i.scheduledAt
                                    )} at ${i.location || "TBD"}`}
                                    size="medium"
                                    variant="outlined"
                                    color="info"
                                  />
                                ))}
                                {pastInterviews.map((i) => (
                                  <Chip
                                    key={i.id}
                                    label={`${i.type}: ${formatDate(
                                      i.scheduledAt
                                    )} (Past)`}
                                    size="small"
                                    variant="filled"
                                  />
                                ))}
                              </Stack>
                            )}
                          </Box>
                        </>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Modals for Score Management and Stage Movement */}
      {selectedStageForScore && (
        <ScoreModal
          open={isScoreModalOpen}
          onClose={handleCloseScoreModals}
          applicationId={applicationId}
          stage={selectedStageForScore}
          onSuccess={refetchAssessments}
        />
      )}
      {selectedAssessment && selectedStageForScore && (
        <ScoreModal
          open={isEditScoreModalOpen}
          onClose={handleCloseScoreModals}
          applicationId={applicationId}
          stage={selectedStageForScore}
          assessment={selectedAssessment}
          onSuccess={refetchAssessments}
        />
      )}
      {selectedAssessment && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          assessment={selectedAssessment}
          onSuccess={refetchAssessments}
          setAlertMessage={setAlertMessage}
        />
      )}
      <MoveStageModal
        open={isMoveModalOpen}
        onClose={handleCloseMoveModal}
        requisitionId={row.requisition.id}
        currentStage={fullCurrentStage}
        stages={stages}
        isStagesLoading={isStagesLoading}
        onStageMove={onStageMove}
        isMoving={moveStageMutation.isPending}
      />
    </Stack>
  );
};

// 2. CandidateDetailsTabContent (No change)
interface CandidateDetailsTabProps {
  candidate: Candidate;
  requisition: Requisition;
}

const CandidateDetailsTabContent: React.FC<CandidateDetailsTabProps> = ({
  candidate,
  requisition,
}) => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact and Personal Details
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1">
              {candidate.firstName} {candidate.fatherName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {candidate.email || "No email"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">
              {candidate.phone || "No phone"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Consent Given
            </Typography>
            <Chip
              icon={candidate.consentGiven ? <Check /> : <Close />}
              label={candidate.consentGiven ? "Yes" : "No"}
              color={candidate.consentGiven ? "success" : "error"}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>

    {(candidate.tags.length > 0 ||
      candidate.documents.length > 0 ||
      candidate.notes.length > 0) && (
      <Grid container spacing={3}>
        {candidate.tags.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {candidate.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}

        {candidate.documents.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                {candidate.documents.map((doc, index) => (
                  <Chip
                    key={index}
                    label={doc}
                    size="small"
                    variant="outlined"
                    onClick={() => console.log("View document:", doc)}
                    clickable
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}

        {candidate.notes.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                {candidate.notes.map((note, index) => (
                  <Typography key={index} variant="body2">
                    • {note}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    )}
  </Stack>
);

// 3. PostingDetailsTabContent (No change)
interface PostingDetailsTabProps {
  requisition: Requisition;
}

const PostingDetailsTabContent: React.FC<PostingDetailsTabProps> = ({
  requisition,
}) => {
  const jobPosting = requisition.postings[0];
  const hasPostingDetails = jobPosting?.jobPostingText || jobPosting?.jobAd;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Requisition Information
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Job Title
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {requisition.title}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Position Title
              </Typography>
              <Typography variant="body1">
                {requisition.position?.title || "N/A"} (Code:{" "}
                {requisition.position?.code || "N/A"})
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Employment Type
              </Typography>
              <Typography variant="body1">
                {requisition.employmentTerm}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Vacancy Type
              </Typography>
              <Typography variant="body1">{requisition.vacancyType}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{requisition.status}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Work Schedule
              </Typography>
              <Typography variant="body1">
                {requisition.workSchedule?.name || "N/A"} (
                {requisition.workSchedule?.avgHoursPerDay || "N/A"} hrs/day)
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {requisition.qualifications.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Qualifications
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {requisition.qualifications.map((qual, index) => (
                <Chip key={index} label={qual} size="small" color="primary" />
              ))}
            </Stack>
          </Paper>
        </Box>
      )}

      {jobPosting && hasPostingDetails && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Job Posting Details
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Job Ad Question 0
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {jobPosting.jobAd?.question_0 || "N/A"}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Job Posting Text
            </Typography>
            <Typography variant="body1">
              {jobPosting.jobPostingText || "N/A"}
            </Typography>
          </Paper>
        </Box>
      )}
    </Stack>
  );
};

// 4. CandidateAnswersTabContent (No change)
interface CandidateAnswersTabProps {
  requisition: Requisition;
  answers: Record<string, any>;
}

const CandidateAnswersTabContent: React.FC<CandidateAnswersTabProps> = ({
  requisition,
  answers,
}) => {
  const questions = requisition.postings[0]?.jobFormTemplate?.questions || [];

  if (questions.length === 0) {
    return (
      <Alert severity="info">
        No job form questions were associated with this posting.
      </Alert>
    );
  }

  const getAnswerForQuestion = (questionIndex: number): any => {
    const answerKey = `question_${questionIndex}`;
    return answers[answerKey];
  };

  return (
    <Box>
      <Paper variant="outlined">
        {questions.map((question, index) => {
          const answer = getAnswerForQuestion(index);
          const sectionChanged =
            index === 0 || question.section !== questions[index - 1].section;

          return (
            <Box key={index}>
              {sectionChanged && (
                <>
                  {index > 0 && <Divider />}
                  <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {question.section} Section
                    </Typography>
                  </Box>
                </>
              )}
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {question.question}
                      {question.required && (
                        <Typography
                          component="span"
                          color="error"
                          sx={{ ml: 0.5 }}
                        >
                          *
                        </Typography>
                      )}
                      {question.weighted && question.weight && (
                        <Chip
                          label={`Weight: ${(question.weight * 100).toFixed(
                            0
                          )}%`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: {question.code} • Type: {question.answerType}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "medium",
                        color:
                          answer !== null && answer !== undefined
                            ? "text.primary"
                            : "text.disabled",
                      }}
                    >
                      {formatAnswer(question, answer)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              {index < questions.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};

// =================================================================
// --- Main ApplicationDetailsDialog Component (Refactored) ---
// =================================================================

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  row,
  open,
  handleClose,
}) => {
  const { id: applicationId, candidate, requisition, answers } = row;

  const [currentTab, setCurrentTab] = useState(0);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleOpenScheduleModal = () => setIsScheduleModalOpen(true);
  const handleCloseScheduleModal = () => setIsScheduleModalOpen(false);

  const {
    data: pipelineStagesData,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useDataQuery<PipelineStagesResponse>({
    apiEndPoint: "https://api.techbee.et/api/hr/pipelineStages",
  });

  const stages = pipelineStagesData?.data || [];
  const fullCurrentStage = useMemo(
    () => stages.find((s) => s.id === row.currentStage?.id) || row.currentStage,
    [stages, row.currentStage]
  );

  // UPDATED: Change API endpoint to the requested format
  const {
    data: assessmentsData,
    isLoading: isAssessmentsLoading,
    refetch: refetchAssessments,
  } = useDataQuery<AssessmentsResponse>({
    apiEndPoint: `https://api.techbee.et/api/hr/applications/${applicationId}/assessments`,
  });

  const assessments = assessmentsData?.data || [];

  const finalAssessmentResult = useMemo(
    () => calculateFinalAssessmentResult(assessments),
    [assessments]
  );

  const moveStageMutation = useDataMutation<
    ApplicationUpdateResponse,
    MoveStagePayload
  >({
    apiEndPoint: `https://api.techbee.et/api/hr/applications/${applicationId}`,
    method: "PATCH",
    onSuccess: (data) => {
      const stageName =
        stages.find((s) => s.id === data.currentStage.id)?.name ||
        "a new stage";
      setAlertMessage({
        type: "success",
        message:
          data.message || `Application successfully moved to '${stageName}'.`,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "An unknown error occurred while updating the application.";
      setAlertMessage({
        type: "error",
        message: errorMessage,
      });
    },
    invalidateQueryKey: ["data", "https://api.techbee.et/api/hr/applications"],
  });

  const handleMoveToStage = (stageId: string) => {
    const payload: MoveStagePayload = {
      currentStage: { id: stageId },
      requisition: { id: requisition.id },
    };
    moveStageMutation.mutate(payload);
  };

  const tabContent = [
    <StageAndActionsTabContent
      row={row}
      stages={stages}
      fullCurrentStage={fullCurrentStage}
      isStagesLoading={isStagesLoading && !stagesError}
      isAssessmentsLoading={isAssessmentsLoading}
      assessments={assessments}
      refetchAssessments={refetchAssessments}
      moveStageMutation={moveStageMutation}
      onStageMove={handleMoveToStage}
      setAlertMessage={setAlertMessage}
      handleOpenScheduleModal={handleOpenScheduleModal}
      finalAssessmentResult={finalAssessmentResult}
    />,
    <CandidateDetailsTabContent
      candidate={candidate}
      requisition={requisition}
    />,
    <PostingDetailsTabContent requisition={requisition} />,
    <CandidateAnswersTabContent requisition={requisition} answers={answers} />,
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Typography variant="h5" component="div">
            Application Details
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {requisition.title} • {candidate.firstName} {candidate.fatherName}
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {alertMessage && (
            <Alert
              severity={alertMessage.type}
              onClose={() => setAlertMessage(null)}
              sx={{ mx: 3, mt: 3, mb: 0 }}
            >
              {alertMessage.message}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="application details tabs"
            >
              <Tab
                label="Stage & Actions"
                icon={<HistoryToggleOff />}
                iconPosition="start"
              />
              <Tab
                label="Candidate Details"
                icon={<Person />}
                iconPosition="start"
              />
              <Tab
                label="Posting Details"
                icon={<PostAdd />}
                iconPosition="start"
              />
              <Tab
                label="Candidate Answers"
                icon={<Quiz />}
                iconPosition="start"
              />
            </Tabs>
          </Box>
          <Box sx={{ p: 3 }}>{tabContent[currentTab]}</Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interview Modal */}
      {/* <ScheduleInterviewModal
        open={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        applicationData={row}
      /> */}

      {isScheduleModalOpen && (
        <ReusableFormModal
          schema={interviewSchema}
          title={"Interview Form"}
          formMode="create"
          onClose={handleCloseScheduleModal}
          open={isScheduleModalOpen}
          defaultValues={{
            application: { id: applicationId },
          }}
          disabledValues={{
            "application.id": true,
          }}
        />
      )}
    </>
  );
};

export default ApplicationDetailsDialog;
