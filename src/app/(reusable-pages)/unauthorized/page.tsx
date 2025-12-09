// app/unauthorized/page.tsx
import { Box, Typography, Button, Paper, Link } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

export default function UnauthorizedPage() {
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
        <LockRoundedIcon
          sx={{ fontSize: 60, mb: 2, color: "backgroundSection.contrastText" }}
        />
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color="backgroundSection.contrastText"
        >
          TechBee ERP — Access Denied
        </Typography>
        <Typography variant="body1" color="section.contrastText" sx={{ mb: 3 }}>
          You don’t have permission to access this page. please contact your
          system admin to get the right permissions.
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
