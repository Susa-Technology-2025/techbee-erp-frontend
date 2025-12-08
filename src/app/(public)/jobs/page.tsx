"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Container,
  useTheme,
} from "@mui/material";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
}

const JobsListPage = () => {
  const theme = useTheme();

  // Empty array for now - no external job openings
  const jobs: Job[] = [];

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "primary";
      case "Part-time":
        return "secondary";
      case "Contract":
        return "warning";
      case "Remote":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
          }}
        >
          Current Job Openings
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Join our team and help us build the future
        </Typography>
      </Box>

      {jobs.length === 0 ? (
        <Card
          sx={{
            textAlign: "center",
            p: 6,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: theme.palette.text.primary }}
            >
              No External Job Openings
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary }}
            >
              We currently don't have any external job openings available.
              Please check back later for new opportunities.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {jobs.map((job) => (
            <Card
              key={job.id}
              sx={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {job.title}
                  </Typography>
                  <Chip
                    label={job.type}
                    color={getJobTypeColor(job.type) as any}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                  <Chip
                    label={job.department}
                    variant="outlined"
                    size="small"
                    sx={{ color: theme.palette.text.secondary }}
                  />
                  <Chip
                    label={job.location}
                    variant="outlined"
                    size="small"
                    sx={{ color: theme.palette.text.secondary }}
                  />
                </Box>

                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {job.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default JobsListPage;
