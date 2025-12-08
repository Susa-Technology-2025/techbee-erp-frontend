"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  CardActionArea,
  Grid,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

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

interface MyApplicationsTabProps {
  applications: Application[];
  handleApplicationCardClick: (application: Application) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => "success" | "error" | "info" | "default";
}

const MyApplicationsTab = ({
  applications,
  handleApplicationCardClick,
  formatDate,
  getStatusColor,
}: MyApplicationsTabProps) => {
  return (
    <Grid container spacing={3}>
      {applications && applications.length > 0 ? (
        applications.map((application, index) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={application.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleApplicationCardClick(application)}
                  sx={{ height: "100%" }}
                >
                  <CardContent sx={{ p: 2, height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {application.requisition?.position?.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTimeIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Applied: {formatDate(application.appliedAt)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EventIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Current Stage: {application.currentStage?.name}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BusinessCenterIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Status:{" "}
                          <Chip
                            label={application.status}
                            size="small"
                            color={getStatusColor(application.status)}
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))
      ) : (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" textAlign="center" color="text.secondary">
            You have not submitted any applications yet.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default MyApplicationsTab;
