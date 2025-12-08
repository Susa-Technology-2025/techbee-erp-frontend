import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Rating,
  Stack,
  Fade,
  Slide,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close,
  ThumbUp,
  ThumbDown,
  Recommend,
  Person,
  Work,
  CalendarToday,
  Grade,
  Chat,
  // Removed unused imports here to keep the file cleaner
} from "@mui/icons-material";

// Types
interface Position {
  id: string;
  title: string;
  code: string;
}

interface Evaluator {
  id: string;
  firstName: string;
  fatherName: string;
  employeeCode: string;
  position: Position;
}

interface EvaluatorInfo {
  id: string;
  type: string;
  weight: number;
  evaluator: Evaluator;
}

interface Answer {
  answer: string;
  answerId: string;
  question: string;
  questionId: string;
}

interface Plan {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  performanceTemplateId: string;
  autoRecommendation: boolean;
}

interface AppraisalData {
  id: string;
  answers: Answer[] | null | undefined;
  comments: string | null;
  createdAt: string;
  evaluationEnd: string | null;
  evaluationStart: string | null;
  evaluator: EvaluatorInfo;
  finalScore: number | null;
  plan: Plan;
  recommendation: string | null;
  recommendationNote: string | null;
  status: string;
  subject: any | null;
  submittedAt: string | null;
  updatedAt: string;
}

interface AppraisalDialogProps {
  row: AppraisalData;
  open: boolean;
  handleClose: () => void;
}

// Answer rating configuration
const answerConfig: {
  [key: string]: { color: string; score: number; label: string };
} = {
  Outstanding: { color: "#10B981", score: 5, label: "Outstanding" },
  Satisfactory: { color: "#3B82F6", score: 4, label: "Satisfactory" },
  "Needs Improvement": {
    color: "#F59E0B",
    score: 2,
    label: "Needs Improvement",
  },
  Unsatisfactory: { color: "#EF4444", score: 1, label: "Unsatisfactory" },
};

const AppraisalDialog: React.FC<AppraisalDialogProps> = ({
  row,
  open,
  handleClose,
}) => {
  const theme = useTheme();

  // Calculate average score
  const calculateAverageScore = () => {
    // FINAL FIX: Use Array.isArray to ensure 'answers' is an array, preventing the reduce error.
    const answers = Array.isArray(row?.answers) ? row.answers : [];

    const total = answers.reduce((sum, answer) => {
      return sum + (answerConfig[answer.answer]?.score || 0);
    }, 0);

    return answers.length ? (total / answers.length).toFixed(1) : "0.0";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: "#6B7280",
      Submitted: "#3B82F6",
      Completed: "#10B981",
      Rejected: "#EF4444",
    };
    return colors[status as keyof typeof colors] || "#6B7280";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Guard Clause: If row (data) is unexpectedly missing, don't attempt to render.
  if (!row) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Appraisal data could not be loaded.
          </Typography>
          <Button onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.95
            )} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
            backdropFilter: "blur(20px)",
            minHeight: "80vh",
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            padding: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Appraisal Evaluation Details
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <Chip
                label={row.status || "Unknown"}
                sx={{
                  backgroundColor: getStatusColor(row.status || ""),
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Created: {formatDate(row.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ID: {row.id?.slice(0, 8)}...
              </Typography>
            </Stack>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              zIndex: 3,
              right: 16,
              top: 16,
              color: "white",
              backgroundColor: alpha("#000", 0.2),
              "&:hover": {
                backgroundColor: alpha("#000", 0.3),
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: "auto" }}>
          {/* Overview Cards */}
          <Slide in={open} direction="down" timeout={500}>
            <Grid container spacing={3} sx={{ p: 4, pb: 2 }}>
              {/* Evaluator Info - Grid sizing fixed */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.light,
                      0.1
                    )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  {/* Internal alignment fix: Use flex column to align content vertically and ensure height fill */}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                      >
                        <Person color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                          Evaluator
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {row.evaluator?.evaluator?.firstName}{" "}
                        {row.evaluator?.evaluator?.fatherName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.evaluator?.evaluator?.employeeCode}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="medium"
                      >
                        {row.evaluator?.evaluator?.position?.title}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip
                        label={row.evaluator?.type}
                        size="small"
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                        }}
                      />
                      <Chip
                        label={`${(row.evaluator?.weight || 0) * 100}%`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Plan Info - Grid sizing fixed */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.secondary.light,
                      0.1
                    )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      theme.palette.secondary.main,
                      0.1
                    )}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  {/* Internal alignment fix */}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                      >
                        <Work color="secondary" />
                        <Typography variant="h6" fontWeight="bold">
                          Appraisal Plan
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {row.plan?.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mt={1}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(row.plan?.periodStart)} -{" "}
                          {formatDate(row.plan?.periodEnd)}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={
                        row.plan?.autoRecommendation
                          ? "Auto Recommend"
                          : "Manual Review"
                      }
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: row.plan?.autoRecommendation
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.warning.main, 0.1),
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Score Summary - Grid sizing fixed */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.success.light,
                      0.1
                    )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.1
                    )}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  {/* Internal alignment fix */}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                      >
                        <Grade color="success" />
                        <Typography variant="h6" fontWeight="bold">
                          Performance Summary
                        </Typography>
                      </Stack>
                    </Box>
                    <Box
                      textAlign="center"
                      py={1}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {calculateAverageScore()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Score
                      </Typography>
                      <Rating
                        value={parseFloat(calculateAverageScore())}
                        max={5}
                        readOnly
                        sx={{ mt: 1 }}
                        precision={0.1}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                      textAlign="center"
                    >
                      Based on {row.answers?.length || 0} questions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Slide>

          <Divider sx={{ mx: 4 }} />

          {/* Answers Section */}
          <Box sx={{ p: 4, pt: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Evaluation Answers ({row.answers?.length || 0})
            </Typography>

            <Grid container spacing={2}>
              {/* Use Array.isArray check on map as well for redundancy */}
              {(Array.isArray(row.answers) ? row.answers : []).map(
                (answer, index) => (
                  <Grid item xs={12} key={answer.answerId || index}>
                    <Fade
                      in={open}
                      timeout={800}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Card
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.shadows[8],
                            borderLeft: `4px solid ${
                              answerConfig[answer.answer]?.color || "#6B7280"
                            }`,
                          },
                          borderLeft: `4px solid ${
                            answerConfig[answer.answer]?.color || "#6B7280"
                          }`,
                        }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="flex-start"
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                backgroundColor:
                                  answerConfig[answer.answer]?.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                gutterBottom
                              >
                                {answer.question}
                              </Typography>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                              >
                                <Chip
                                  label={answer.answer}
                                  sx={{
                                    backgroundColor:
                                      answerConfig[answer.answer]?.color,
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                />
                                <Rating
                                  value={
                                    answerConfig[answer.answer]?.score || 0
                                  }
                                  max={5}
                                  readOnly
                                  size="small"
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Score:{" "}
                                  {answerConfig[answer.answer]?.score || 0}
                                  /5
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                )
              )}
            </Grid>

            {/* Comments Section */}
            {row.comments && (
              <Fade in={open} timeout={1000}>
                <Box mt={4}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Chat color="action" />
                    <Typography variant="h6" fontWeight="bold">
                      Additional Comments
                    </Typography>
                  </Stack>
                  <Card
                    sx={{
                      backgroundColor: alpha(theme.palette.info.light, 0.05),
                      border: `1px solid ${alpha(
                        theme.palette.info.main,
                        0.1
                      )}`,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body1"
                        fontStyle="italic"
                        color="text.primary"
                      >
                        "{row.comments}"
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Fade>
            )}

            {/* Action Buttons */}
            <Fade in={open} timeout={1200}>
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ThumbDown />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      borderColor: theme.palette.error.dark,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Discard
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ThumbUp />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    borderColor: theme.palette.warning.main,
                    color: theme.palette.warning.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      borderColor: theme.palette.warning.dark,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Save Draft
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Recommend />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: theme.shadows[6],
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Recommend
                </Button>
              </Box>
            </Fade>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppraisalDialog;
