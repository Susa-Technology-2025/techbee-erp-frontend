import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";

const summaryData = {
  welcomeMessage: "Welcome back, Jane Doe!",
  leaveBalance: 15,
  pendingRequests: 2,
  upcomingHolidays: [{ name: "New Year's Day", date: "Jan 1, 2026" }],
  announcements: [
    { title: "New Q1 Performance Review", date: "Nov 15, 2025" },
    { title: "Annual Meeting", date: "Dec 10, 2025" },
  ],
  requestsSummary: {
    submitted: 25,
    approved: 18,
    pending: 5,
    rejected: 2,
  },
  claimsSummary: {
    submitted: 12,
    approved: 9,
    totalReimbursed: "$1,250",
  },
  leavesByType: [
    { type: "Sick Leave", count: 3, icon: <LocalHospitalIcon /> },
    { type: "Vacation", count: 12, icon: <CardTravelIcon /> },
    { type: "Holiday", count: 10, icon: <HolidayVillageIcon /> },
  ],
};

const SelfServiceDashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WorkOffIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Leave Balance
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.leaveBalance}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Upcoming Holiday
                </Typography>
              </Box>
              <Typography variant="h5" color="text.secondary">
                {summaryData.upcomingHolidays[0].name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {summaryData.upcomingHolidays[0].date}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Requests Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PostAddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Submitted
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.requestsSummary.submitted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CheckCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Approved
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.requestsSummary.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PendingActionsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.requestsSummary.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CancelOutlinedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Rejected
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.requestsSummary.rejected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Claims Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PostAddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Claims Submitted
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.claimsSummary.submitted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CheckCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Claims Approved
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.claimsSummary.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Reimbursed
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary">
                {summaryData.claimsSummary.totalReimbursed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Leave Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WorkOffIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Leaves by Type
                </Typography>
              </Box>
              <List>
                {summaryData.leavesByType.map((leave, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {leave.icon}
                    </ListItemIcon>
                    <ListItemText primary={`${leave.type}: ${leave.count}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Announcements
            </Typography>
            {summaryData.announcements.map((announcement, index) => (
              <Box
                key={index}
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 1 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {announcement.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {announcement.date}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelfServiceDashboard;
