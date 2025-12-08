import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import {
  Warning as ReminderIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";

export default function CompactRemindersWidget() {
  const reminders = [
    {
      id: 1,
      text: "Submit quarterly tax report",
      time: "Today 3:00 PM",
      priority: "high",
    },
    {
      id: 2,
      text: "Approve employee leave requests",
      time: "Tomorrow 10:00 AM",
      priority: "medium",
    },
    {
      id: 3,
      text: "Inventory restock alert",
      time: "In 2 days",
      priority: "low",
    },
  ];

  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <ReminderIcon color="primary" sx={{ fontSize: 20, mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Reminders
          </Typography>
        </Box>
        <List dense sx={{ py: 0 }}>
          {reminders.map((reminder) => (
            <ListItem
              key={reminder.id}
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
                <ReminderIcon
                  color={
                    reminder.priority === "high"
                      ? "error"
                      : reminder.priority === "medium"
                      ? "warning"
                      : "success"
                  }
                  sx={{ fontSize: 16 }}
                />
              </ListItemIcon>
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  noWrap
                  fontWeight={reminder.priority === "high" ? "bold" : "normal"}
                >
                  {reminder.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reminder.time}
                </Typography>
              </Box>
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
          View All
        </Button>
      </CardContent>
    </Card>
  );
}
