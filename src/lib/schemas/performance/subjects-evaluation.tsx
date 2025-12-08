import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import {
  Box,
  Dialog,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";

// --- Global Constants and Types ---

const RECOMMENDATION_OPTIONS = [
  "Training",
  "Promotion",
  "Demotion",
  "Salary Increase",
  "Lateral Move",
  "None",
];

interface Answer {
  score: number | null;
  answer: string;
  answerId: string;
  question: string;
  questionId: string;
}

interface Evaluation {
  answers: Answer[];
  comments: string | null;
  status: string;
  evaluator: any;
  recommendation: string | null; // Added from backend data
  recommendationNote: string | null; // Added from backend data
  score: number | null; // Added from backend data
  plan: {
    allowRecommendation: boolean;
    // other plan properties...
  };
  // other properties...
}

interface DialogProps {
  row: any;
  open: boolean;
  handleClose: () => void;
}

// --- Recommendation Modal Component ---

interface RecommendationModalProps {
  open: boolean;
  onClose: () => void;
}

const RecommendationModal = ({ open, onClose }: RecommendationModalProps) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const payload = {
      recommendation,
      note,
    };
    // Log the final recommendation payload
    console.log("Recommendation Submitted:", payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Submit Final Recommendation
        </Typography>
        <Autocomplete
          options={RECOMMENDATION_OPTIONS}
          value={recommendation}
          onChange={(event, newValue) => setRecommendation(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Recommendation Type"
              variant="outlined"
              margin="normal"
              required
            />
          )}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Recommendation Note (Optional)"
          multiline
          rows={4}
          fullWidth
          value={note}
          onChange={(e) => setNote(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!recommendation}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

// --- Evaluation Details Component (for Accordion) ---

const EvaluationDetails = ({ evaluation }: { evaluation: Evaluation }) => {
  const answers: Answer[] = evaluation.answers || [];

  // Calculated Metrics
  const totalScoreSum = answers.reduce(
    (sum, item) => sum + (item.score || 0),
    0
  );
  const questionsCount = answers.length;
  const validScoresCount = answers.filter(
    (item) => typeof item.score === "number" && item.score !== null
  ).length;
  const averageScore = questionsCount > 0 ? totalScoreSum / questionsCount : 0;

  // Backend Metrics
  const backendScore =
    evaluation.score !== null && evaluation.score !== undefined
      ? evaluation.score.toFixed(2)
      : "N/A";
  const backendRecommendation = evaluation.recommendation || "N/A";
  const backendRecommendationNote = evaluation.recommendationNote || "None";

  const evaluatorFullName =
    `${evaluation.evaluator?.evaluator?.firstName || ""} ${
      evaluation.evaluator?.evaluator?.fatherName || ""
    }`.trim() || "N/A";
  const evaluationStatus = evaluation.status || "N/A";

  return (
    <Box sx={{ p: 3, bgcolor: "grey.50" }}>
      {/* Evaluator and Period Info */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            EVALUATOR NAME
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {evaluatorFullName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            EVALUATOR ROLE
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {evaluation.evaluator?.type || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Summary Box (Key Metrics) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "success.main" }}
            >
              CALCULATED AVG. RATING
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "success.dark" }}
            >
              {averageScore.toFixed(2)}
            </Typography>
          </Box>
        </Grid> */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "info.main" }}
            >
              SCORE
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "info.dark" }}
            >
              {backendScore}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              QUESTIONS ANSWERED
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "text.primary" }}
            >
              {validScoresCount} / {questionsCount}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Backend Recommendation for this evaluation */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "warning.light",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "warning.main",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}
        >
          RECOMMENDATION FROM THIS EVALUATION
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Action:
            </Typography>
            <Typography variant="body1">{backendRecommendation}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Note:
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              {backendRecommendationNote}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Dynamic Questions and Answers Section */}
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
      >
        Question-by-Question Review
      </Typography>

      <Grid container spacing={2}>
        {answers.map((item, index) => (
          <Grid size={{ xs: 12 }} key={item.questionId || index}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                borderLeft: "5px solid",
                borderColor:
                  item.score !== null ? "secondary.light" : "grey.300",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
              >
                {item.question}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={`Score: ${
                    item.score !== null ? item.score : "No Score"
                  }`}
                  size="medium"
                  color={item.score !== null ? "primary" : "default"}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label={`Answer: ${item.answer || "N/A"}`}
                  size="medium"
                  color={item.answer ? "secondary" : "default"}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Comments and Status */}
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Comments:
          </Typography>{" "}
          {evaluation.comments || "No comments provided."}
        </Typography>
        <Typography variant="body2">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Evaluation Status:
          </Typography>{" "}
          <Chip
            label={evaluationStatus}
            size="small"
            color={evaluationStatus === "Draft" ? "warning" : "success"}
          />
        </Typography>
      </Box>
    </Box>
  );
};

// --- Main Dialogue Component ---

export const EvaluationsDialogue = ({
  row,
  open,
  handleClose,
}: DialogProps) => {
  const [recommendModalOpen, setRecommendModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Fetch Evaluations Data
  const {
    data: evaluationsData = { data: [] },
    isLoading: isLoadingEvaluations,
    isSuccess: isSuccessEvaluations,
    isError: isErrorEvaluations,
  } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/hr/appraisalPlanSubjects/${row.id}/evaluations`,
    columnFilters: [],
    globalFilter: "",
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 50 },
  });

  const evaluations: Evaluation[] = evaluationsData.data || [];

  const firstEvaluation = evaluations[0];
  const allowRecommendation =
    firstEvaluation?.plan?.allowRecommendation ?? false;

  const isLoading = isLoadingEvaluations;
  const isError = isErrorEvaluations;
  const isReady = isSuccessEvaluations;

  // Use finalScore from row data for the overall summary
  const finalScore = row.finalScore !== undefined ? row.finalScore : "N/A";
  const finalRecommendation = row.finalRecommendation || "N/A";
  const finalRecommendationNote = row.finalRecommendationNote || "None";

  const handleRecommendOpen = () => setRecommendModalOpen(true);
  const handleRecommendClose = () => setRecommendModalOpen(false);

  // Content rendering based on state
  const content = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress color="primary" size={30} sx={{ mb: 2 }} />
          <Typography>Loading evaluation data...</Typography>
        </Box>
      );
    }

    if (isError || (isReady && evaluations.length === 0)) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color={isError ? "error" : "text.primary"}>
            {isError
              ? "An error occurred while fetching data."
              : "No evaluations found for this subject."}
          </Typography>
        </Box>
      );
    }

    if (isReady && evaluations.length > 0) {
      return (
        <Box sx={{ p: 4 }}>
          {/* Overall Summary Card - Showing finalScore */}
          <Box
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "primary.dark",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: 3,
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "primary.contrastText" }}
              >
                OVERALL FINAL SCORE
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: "primary.contrastText" }}
              >
                {typeof finalScore === "number"
                  ? finalScore.toFixed(2)
                  : finalScore}
              </Typography>
            </Box>

            {/* Conditional Recommendation Area */}
            {allowRecommendation ? (
              <Button
                variant="contained"
                onClick={handleRecommendOpen}
                size="large"
                sx={{
                  bgcolor: "secondary.main",
                  "&:hover": { bgcolor: "secondary.dark" },
                  fontWeight: 700,
                }}
              >
                Submit Recommendation
              </Button>
            ) : (
              <Box
                sx={{
                  p: 1,
                  bgcolor: "primary.light",
                  borderRadius: 1,
                  maxWidth: 300,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  Final Recommendation:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {finalRecommendation}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
                >
                  Note: {finalRecommendationNote}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
          >
            Individual Evaluator Reviews ({evaluations.length})
          </Typography>

          {/* Individual Evaluator Accordions */}
          {evaluations.map((evaluation: any, index: number) => {
            const panelId = `panel-${evaluation.id || index}`;
            const evaluatorName =
              `${evaluation.evaluator?.evaluator?.firstName || ""} ${
                evaluation.evaluator?.evaluator?.fatherName || ""
              }`.trim() || `Evaluator #${index + 1}`;

            return (
              <Accordion
                key={evaluation.id || index}
                expanded={expanded === panelId}
                onChange={handleChange(panelId)}
                sx={{
                  mb: 1,
                  border: "1px solid",
                  borderColor: "grey.200",
                  "&:before": { display: "none" },
                  borderRadius: 1,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        {evaluatorName}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ mx: 2 }}>
                      <Chip
                        label={evaluation.status}
                        size="small"
                        color={
                          evaluation.status === "Draft" ? "warning" : "success"
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: "right" }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Updated:{" "}
                        {new Date(evaluation.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ p: 0, borderTop: "1px solid", borderColor: "divider" }}
                >
                  <EvaluationDetails evaluation={evaluation} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      );
    }
  }, [
    isLoading,
    isError,
    isReady,
    evaluations,
    expanded,
    allowRecommendation,
    finalScore,
    finalRecommendation,
    finalRecommendationNote,
  ]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "primary.main",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
            Evaluation Review: {row.name || "Subject Details"}
          </Typography>
        </Box>
        {content}
      </Dialog>

      {/* Recommendation Modal */}
      <RecommendationModal
        open={recommendModalOpen}
        onClose={handleRecommendClose}
      />
    </>
  );
};
