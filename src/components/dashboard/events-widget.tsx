import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Badge,
  Chip,
} from "@mui/material";
import {
  Schedule as CalendarIcon,
  EventAvailable as EventsIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";

export default function CompactEventsWidget() {
  const events = [
    { id: 1, title: "Team Meeting", date: "Today 2:00 PM", type: "meeting" },
    { id: 2, title: "Project Deadline", date: "Friday", type: "deadline" },
    { id: 3, title: "Company Anniversary", date: "June 15", type: "event" },
  ];

  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <EventsIcon color="primary" sx={{ fontSize: 20, mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Upcoming Events
          </Typography>
        </Box>
        <List dense sx={{ py: 0 }}>
          {events.map((event) => (
            <ListItem
              key={event.id}
              sx={{
                px: 0,
                py: 0.5,
                "&:not(:last-child)": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Badge badgeContent={1} color="error">
                  <CalendarIcon color="action" sx={{ fontSize: 16 }} />
                </Badge>
              </ListItemIcon>
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="body2" noWrap>
                  {event.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {event.date}
                </Typography>
              </Box>
              <Chip
                label={event.type}
                size="small"
                color={
                  event.type === "meeting"
                    ? "primary"
                    : event.type === "deadline"
                    ? "secondary"
                    : "info"
                }
                sx={{
                  ml: "auto",
                  fontSize: "0.65rem",
                  height: 20,
                }}
              />
            </ListItem>
          ))}
        </List>
        <Button
          size="small"
          endIcon={<MoreIcon fontSize="small" />}
          sx={{
            mt: 0.5,
            fontSize: "0.75rem",
            p: 0,
            minWidth: 0,
          }}
        >
          View Calendar
        </Button>
      </CardContent>
    </Card>
  );
}
