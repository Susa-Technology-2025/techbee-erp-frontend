"use client";

import { useGetInternaleventsQuery } from "@/app/(authenticated)/hr/_queries/internalevents";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";

export default function InternalEvents() {
  const { data: events, isLoading, error } = useGetInternaleventsQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading internal events. Please try again later.
      </Alert>
    );
  }

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={3}
      width="50vw"
      sx={{
        "& > *": {
          width: { xs: "100%", md: "calc(50% - 12px)" },
          minWidth: 0,
        },
      }}
    >
      {events.map((event) => (
        <Box key={event.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
              position: "relative",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  color: "secondary.main",
                  fontWeight: "bold",
                  whiteSpace: isMobile ? "normal" : "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  mr: { xs: 0, sm: 4 },
                }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: isMobile ? "normal" : "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {event.description}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarToday sx={{ mr: 0.5, color: "action.active" }} />
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    fontWeight: "medium",
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Date:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 0.5,
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {format(new Date(event.date), "PPP p")}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnOutlined sx={{ mr: 0.5, color: "action.active" }} />
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    fontWeight: "medium",
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Location:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 0.5,
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {event.location}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
