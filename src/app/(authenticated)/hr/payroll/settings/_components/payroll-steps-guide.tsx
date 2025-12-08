import React, { Suspense } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Link as MuiLink,
} from "@mui/material";
import {
  PlayCircleOutline as PlayIcon,
  ArrowRightAlt as ArrowIcon,
  LightbulbOutlined as BulbIcon,
} from "@mui/icons-material";
export default () => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 6,
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: `1px solid palette.divider`,
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
      }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          bgcolor: "primary.dark",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, transparent, #ffffff20)",
            zIndex: 1,
          },
        }}
      >
        <BulbIcon sx={{ mr: 2, fontSize: 36, zIndex: 2 }} />
        <Box zIndex={2}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            Quick Setup Guide
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Get your payroll system up and running in minutes
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: { xs: 3, md: 4 }, pt: 3 }}>
        <Typography
          variant="body1"
          paragraph
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Welcome to your comprehensive payroll management system. Follow these
          steps to swiftly configure your payroll processes, from defining
          salary components to processing batches.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {[
            {
              title: "Define Rules",
              description:
                "Set up categories and specific rules for salary components.",
              action: "Start Here",
            },
            {
              title: "Build Structures",
              description: "Combine rules into flexible salary structures.",
              action: "Configure",
            },
            {
              title: "Process Batches",
              description: "Run payroll, generate payslips, and manage cycles.",
              action: "Go to Payroll",
            },
          ].map((step, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: 2,
                borderColor: "divider",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    color: "primary.contrastText",
                  }}
                >
                  <PlayIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {step.description}
                </Typography>
                <MuiLink
                  href="#"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {step.action}
                  <ArrowIcon sx={{ ml: 0.5 }} />
                </MuiLink>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Paper>
  );
};
