// components/AppraisalPlansPage.tsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  Container,
  alpha,
  useTheme,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Assessment,
  CalendarToday,
  People,
  Quiz,
  Rule,
  ArrowBack,
  CheckCircle,
  Star,
  TrendingUp,
  Schedule,
  Description,
  PlayArrow,
  ArrowForward,
  EmojiEvents,
  WorkspacePremium,
  Search,
  FilterList,
  Save,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { AppraisalPlan, AppraisalPlansResponse, Subject } from "../types/types";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";

interface AppraisalPlansPageProps {
  data: AppraisalPlansResponse;
  employee: string;
}

// Enhanced types
interface DraftData {
  planId: string;
  subjectId?: string;
  answers: Record<string, string>;
  lastSaved: string;
}

const AppraisalPlansPage: React.FC<AppraisalPlansPageProps> = ({
  data,
  employee,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<AppraisalPlan | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!data || !data.data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "white", mb: 2 }} size={60} />
          <Typography variant="h5" color="white" fontWeight="300">
            Loading Appraisal Plans...
          </Typography>
        </Box>
      </Box>
    );
  }

  const handlePlanSelect = (plan: AppraisalPlan) => {
    setSelectedPlan(plan);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
        pb: 6,
      }}
    >
      <Fade in timeout={800}>
        <Box>
          {!selectedPlan ? (
            <ModernPlansOverview
              plans={data.data}
              onPlanSelect={handlePlanSelect}
              employee={employee}
            />
          ) : (
            <ModernAppraisalForm
              plan={selectedPlan}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              employee={employee}
              onBack={() => setSelectedPlan(null)}
            />
          )}
        </Box>
      </Fade>
    </Box>
  );
};

// Modern Plans Overview Component with Enhanced Features
const ModernPlansOverview: React.FC<{
  plans: AppraisalPlan[];
  onPlanSelect: (plan: AppraisalPlan) => void;
  employee: string;
}> = ({ plans, onPlanSelect, employee }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const plansPerPage = 6;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Filter and sort plans
  const filteredPlans = plans
    .filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || plan.approvalStatus === statusFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return (
            new Date(b.periodStart).getTime() -
            new Date(a.periodStart).getTime()
          );
        case "status":
          return a.approvalStatus.localeCompare(b.approvalStatus);
        default:
          return 0;
      }
    });

  const currentPlans = filteredPlans.slice(
    (currentPage - 1) * plansPerPage,
    currentPage * plansPerPage
  );

  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 8,
          px: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            color: "text.primary",
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            position: "relative",
          }}
        >
          <WorkspacePremium
            sx={{
              fontSize: 64,
              mb: 2,
              color: "primary.main",
              opacity: 0.85,
            }}
          />

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight={500}
            sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
          >
            Performance Review
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.85,
              fontWeight: 400,
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Evaluate and track performance with a clean, modern platform
            designed for productivity.
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<Description />}
              label={`${plans.length} Active Plans`}
              sx={{
                bgcolor: "grey.100",
                color: "text.primary",
                fontSize: "0.9rem",
                px: 1.5,
                py: 0.5,
              }}
            />
            <Chip
              icon={<EmojiEvents />}
              label="Track Progress"
              sx={{
                bgcolor: "grey.100",
                color: "text.primary",
                fontSize: "0.9rem",
                px: 1.5,
                py: 0.5,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, color: "text.primary", mr: 2 }}
          >
            {filteredPlans.length} Appraisal Plans
          </Typography>

          <TextField
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            size="small"
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Paper>

        {/* Plans Grid */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {currentPlans.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
              }}
            >
              <Assessment
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h5" gutterBottom color="text.primary">
                No Plans Found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 400, margin: "0 auto" }}
              >
                {searchTerm || statusFilter !== "all"
                  ? "No appraisal plans match your search criteria. Try adjusting your filters."
                  : "There are no appraisal plans assigned to you at the moment."}
              </Typography>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          ) : (
            Array.from({ length: Math.ceil(currentPlans.length / 3) }).map(
              (_, rowIndex) => (
                <Stack
                  key={rowIndex}
                  direction="row"
                  spacing={3}
                  sx={{
                    width: "100%",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  {currentPlans
                    .slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((plan, cardIndex) => (
                      <Slide
                        direction="up"
                        in
                        timeout={500 + (rowIndex * 3 + cardIndex) * 100}
                        key={plan.id}
                      >
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            background:
                              "linear-gradient(145deg, #ffffff 0%, #fafbff 100%)",
                            border: "1px solid rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            overflow: "hidden",
                            width: { xs: "100%", sm: 320, md: 360 },
                            minWidth: 300,
                            flexShrink: 0,
                            "&:hover": {
                              transform: "translateY(-4px) scale(1.02)",
                              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.15)",
                              borderColor: "primary.main",
                            },
                          }}
                          onClick={() => onPlanSelect(plan)}
                        >
                          {/* Thumbnail Section */}
                          <Box
                            sx={{
                              position: "relative",
                              height: 120,
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <Assessment sx={{ fontSize: 48, opacity: 0.9 }} />

                            {/* Status Badge */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                background: "rgba(0,0,0,0.7)",
                                color: "white",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                              }}
                            >
                              {plan.approvalStatus}
                            </Box>

                            {/* Progress Indicator */}
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: "rgba(255,255,255,0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "100%",
                                  background:
                                    "linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)",
                                  width:
                                    plan.evaluations.length > 0 ? "60%" : "10%",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </Box>
                          </Box>

                          <CardContent sx={{ p: 2.5 }}>
                            {/* Title Section */}
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontWeight: 500,
                                lineHeight: 1.3,
                                mb: 1,
                                height: 40,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {plan.name}
                            </Typography>

                            {/* Metadata */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1.5,
                              }}
                            >
                              <CalendarToday
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(
                                  plan.periodStart
                                ).toLocaleDateString()}
                              </Typography>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  bgcolor: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {plan.type}
                              </Typography>
                            </Box>

                            {/* Stats */}
                            <Box
                              sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2,
                                py: 1,
                                borderTop: "1px solid rgba(0,0,0,0.08)",
                                borderBottom: "1px solid rgba(0,0,0,0.08)",
                              }}
                            >
                              <Box sx={{ textAlign: "center" }}>
                                <People
                                  sx={{
                                    fontSize: 20,
                                    color: "primary.main",
                                    mb: 0.5,
                                  }}
                                />
                                <Typography variant="caption" fontWeight="bold">
                                  {plan.evaluators.length}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Evaluators
                                </Typography>
                              </Box>

                              <Box sx={{ textAlign: "center" }}>
                                <Quiz
                                  sx={{
                                    fontSize: 20,
                                    color: "primary.main",
                                    mb: 0.5,
                                  }}
                                />
                                <Typography variant="caption" fontWeight="bold">
                                  {plan.performanceTemplate?.questions.length ||
                                    0}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Questions
                                </Typography>
                              </Box>

                              <Box sx={{ textAlign: "center" }}>
                                <Rule
                                  sx={{
                                    fontSize: 20,
                                    color: "primary.main",
                                    mb: 0.5,
                                  }}
                                />
                                <Typography variant="caption" fontWeight="bold">
                                  {plan.recommendationRules.length}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Rules
                                </Typography>
                              </Box>
                            </Box>

                            {/* Action Button */}
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<PlayArrow />}
                              sx={{
                                borderRadius: 2,
                                py: 1,
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                fontWeight: "500",
                                textTransform: "none",
                                fontSize: "0.9rem",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                  transform: "translateY(-1px)",
                                  boxShadow:
                                    "0 4px 12px rgba(102, 126, 234, 0.3)",
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlanSelect(plan);
                              }}
                            >
                              Start Evaluation
                            </Button>

                            {/* Comments Preview */}
                            {plan.comments && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  mt: 1,
                                  lineHeight: 1.4,
                                  height: 20,
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                💡 {plan.comments}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Slide>
                    ))}

                  {/* Fill empty spaces */}
                  {currentPlans.slice(rowIndex * 3, rowIndex * 3 + 3).length <
                    3 &&
                    Array.from({
                      length:
                        3 -
                        currentPlans.slice(rowIndex * 3, rowIndex * 3 + 3)
                          .length,
                    }).map((_, emptyIndex) => (
                      <Box
                        key={`empty-${emptyIndex}`}
                        sx={{
                          width: { xs: "100%", sm: 320, md: 360 },
                          minWidth: 300,
                          flexShrink: 0,
                          visibility: "hidden",
                        }}
                      />
                    ))}
                </Stack>
              )
            )
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              startIcon={<KeyboardArrowUp />}
              sx={{ borderRadius: 2 }}
            >
              Previous
            </Button>

            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              endIcon={<KeyboardArrowDown />}
              sx={{ borderRadius: 2 }}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

// Modern Appraisal Form Component - Enhanced Version
const ModernAppraisalForm: React.FC<{
  plan: AppraisalPlan;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  employee: string;
  onBack: () => void;
}> = ({ plan, answers, onAnswerChange, onBack, employee }) => {
  const questions = plan.performanceTemplate?.questions || [];
  const subjects = plan.subjects || [];
  const progress =
    questions.length > 0
      ? (Object.keys(answers).length / questions.length) * 100
      : 0;
  const allQuestionsAnswered = questions.every((question) =>
    question.required ? answers[question.id] : true
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const evaluator = plan.evaluators.find((e) => e.evaluator.id === employee);

  // Filter subjects based on search
  const filteredSubjects = subjects.filter((subject) =>
    `${subject.employee.firstName} ${subject.employee.fatherName}`
      .toLowerCase()
      .includes(subjectSearch.toLowerCase())
  );

  // Load draft data on component mount
  useEffect(() => {
    const draft = localStorage.getItem(`draft-${plan.id}`);
    if (draft) {
      try {
        const parsedDraft: DraftData = JSON.parse(draft);
        setAnswers(parsedDraft.answers);
        if (parsedDraft.subjectId) {
          const subject = subjects.find((s) => s.id === parsedDraft.subjectId);
          if (subject) setSelectedSubject(subject);
        }
        setSnackbar({
          open: true,
          message: `Draft loaded from ${new Date(
            parsedDraft.lastSaved
          ).toLocaleTimeString()}`,
          severity: "info",
        });
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [plan.id, subjects]);

  // Auto-save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(answers).length > 0 || selectedSubject) {
        saveDraft();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [answers, selectedSubject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSaveDraft();
            break;
          case "Enter":
            if (allQuestionsAnswered && selectedSubject) {
              e.preventDefault();
              setShowConfirmDialog(true);
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [allQuestionsAnswered, selectedSubject]);

  const saveDraft = useCallback(() => {
    const draft: DraftData = {
      planId: plan.id,
      subjectId: selectedSubject?.id,
      answers,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(`draft-${plan.id}`, JSON.stringify(draft));
  }, [plan.id, selectedSubject, answers]);

  const handleSaveDraft = () => {
    saveDraft();
    setSnackbar({
      open: true,
      message: "Draft saved successfully!",
      severity: "success",
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedSubject) {
      newErrors.subject = "Please select an employee to evaluate";
    }

    questions.forEach((question) => {
      if (question.required && !answers[question.id]) {
        newErrors[question.id] = "This question is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitMutation = useDataMutation({
    apiEndPoint: "https://hr.api.techbee.et/api/appraisalEvaluations",
    method: "POST",
    getBody: (variables) => JSON.stringify(variables),
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Appraisal submitted successfully!",
        severity: "success",
      });
      // Clear draft after successful submission
      localStorage.removeItem(`draft-${plan.id}`);
      setTimeout(() => onBack(), 1500);
    },
    onError: (err: any) => {
      setSnackbar({
        open: true,
        message: "Submission failed: " + err.message,
        severity: "error",
      });
    },
  });

  const UpdateEvaluationMutation = useDataMutation({
    apiEndPoint: `https://hr.api.techbee.et/api/appraisalEvaluations/${evaluation}`,
    method: "PATCH",
    getBody: (variables) => JSON.stringify(variables),
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Appraisal updated successfully!",
        severity: "success",
      });
      localStorage.removeItem(`draft-${plan.id}`);
      setTimeout(() => onBack(), 1500);
    },
    onError: (err: any) => {
      setSnackbar({
        open: true,
        message: "Update failed: " + err.message,
        severity: "error",
      });
    },
  });

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    if (!selectedSubject) {
      setSnackbar({
        open: true,
        message: "Please select a subject to evaluate",
        severity: "error",
      });
      return;
    }

    const payload = {
      answers: Object.entries(answers).map(([questionId, value]) => {
        const question = questions.find((q) => q.id === questionId);
        const option = question?.ratingScale.options.find(
          (opt) => opt.value === value
        );

        return {
          question: question?.question,
          questionId: questionId,
          answer: option?.label,
          answerId: option?.id,
          score: option?.score,
        };
      }),
      evaluator: { id: evaluator?.id },
      plan: { id: plan.id },
      subject: { id: selectedSubject.id },
      status: "Submitted",
    };

    // Check if we're updating an existing evaluation
    const existingEvaluation = selectedSubject.evaluations?.find(
      (e: any) => e.evaluatorId === evaluator?.id
    );

    if (existingEvaluation && selectedSubject.status === "Draft") {
      setEvaluation(existingEvaluation.id);
      UpdateEvaluationMutation.mutate(payload);
    } else {
      submitMutation.mutate(payload);
    }
  }, [
    answers,
    plan.id,
    selectedSubject,
    questions,
    evaluator,
    submitMutation,
    UpdateEvaluationMutation,
  ]);

  if (!evaluator) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3,
          }}
        >
          You are not assigned as an evaluator for this appraisal plan.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Back to Plans
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle fontWeight="500">Submit Evaluation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your evaluation for{" "}
            <strong>
              {selectedSubject?.employee.firstName}{" "}
              {selectedSubject?.employee.fatherName}
            </strong>
            ? This action cannot be undone.
          </Typography>
          {selectedSubject?.status === "Draft" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This will update your previously saved draft evaluation.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowConfirmDialog(false);
              handleSubmit();
            }}
            variant="contained"
            disabled={
              submitMutation.isPending || UpdateEvaluationMutation.isPending
            }
          >
            {submitMutation.isPending || UpdateEvaluationMutation.isPending ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            Confirm Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Draft Dialog */}
      <Dialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle fontWeight="500">Save Draft</DialogTitle>
        <DialogContent>
          <Typography>
            Your progress will be saved automatically. You can also manually
            save your draft.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Close</Button>
          {/* <Button 
            onClick={() => {
              handleSaveDraft();
              setShowSaveDialog(false);
            }}
            variant="contained"
            startIcon={<Save />}
          >
            Save Now
          </Button> */}
        </DialogActions>
      </Dialog>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 6,
          background: "#ffffff",
          color: "text.primary",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  width: 72,
                  height: 72,
                  border: "2px solid #e5e7eb",
                }}
              >
                <Assessment sx={{ fontSize: 36, color: "primary.main" }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={600}
                  gutterBottom
                >
                  {plan.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Performance Evaluation
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={plan.approvalStatus}
                sx={{
                  bgcolor:
                    plan.approvalStatus === "Approved"
                      ? "success.light"
                      : plan.approvalStatus === "Pending"
                      ? "warning.light"
                      : "grey.200",
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 2,
                  py: 0.5,
                  border: "1px solid #e5e7eb",
                }}
              />
              <Tooltip title="Save draft (Ctrl+S)">
                <IconButton
                  onClick={handleSaveDraft}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                  }}
                >
                  <Save />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Subject Selection Dropdown */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="500">
              Select Employee to Evaluate
            </Typography>
            <Paper
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
                border: `2px solid ${
                  selectedSubject
                    ? "primary.main"
                    : errors.subject
                    ? "error.main"
                    : "rgba(0,0,0,0.1)"
                }`,
                borderRadius: 2,
                transition: "all 0.3s ease",
              }}
            >
              <TextField
                placeholder="Search employees..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
                fullWidth
                size="small"
              />

              <FormControl fullWidth error={!!errors.subject}>
                <InputLabel id="subject-select-label">
                  Choose Employee
                </InputLabel>
                <Select
                  labelId="subject-select-label"
                  value={selectedSubject || ""}
                  label="Choose Employee"
                  onChange={(e) => {
                    setSelectedSubject(e.target.value as Subject);
                    setErrors((prev) => ({ ...prev, subject: "" }));
                  }}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  {filteredSubjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject as any}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          {subject.employee.firstName.charAt(0)}
                          {subject.employee.fatherName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="500">
                            {subject.employee.firstName}{" "}
                            {subject.employee.fatherName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {subject.employee.employeeCode} • {subject.status}
                            {subject.status === "Submitted" &&
                              " - Update previous submission"}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.subject && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.subject}
                </Typography>
              )}
            </Paper>
            {selectedSubject && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  background: "rgba(33, 150, 243, 0.05)",
                  border: "1px solid rgba(33, 150, 243, 0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">
                  Evaluating:{" "}
                  <strong>
                    {selectedSubject.employee.firstName}{" "}
                    {selectedSubject.employee.fatherName}
                  </strong>
                  {selectedSubject.status === "Submitted" && (
                    <>
                      <br />
                      You are updating a previously submitted evaluation.
                    </>
                  )}
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Plan Info */}
          <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday sx={{ fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(plan.periodStart).toLocaleDateString()} –{" "}
                {new Date(plan.periodEnd).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp sx={{ fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {plan.type}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Schedule sx={{ fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {plan.cycle.name}
              </Typography>
            </Box>
          </Box>

          {/* Progress Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Evaluation Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% Complete ({Object.keys(answers).length}/
                {questions.length} questions)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "#f1f5f9",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Questions Section */}
      {questions.length > 0 ? (
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Quiz color="primary" />
            Evaluation Questions
            <Chip
              label={`${Object.keys(answers).length}/${
                questions.length
              } answered`}
              size="small"
              color={
                Object.keys(answers).length === questions.length
                  ? "success"
                  : "default"
              }
              variant="outlined"
            />
          </Typography>
          <Stack spacing={4}>
            {questions
              .sort((a, b) => a.order - b.order)
              .map((question, index) => (
                <Zoom in timeout={500 + index * 100} key={question.id}>
                  <Box>
                    <ModernQuestionCard
                      question={question}
                      value={answers[question.id] || ""}
                      onChange={(value) => {
                        onAnswerChange(question.id, value);
                        setErrors((prev) => ({ ...prev, [question.id]: "" }));
                      }}
                      error={errors[question.id]}
                    />
                  </Box>
                </Zoom>
              ))}
          </Stack>
        </Box>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Assessment
            sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }}
          />
          <Typography variant="h5" color="text.secondary" fontWeight="300">
            No questions configured for this evaluation
          </Typography>
        </Paper>
      )}

      {/* Answers Preview */}
      {Object.keys(answers).length > 0 && (
        <Fade in timeout={800}>
          <Box>
            <ModernAnswersPreview questions={questions} answers={answers} />
          </Box>
        </Fade>
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 8,
          p: 4,
          background: "rgba(255,255,255,0.8)",
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            variant="outlined"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderWidth: 2,
              fontWeight: "500",
              fontSize: "1rem",
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Back to Plans
          </Button>

          {/* <Button
            startIcon={<Save />}
            onClick={handleSaveDraft}
            variant="outlined"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderWidth: 2,
              fontWeight: '500',
              fontSize: '1rem',
            }}
          >
            Save Draft
          </Button> */}
        </Box>

        {questions.length > 0 && (
          <Button
            endIcon={<ArrowForward />}
            onClick={() => setShowConfirmDialog(true)}
            disabled={
              !allQuestionsAnswered ||
              !selectedSubject ||
              submitMutation.isPending ||
              UpdateEvaluationMutation.isPending
            }
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background:
                allQuestionsAnswered &&
                selectedSubject &&
                !submitMutation.isPending
                  ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                  : "linear-gradient(135deg, #ccc 0%, #999 100%)",
              fontWeight: "500",
              fontSize: "1.1rem",
              boxShadow:
                allQuestionsAnswered && selectedSubject
                  ? "0 8px 25px rgba(76, 175, 80, 0.3)"
                  : "none",
              minWidth: 200,
              "&:hover":
                allQuestionsAnswered &&
                selectedSubject &&
                !submitMutation.isPending
                  ? {
                      background:
                        "linear-gradient(135deg, #45a049 0%, #4CAF50 100%)",
                      boxShadow: "0 12px 35px rgba(76, 175, 80, 0.4)",
                    }
                  : {},
            }}
          >
            {submitMutation.isPending || UpdateEvaluationMutation.isPending ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {selectedSubject && selectedSubject.status === "Submitted"
              ? "Update Evaluation"
              : "Submit Evaluation"}
            {!isMobile && " (Ctrl+Enter)"}
          </Button>
        )}
      </Box>

      {/* Keyboard Shortcuts Help */}
      <Paper
        sx={{
          p: 2,
          mt: 2,
          background: "rgba(0,0,0,0.02)",
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          💡 <strong>Keyboard shortcuts:</strong> Ctrl+S to save draft •
          Ctrl+Enter to submit
        </Typography>
      </Paper>
    </Container>
  );
};

// Enhanced Modern Question Card Component
const ModernQuestionCard: React.FC<{
  question: any;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}> = ({ question, value, onChange, error }) => {
  const selectedOption = question.ratingScale.options.find(
    (opt: any) => opt.value === value
  );

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(145deg, #ffffff 0%, #fafbff 100%)",
        border: `1px solid ${
          error
            ? "error.main"
            : value
            ? "rgba(102, 126, 234, 0.2)"
            : "rgba(0,0,0,0.05)"
        }`,
        transition: "all 0.3s ease",
        boxShadow: value
          ? "0 8px 32px rgba(102, 126, 234, 0.1)"
          : "0 4px 20px rgba(0,0,0,0.05)",
        "&:hover": {
          borderColor: error ? "error.main" : "rgba(102, 126, 234, 0.3)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3 }}>
        <Box
          sx={{
            background: error
              ? "error.main"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            width: 50,
            height: 50,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            boxShadow: error
              ? "0 4px 12px rgba(211, 47, 47, 0.3)"
              : "0 4px 12px rgba(102, 126, 234, 0.3)",
          }}
        >
          {question.order}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight="400"
            sx={{ lineHeight: 1.4 }}
          >
            {question.question}
            {question.required && (
              <span style={{ color: "#ff4444", marginLeft: 4 }}>*</span>
            )}
          </Typography>

          {question.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 300 }}
            >
              {question.description}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip
              label={`Weight: ${question.weight}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 400 }}
            />
            <Chip
              label={`Section: ${question.section}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 400 }}
            />
            {error && (
              <Chip
                label="Required"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {selectedOption && !error && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            background: "rgba(76, 175, 80, 0.05)",
            border: "1px solid rgba(76, 175, 80, 0.1)",
            borderRadius: 3,
          }}
          icon={<CheckCircle sx={{ color: "#4CAF50" }} />}
        >
          <Typography variant="body2" fontWeight="400">
            Selected: <strong>{selectedOption.label}</strong> • Score:{" "}
            {selectedOption.score}
          </Typography>
        </Alert>
      )}

      <Typography
        variant="subtitle1"
        gutterBottom
        fontWeight="500"
        sx={{ mb: 3, color: "primary.main" }}
      >
        {question.ratingScale.name}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {question.ratingScale.options
          .sort((a: any, b: any) => a.order - b.order)
          .map((option: any) => (
            <Button
              key={option.id}
              onClick={() => onChange(option.value)}
              variant={value === option.value ? "contained" : "outlined"}
              startIcon={
                <Star
                  sx={{
                    color: value === option.value ? "white" : "primary.main",
                    opacity: value === option.value ? 1 : 0.7,
                  }}
                />
              }
              sx={{
                minWidth: 120,
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                fontWeight: "500",
                transition: "all 0.3s ease",
                ...(value === option.value
                  ? {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                      },
                    }
                  : {
                      borderColor: error ? "error.main" : "primary.main",
                      color: error ? "error.main" : "primary.main",
                      "&:hover": {
                        bgcolor: error ? "error.main" : "primary.main",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: error
                          ? "0 6px 20px rgba(211, 47, 47, 0.3)"
                          : "0 6px 20px rgba(102, 126, 234, 0.3)",
                      },
                    }),
              }}
            >
              {option.label}
            </Button>
          ))}
      </Box>
    </Paper>
  );
};

// Modern Answers Preview Component
const ModernAnswersPreview: React.FC<{
  questions: any[];
  answers: Record<string, string>;
}> = ({ questions, answers }) => {
  const totalScore = Object.entries(answers).reduce(
    (sum, [questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId);
      const option = question?.ratingScale.options.find(
        (opt: any) => opt.value === answer
      );
      return sum + (option?.score || 0);
    },
    0
  );

  const maxScore = questions.reduce((sum, question) => {
    const maxOption = question.ratingScale.options.reduce(
      (max: any, opt: any) => (opt.score > max.score ? opt : max),
      question.ratingScale.options[0]
    );
    return sum + (maxOption?.score || 0);
  }, 0);

  return (
    <Paper
      sx={{
        p: 4,
        mb: 6,
        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
        color: "white",
        borderRadius: 4,
        boxShadow: "0 20px 60px rgba(76, 175, 80, 0.2)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircle sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="300">
              Your Answers
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" fontWeight="300">
              Total Score
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {totalScore}/{maxScore}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {Math.round((totalScore / maxScore) * 100)}% Complete
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2}>
          {Object.entries(answers).map(([questionId, answer]) => {
            const question = questions.find((q) => q.id === questionId);
            const option = question?.ratingScale.options.find(
              (opt: any) => opt.value === answer
            );

            return (
              <Box
                key={questionId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {question?.order}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="400">
                    {question?.question}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    <strong>Answer:</strong> {option?.label} •{" "}
                    <strong>Score:</strong> {option?.score}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
};

export default AppraisalPlansPage;
