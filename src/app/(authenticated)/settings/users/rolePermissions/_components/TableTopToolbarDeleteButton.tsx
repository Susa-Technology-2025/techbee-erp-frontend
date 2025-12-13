import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import { alpha, Box, Button, Paper, Typography, useTheme } from "@mui/material";
import toast from "react-hot-toast";

export const DeleteButton = ({ onClick, deleteEndPoint,invalidateQueryKey }: any) => {
  const { mutate, isPending } = useDataMutation({
  invalidateQueryKey,
    apiEndPoint: deleteEndPoint,
    method: "DELETE",
    onSuccess: (message) => {
      toast.success(message?.message ?? "DELETE success");
    },
    onError: (error) => {
      toast.error(error?.message ?? "DELETE Failed");
    },
  });
  const theme = useTheme();
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          my: 2,
          backgroundColor: alpha(theme.palette.error.main, 0.08),
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete this item?
        </Typography>
      </Paper>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
        <Button variant="outlined" onClick={onClick} sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          onClick={() => mutate({})}
          variant="contained"
          color="error"
          sx={{ minWidth: 100 }}
          loading={isPending}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};