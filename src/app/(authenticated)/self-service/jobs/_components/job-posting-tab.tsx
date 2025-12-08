"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  CardActionArea,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  Pagination,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import JobDetailDialog from "./job-detail"; // Import the new dialog component

// --- Interfaces (No changes) ---

interface JobPosting {
  id: string;
  closingDate: string;
  description: string;
  isActive: boolean;
  postingChannels: string[];
  publishedAt: string | null;
  recruiterUserId: string;
  requisition: {
    id: string;
    title: string;
    status: string;
    vacancyType: string;
    employmentTerm: string;
    position: {
      id: string;
      title: string;
      code: string;
    } | null;
  };
  unpublishedAt: string | null;
  updatedAt: string;
}

interface JobPostingsResponse {
  data: JobPosting[];
  meta: {
    totalRowCount: number;
  };
}

const ITEMS_PER_PAGE = 9;

// --- Helper Functions (No changes) ---

const formatDate = (dateString: string): string => {
  if (!dateString) return "No closing date";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const timeDifference = date.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysLeft > 0) {
      return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;
    } else if (daysLeft === 0) {
      return "Closing today";
    }
    return "Closed";
  } catch (e) {
    return "Invalid date";
  }
};

// --- JobPostingsTab Component ---

const JobPostingsTab = () => {
  const theme = useTheme();

  // Dialog State
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = ITEMS_PER_PAGE;
  const pageIndex = currentPage - 1;

  const {
    data: jobPostingsResponse,
    isLoading,
    isError,
  } = useDataQuery<JobPostingsResponse>({
    apiEndPoint: "https://api.techbee.et/api/hr/jobPostings",
    pagination: { pageIndex, pageSize },
  });

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "active":
        return { color: "success", label: "Active" };
      case "closed":
        return { color: "error", label: "Closed" };
      case "draft":
        return { color: "warning", label: "Draft" };
      default:
        return { color: "default", label: status };
    }
  };

  const totalPages = useMemo(() => {
    if (jobPostingsResponse?.meta?.totalRowCount) {
      return Math.ceil(jobPostingsResponse.meta.totalRowCount / pageSize);
    }
    return 1;
  }, [jobPostingsResponse, pageSize]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  // NEW: Handle Card Click to open Dialog
  const handleCardClick = (job: JobPosting) => {
    setSelectedJob(job);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedJob(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError || !jobPostingsResponse) {
    return (
      <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
        Failed to load job postings. Please try again later.
      </Alert>
    );
  }

  const jobPostings = jobPostingsResponse.data || [];

  return (
    <Box sx={{ p: 1 }}>
      {jobPostings.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {jobPostings.map((job, index) => {
              const statusInfo = getStatusVariant(job.requisition.status);
              const isClosingSoon =
                job.closingDate &&
                new Date(job.closingDate).getTime() - new Date().getTime() <
                  7 * 24 * 60 * 60 * 1000 &&
                new Date(job.closingDate).getTime() - new Date().getTime() > 0;

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={job.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[1],
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "visible",
                        "&:hover": {
                          boxShadow: theme.shadows[8],
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {/* Status indicator */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 1,
                        }}
                      >
                        <Chip
                          label={statusInfo.label}
                          size="small"
                          color={statusInfo.color as any}
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                      </Box>

                      <CardActionArea
                        onClick={() => handleCardClick(job)} // Updated onClick handler
                        sx={{ height: "100%", p: 0 }}
                      >
                        <CardContent sx={{ p: 3, height: "100%" }}>
                          <Stack spacing={2.5} sx={{ height: "100%" }}>
                            {/* Header */}
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  display: "block",
                                  mb: 1,
                                }}
                              >
                                {job.requisition.vacancyType || "Vacancy"}
                              </Typography>

                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                  mb: 1,
                                  pr: 4,
                                }}
                              >
                                {job.requisition.title || "Untitled Position"}
                              </Typography>

                              {job.requisition.position?.title && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                  }}
                                >
                                  {job.requisition.position.title}
                                </Typography>
                              )}
                            </Box>

                            {/* Details */}
                            <Stack spacing={2}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                              >
                                <BusinessCenterIcon
                                  sx={{
                                    fontSize: 20,
                                    color: "text.secondary",
                                    opacity: 0.8,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {job.requisition.employmentTerm ||
                                    "Full-time"}
                                </Typography>
                              </Stack>
                            </Stack>

                            {/* Footer */}
                            <Box sx={{ mt: "auto", pt: 1 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-start"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <AccessTimeIcon
                                    sx={{
                                      fontSize: 18,
                                      color: isClosingSoon
                                        ? "warning.main"
                                        : "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: isClosingSoon
                                        ? "warning.main"
                                        : "text.secondary",
                                      fontWeight: isClosingSoon ? 600 : 500,
                                    }}
                                  >
                                    {formatDate(job.closingDate)}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Box>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
          {/* Pagination component */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                siblingCount={1}
                boundaryCount={1}
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Job Detail Dialog */}
          <JobDetailDialog
            open={openDetail}
            handleClose={handleCloseDetail}
            job={selectedJob}
          />
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 1,
              fontWeight: 500,
            }}
          >
            No job postings available
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              opacity: 0.8,
            }}
          >
            Check back later for new opportunities
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JobPostingsTab;
