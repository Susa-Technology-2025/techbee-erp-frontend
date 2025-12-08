import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import toast from "react-hot-toast";

// Convert ISO date string -> yyyy-MM-dd (required by <input type="date">)
const toDateOnly = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

// Convert yyyy-MM-dd -> ISO (optional: if backend needs ISO)
const toISO = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};

const DatesMenuContent = ({ task, onClose }) => {
  const defaultValues = {
    plannedStartDate: toDateOnly(task.plannedStartDate),
    plannedEndDate: toDateOnly(task.plannedEndDate),
  };

  const [dates, setDates] = useState(defaultValues);

  const { mutate, isPending } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/project/wbsItems/" + task.id,
    method: "PATCH",
    invalidateQueryKey: ["data", "https://api.techbee.et/api/project/wbsItems"],
    onSuccess: (success) => {
      toast.success(success?.message || "SUCCESS");
      setDates({
        plannedStartDate: toDateOnly(success?.plannedStartDate),
        plannedEndDate: toDateOnly(success?.plannedEndDate),
      });
    },
    onError: (error) => toast.error(error?.message || "ERROR"),
  });

  const handleSave = () => {
    mutate({
      plannedStartDate: toISO(dates.plannedStartDate),
      plannedEndDate: toISO(dates.plannedEndDate),
    });
  };

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <TextField
        label="Planned Start Date"
        type="date"
        value={dates.plannedStartDate}
        onChange={(e) =>
          setDates({ ...dates, plannedStartDate: e.target.value })
        }
        variant="standard"
        size="small"
        slotProps={{
          inputLabel: { shrink: true },
        }}
        fullWidth
      />

      <TextField
        label="Planned End Date"
        type="date"
        value={dates.plannedEndDate}
        onChange={(e) => setDates({ ...dates, plannedEndDate: e.target.value })}
        variant="standard"
        size="small"
        slotProps={{
          inputLabel: { shrink: true },
        }}
        fullWidth
      />

      <Button
        onClick={handleSave}
        variant="contained"
        disabled={isPending}
        size="small"
        fullWidth
      >
        {isPending ? "Saving..." : "Save Dates"}
      </Button>
    </Box>
  );
};

export default DatesMenuContent;
