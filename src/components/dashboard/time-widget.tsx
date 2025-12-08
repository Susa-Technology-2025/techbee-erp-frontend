import { Box, Card, CardContent, Typography } from "@mui/material";
import { Today as DateIcon } from "@mui/icons-material";

export default async function CompactTimeDateWidget() {
  "use cache";
  const currentTime = new Date();
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <DateIcon color="primary" sx={{ fontSize: 20, mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Today
          </Typography>
        </Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ mb: 0.5, fontWeight: "bold" }}
        >
          {formatTime(currentTime)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDate(currentTime)}
        </Typography>
      </CardContent>
    </Card>
  );
}
