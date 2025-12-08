import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCreatePerformancereviewsMutation } from "@/app/(authenticated)/hr/_queries/performanceReviews";
import { RHFAlert } from "@/components/form-components/RHFAlert";
import type { PerformanceReview } from "@/app/(authenticated)/hr/_schemas/performance-review";

interface PerformanceReviewModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  onSuccess?: () => void;
  review?: PerformanceReview | null;
  isEdit?: boolean;
  isLoading?: boolean;
  onSubmit?: (values: any) => Promise<void> | void;
}

const PerformanceReviewModal: React.FC<PerformanceReviewModalProps> = ({
  open,
  onClose,
  employeeId,
  onSuccess,
  review,
  isEdit,
  isLoading,
  onSubmit,
}) => {
  const [reviewDate, setReviewDate] = useState<Date | null>(
    review?.reviewDate ? new Date(review.reviewDate) : new Date()
  );
  const [reviewer, setReviewer] = useState(review?.reviewer || "");
  const [score, setScore] = useState<number | "">(
    typeof review?.score === "number" ? review.score : ""
  );
  const [comments, setComments] = useState(review?.comments || "");
  const [touched, setTouched] = useState(false);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);
  const [createReview, { isLoading: isCreating }] =
    useCreatePerformancereviewsMutation();

  React.useEffect(() => {
    if (review && isEdit) {
      setReviewDate(
        review.reviewDate ? new Date(review.reviewDate) : new Date()
      );
      setReviewer(review.reviewer || "");
      setScore(typeof review.score === "number" ? review.score : "");
      setComments(review.comments || "");
    } else if (!open) {
      setReviewDate(new Date());
      setReviewer("");
      setScore("");
      setComments("");
      setTouched(false);
    }
  }, [review, isEdit, open]);

  const isValid =
    reviewDate && reviewer && score !== "" && !isNaN(Number(score));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setAlert(null);
    if (!reviewDate || !reviewer || score === "" || isNaN(Number(score)))
      return;
    if (isEdit && onSubmit) {
      await onSubmit({
        employeeId,
        reviewDate,
        reviewer,
        score,
        comments,
      });
      return;
    }
    try {
      const payload = {
        employee: { id: employeeId },
        reviewDate: reviewDate.toISOString(),
        reviewer,
        score: Number(score),
        comments: comments || undefined,
      };
      await createReview(payload).unwrap();
      setAlert({
        status: "success",
        message: "Performance review created successfully!",
      });
      setTimeout(() => {
        setAlert(null);
        onClose();
        setReviewer("");
        setScore("");
        setComments("");
        setTouched(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err: any) {
      setAlert({
        status: "error",
        message:
          err?.data?.message ||
          err?.message ||
          "Failed to create performance review.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ position: "absolute", right: 16, top: 16 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center", pb: 0 }}>
        {isEdit ? "Edit Performance Review" : "Create Performance Review"}
      </DialogTitle>
      <DialogContent>
        {alert && <RHFAlert status={alert.status} message={alert.message} />}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mt: 1, mb: 1 }}>
            <TextField
              label="Review Date"
              type="datetime-local"
              value={reviewDate ? reviewDate.toISOString().slice(0, 16) : ""}
              onChange={(e) =>
                setReviewDate(e.target.value ? new Date(e.target.value) : null)
              }
              fullWidth
              required
              error={touched && !reviewDate}
              helperText={
                touched && !reviewDate ? "Review date is required" : ""
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Reviewer"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              fullWidth
              required
              error={touched && !reviewer}
              helperText={touched && !reviewer ? "Reviewer is required" : ""}
            />
            <TextField
              label="Score"
              type="number"
              value={score}
              onChange={(e) =>
                setScore(e.target.value === "" ? "" : Number(e.target.value))
              }
              fullWidth
              required
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              error={touched && (score === "" || isNaN(Number(score)))}
              helperText={
                touched && (score === "" || isNaN(Number(score)))
                  ? "Score is required and must be a number"
                  : ""
              }
            />
            <TextField
              label="Comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isValid || isLoading || isCreating}
          sx={{ minWidth: 120, fontWeight: 700 }}
        >
          {isEdit
            ? isLoading
              ? "Saving..."
              : "Save"
            : isCreating
            ? "Creating..."
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerformanceReviewModal;
