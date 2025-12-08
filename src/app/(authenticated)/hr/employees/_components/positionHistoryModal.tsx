import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { RHFAlert } from "@/components/form-components/RHFAlert";
import type { PositionHistory } from "@/app/(authenticated)/hr/_schemas/position-history";
import { useCreatePositionhistoriesMutation } from "@/app/(authenticated)/hr/_queries/positionHistories";

interface PositionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  onSuccess?: () => void;
  history?: PositionHistory | null;
  isEdit?: boolean;
  isLoading?: boolean;
  onSubmit?: (values: any) => Promise<void> | void;
}

const PositionHistoryModal: React.FC<PositionHistoryModalProps> = ({
  open,
  onClose,
  employeeId,
  onSuccess,
  history,
  isEdit,
  isLoading,
  onSubmit,
}) => {
  const [position, setPosition] = useState(history?.position?.id || "");
  const [startDate, setStartDate] = useState<string>(
    history?.startDate ? history.startDate.slice(0, 16) : ""
  );
  const [endDate, setEndDate] = useState<string>(
    history?.endDate ? history.endDate.slice(0, 16) : ""
  );
  const [touched, setTouched] = useState(false);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);
  const [createHistory, { isLoading: isCreating }] =
    useCreatePositionhistoriesMutation();

  useEffect(() => {
    if (history && isEdit) {
      setPosition(history.position?.id || "");
      setStartDate(history.startDate ? history.startDate.slice(0, 16) : "");
      setEndDate(history.endDate ? history.endDate.slice(0, 16) : "");
    } else if (!open) {
      setPosition("");
      setStartDate("");
      setEndDate("");
      setTouched(false);
    }
  }, [history, isEdit, open]);

  const isValid = position && startDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setAlert(null);
    if (!isValid) return;
    if (isEdit && onSubmit) {
      await onSubmit({
        employeeId,
        position,
        startDate,
        endDate,
      });
      return;
    }
    try {
      const payload = {
        employee: { id: employeeId },
        position: { id: position },
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      };
      await createHistory(payload).unwrap();
      setAlert({
        status: "success",
        message: "Position history created successfully!",
      });
      setTimeout(() => {
        setAlert(null);
        onClose();
        setPosition("");
        setStartDate("");
        setEndDate("");
        setTouched(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err: any) {
      setAlert({
        status: "error",
        message:
          err?.data?.message ||
          err?.message ||
          "Failed to create position history.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 16, top: 16 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center", pb: 0 }}>
        {isEdit ? "Edit Position History" : "Create Position History"}
      </DialogTitle>
      <DialogContent>
        {alert && <RHFAlert status={alert.status} message={alert.message} />}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mt: 1, mb: 1 }}>
            <TextField
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              fullWidth
              required
              error={touched && !position}
              helperText={touched && !position ? "Position is required" : ""}
            />
            <TextField
              label="Start Date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              required
              error={touched && !startDate}
              helperText={touched && !startDate ? "Start date is required" : ""}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date (optional)"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
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

export default PositionHistoryModal;
