import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";

const statItems = [
  {
    title: "Attendance",
    mainValue: "1,264",
    trend: "+4.2%",
    trendCaption: "vs last month",
    subLabel: "Avg. daily presence",
    subValue: "87%",
    icon: <AccessTimeIcon />,
    avatarBg: "primary.main",
  },
  {
    title: "Leave Requests",
    mainValue: "38",
    trend: "-2.5%",
    trendCaption: "vs last cycle",
    subLabel: "Pending approvals",
    subValue: "11",
    icon: <EventNoteIcon />,
    avatarBg: "warning.main",
  },
  {
    title: "Leave Types",
    mainValue: "7",
    trend: "+1",
    trendCaption: "New type added",
    subLabel: "Most used",
    subValue: "Annual Leave",
    icon: <CategoryIcon />,
    avatarBg: "info.main",
  },
  {
    title: "Exits",
    mainValue: "3",
    trend: "0%",
    trendCaption: "No change",
    subLabel: "YTD Exits",
    subValue: "12",
    icon: <LogoutIcon />,
    avatarBg: "error.main",
  },
];

export default function HrStatSection() {
  return (
    <Box
      sx={{
        width: "90%",
        mx: "auto",
        px: { xs: 0.5, sm: 1 },
        py: { xs: 1, sm: 2 },
        display: { xs: "hidden", md: "block" },
      }}
    >
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {statItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
            <Card
              elevation={1}
              sx={{
                height: { xs: 100, sm: 120, md: 140 },
                p: 3,
                borderRadius: 1.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent sx={{ p: 0, height: "100%" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: { xs: 0.5, sm: 1 } }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: item.avatarBg,
                      color: "primary.contrastText",
                      width: { xs: 28, sm: 32, md: 36 },
                      height: { xs: 28, sm: 32, md: 36 },
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.mainValue}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                      lineHeight: 1.1,
                    }}
                  >
                    {item.trend} ({item.trendCaption})
                  </Typography>
                </Box>

                <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />

                <Stack spacing={0.25}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                    }}
                  >
                    {item.subLabel}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                      fontWeight: 600,
                    }}
                  >
                    {item.subValue}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
