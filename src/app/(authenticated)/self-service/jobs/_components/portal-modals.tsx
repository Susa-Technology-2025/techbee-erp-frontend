"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MDEditor from "@uiw/react-md-editor";
import { ReusableFormModal } from "@/components/form-table/reusable-form/form-modal";
import { applySchema } from "@/lib/schemas/recruitment/apply";
import { ApplicationCreateInput } from "@/lib/schemas/recruitment/application";

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

interface JobPortalModalsProps {
  selectedJob: JobPosting | null;
  selectedApplication: Application | null;
  detailModalOpen: boolean;
  applicationModalOpen: boolean;
  setDetailModalOpen: (open: boolean) => void;
  setApplicationModalOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  handleCreateOpen: () => void;
  handleCreateClose: () => void;
  applyMutation: any;
  firstName: string;
  lastName: string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => "success" | "error" | "info" | "default";
}

const JobPortalModals = ({
  selectedJob,
  selectedApplication,
  detailModalOpen,
  applicationModalOpen,
  setDetailModalOpen,
  setApplicationModalOpen,
  isCreateModalOpen,
  handleCreateOpen,
  handleCreateClose,
  applyMutation,
  firstName,
  lastName,
  formatDate,
  getStatusColor,
}: JobPortalModalsProps) => {
  const theme = useTheme();

  return (
    <>
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedJob && (
          <>
            <Box sx={{ p: 1, position: "relative" }}>
              <IconButton
                aria-label="close"
                onClick={() => setDetailModalOpen(false)}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "grey.500",
                }}
              >
                <CloseIcon />
              </IconButton>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    p: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WorkIcon sx={{ color: "primary.main", fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {selectedJob.requisition.position?.title}
                  </Typography>
                </Box>
              </Stack>
              <Box display="flex" flexWrap="wrap" p={2} gap={1}>
                <Chip
                  label={selectedJob.requisition.status}
                  color={
                    selectedJob.requisition.status === "Open"
                      ? "success"
                      : "default"
                  }
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={selectedJob.requisition.employmentTerm}
                  variant="outlined"
                />
                <Chip
                  label={selectedJob.requisition.vacancyType}
                  variant="outlined"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Closes: ${formatDate(selectedJob.closingDate)}`}
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </Box>
            <DialogContent dividers sx={{ p: 4, pt: 0 }}>
              {selectedJob.description && (
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Job Description
                  </Typography>
                  <Box
                    sx={{
                      "& .w-md-editor": {
                        boxShadow: "none",
                        backgroundColor: "transparent",
                      },
                      "& .wmde-markdown": {
                        backgroundColor: "transparent",
                        padding: 0,
                        color: "text.primary",
                      },
                    }}
                  >
                    <MDEditor.Markdown source={selectedJob.description} />
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 2 }}>
              <Button
                onClick={() => setDetailModalOpen(false)}
                variant="outlined"
                sx={{ borderRadius: 3, px: 4 }}
              >
                Close
              </Button>
              <Button
                onClick={handleCreateOpen}
                variant="contained"
                disabled={applyMutation.isPending || !selectedJob.isActive}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {applyMutation.isPending
                  ? "Submitting..."
                  : selectedJob.isActive
                  ? "Apply Now"
                  : "InActive or Closed"}
              </Button>
            </DialogActions>
          </>
        )}
        {isCreateModalOpen && (
          <ReusableFormModal
            schema={applySchema}
            title={"Application Form"}
            formMode="create"
            defaultValues={{
              posting: { id: selectedJob?.id },
              candidate: { firstName, fatherName: lastName },
            }}
            disabledValues={{
              "posting.id": true,
              "candidate.firstName": true,
              "candidate.fatherName": true,
            }}
            sections={applySchema.meta().sections}
            onClose={handleCreateClose}
            open={isCreateModalOpen}
          />
        )}
      </Dialog>
      <Dialog
        open={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        {selectedApplication && (
          <>
            <Box sx={{ p: 1, position: "relative" }}>
              <IconButton
                aria-label="close"
                onClick={() => setApplicationModalOpen(false)}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "grey.500",
                }}
              >
                <CloseIcon />
              </IconButton>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ p: 2 }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    p: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{ color: "primary.main", fontSize: 40 }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 700 }}
                  >
                    Application for{" "}
                    {selectedApplication.requisition?.position?.title}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <DialogContent dividers sx={{ p: 4, pt: 0 }}>
              <Stack spacing={2}>
                <Typography variant="body1">
                  **Job Title:**{" "}
                  {selectedApplication.requisition?.position?.title}
                </Typography>
                <Typography variant="body1">
                  **Applied On:** {formatDate(selectedApplication.appliedAt)}
                </Typography>
                <Typography variant="body1">
                  **Current Status:**{" "}
                  <Chip
                    label={selectedApplication.status}
                    color={getStatusColor(selectedApplication.status)}
                  />
                </Typography>
                <Typography variant="body1">
                  **Current Stage:** {selectedApplication.currentStage?.name}
                </Typography>
                {selectedApplication.status === "Refused" && (
                  <Typography variant="body1" color="error">
                    **Reason for Refusal:** {selectedApplication.refuseReason}
                  </Typography>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 2 }}>
              <Button
                onClick={() => setApplicationModalOpen(false)}
                variant="outlined"
                sx={{ borderRadius: 3, px: 4 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default JobPortalModals;
