"use client";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useRouter } from "next/navigation";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Import the ProjectDetail component
import ProjectDetail from "../projects/_drag-and-drop/ProjectDetail";

// ========== PROJECT DETAIL PAGE ==========
export default function ProjectDetailPage() {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    data: projectData,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
  } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/project/projects/${projectId}`,
    enabled: !!projectId,
    noFilter: true,
  });

  const handleBackToList = () => {
    router.push("/project"); // Or your projects list route
  };

  const handleProjectSelect = (project: any) => {
    router.push(`/projects/${project.id}`);
  };

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error?.message || "Project not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/dashboard")}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <ProjectDetail
      project={projectData}
      allProjects={[]} // Pass empty array since we don't need all projects for this view
      onBackToList={handleBackToList}
      onProjectSelect={handleProjectSelect}
    />
  );
}
