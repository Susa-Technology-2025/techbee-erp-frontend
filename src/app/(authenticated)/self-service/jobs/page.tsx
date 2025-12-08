"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { useDataQuery, useDataMutation } from "@/lib/tanstack/useDataQuery";
import { session } from "@/lib/auth/session";
import JobPostingsTab from "./_components/job-posting-tab";
import MyApplicationsTab from "./_components/my-app-tab";
import JobPortalModals from "./_components/portal-modals";
import { useDispatch } from "react-redux";
import { setAdditionalQuestions } from "@/lib/store/question-slice";

interface Position {
  id: string;
  title: string;
  code: string;
}

interface Requisition {
  id: string;
  title: string;
  status: string;
  vacancyType: string;
  employmentTerm: string;
  position: Position;
}

interface JobPosting {
  id: string;
  closingDate: string;
  createdAt: string;
  description: string;
  isActive: boolean;
  postingChannels: string[];
  publishedAt: string | null;
  recruiterUserId: string;
  requisition: Requisition;
  unpublishedAt: string | null;
  updatedAt: string;
  jobFormTemplateId: string;
}

interface JobPostingsResponse {
  data: JobPosting[];
  meta: {
    totalRowCount: number;
  };
}

interface Application {
  id: string;
  appliedAt: string;
  status: string;
  refuseReason: string;
  requisition: {
    title: string;
    position: {
      title: string;
      code: string;
    };
  };
  currentStage: {
    name: string;
  };
}

interface ApplicationsResponse {
  data: Application[];
  meta: {
    totalRowCount: number;
  };
}

interface ApplicationResponse {
  success: boolean;
  message: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ContractSigned":
      return "success";
    case "Refused":
      return "error";
    case "Pipeline":
      return "info";
    default:
      return "default";
  }
};

const JobPortal = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const { data: { data: templates } = [], isLoading: templateLoading } =
    useDataQuery<any>({
      apiEndPoint: "https://api.techbee.et/api/hr/templates",
    });
  const dispatch = useDispatch();
  const selectedTemplate =
    templates?.find((t) => t.id === selectedJob?.jobFormTemplateId) || null;

  useEffect(() => {
    if (selectedTemplate) {
      dispatch(setAdditionalQuestions(selectedTemplate.questions));
    }
  }, [selectedTemplate, dispatch]);

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [fetchedPostingData, setFetchedPostingData] = useState<
    JobPosting[] | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: jobPostingsData,
    isLoading,
    error,
  } = useDataQuery<JobPostingsResponse>({
    apiEndPoint: "https://api.techbee.et/api/hr/jobPostings",
    pagination: { pageIndex: 0, pageSize: 1000 },
  });

  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    error: errorApplications,
  } = useDataQuery<ApplicationsResponse>({
    apiEndPoint: `https://api.techbee.et/api/hr/applications?where[candidate][firstName]=${firstName}`,
    pagination: { pageIndex: 0, pageSize: 1000 },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await session();
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (jobPostingsData) {
      setFetchedPostingData(jobPostingsData);
    }
  }, [jobPostingsData]);

  const applyMutation = useDataMutation<ApplicationResponse, { jobId: string }>(
    {
      apiEndPoint: "https://api.techbee.et/api/hr/applications",
      method: "POST",
      onSuccess: () => {
        setDetailModalOpen(false);
      },
      onError: (error) => {
        console.error("Application failed:", error);
      },
    }
  );

  const handleCardClick = (job: JobPosting) => {
    setSelectedJob(job);
    setDetailModalOpen(true);
  };

  const handleCreateOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApplicationCardClick = (application: Application) => {
    setSelectedApplication(application);
    setApplicationModalOpen(true);
  };

  if (isLoading || isLoadingApplications) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || errorApplications) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading data: {error?.message || errorApplications?.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "background.paper" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="job portal tabs"
          variant="fullWidth"
        >
          <Tab label="Job Postings" />
          <Tab label="My Applications" />
        </Tabs>
      </Box>
      {value === 0 && (
        <JobPostingsTab
          jobPostings={fetchedPostingData || []}
          handleCardClick={handleCardClick}
          formatDate={formatDate}
        />
      )}
      {value === 1 && (
        <MyApplicationsTab
          applications={applicationsData?.data || []}
          handleApplicationCardClick={handleApplicationCardClick}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      )}

      <JobPortalModals
        selectedJob={selectedJob}
        selectedApplication={selectedApplication}
        detailModalOpen={detailModalOpen}
        applicationModalOpen={applicationModalOpen}
        setDetailModalOpen={setDetailModalOpen}
        setApplicationModalOpen={setApplicationModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        handleCreateOpen={handleCreateOpen}
        handleCreateClose={handleCreateClose}
        applyMutation={applyMutation}
        firstName={firstName}
        lastName={lastName}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
      />
    </Container>
  );
};

export default JobPortal;
