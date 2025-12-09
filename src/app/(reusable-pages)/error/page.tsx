// app/error/page.tsx
import { Box, Typography, Button, Paper, Link } from "@mui/material";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

export default function ErrorPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "backgroundSection.main",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 4,
          backgroundColor: "section.main",
        }}
      >
        <ReportProblemRoundedIcon
          sx={{ fontSize: 60, mb: 2, color: "backgroundSection.contrastText" }}
        />
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color="backgroundSection.contrastText"
        >
          TechBee ERP — Server Error
        </Typography>
        <Typography variant="body1" color="section.contrastText" sx={{ mb: 3 }}>
          Something went wrong while processing your request. The issue will be
          automatically logged and our developers will review it shortly.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          sx={{ borderRadius: 3, textTransform: "none" }}
        >
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
