import { Box,Typography, Paper } from "@mui/material";


export default function PipelineStagePage() {

  return (
    <Box display="flex" gap={4} p={4} sx={{ width: "100%", position: "relative" }}>

      {/* Main content */}
      <Box flex={1}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4">Pipeline Stage</Typography>
          <Typography sx={{ mt: 2 }}>
            This is a test page for <strong>Pipeline Stage</strong>. will be replaced with the real page content.
          </Typography>
        </Paper>

      </Box>
    </Box>
  );
}
