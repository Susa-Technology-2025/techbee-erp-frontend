"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Employee type
interface Employee {
  id: string;
  name: string;
  department: string;
  schedule: {
    [hour: string]: {
      status: "present" | "absent" | "check-in" | "check-out" | "disabled";
      time?: string;
      event?: {
        id: string;
        kind: string;
        happenedAt: string;
        method?: string;
        note?: string | null;
      };
    };
  };
}

// Styled HourCell
const HourCell = styled(TableCell)<{
  status?: "present" | "absent" | "check-in" | "check-out" | "disabled";
  iscurrent?: boolean;
  inactive?: boolean;
}>(({ status, iscurrent, inactive }) => ({
  width: 40,
  height: 40,
  position: "relative",
  textAlign: "center",
  verticalAlign: "middle",
  cursor: inactive ? "default" : "pointer",
  backgroundColor:
    status === "present"
      ? "#f0fff0"
      : status === "check-in"
      ? "#90ee90"
      : status === "check-out"
      ? "#ffb6c1"
      : status === "absent"
      ? "#ffcccb"
      : "#f5f5f5",
  opacity: inactive ? 0.5 : 1,
  border: iscurrent ? "2px solid #3f37c9" : "1px solid #ddd",
}));

// Legend color square
const LegendColor = styled("span")<{ color?: string }>(({ color }) => ({
  width: 20,
  height: 20,
  backgroundColor: color || "transparent",
  display: "inline-block",
  borderRadius: 4,
}));

export default function AttendancePage() {
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState("");
  const [currentEATHour, setCurrentEATHour] = useState<number>(0);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<
    "present" | "absent" | "check-in" | "check-out"
  >("present");
  const [editTime, setEditTime] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null
  );
  const [editingHour, setEditingHour] = useState<string | null>(null);

  const statusOptions = [
    "All Status",
    "Present",
    "Late",
    "Absent",
    "Left Early",
  ];

  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Fake fetch
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setEmployeesData([
        {
          id: "1",
          name: "Hiwot",
          department: "IT",
          schedule: {
            "8:00": {
              status: "check-in",
              time: "08:30",
              event: {
                id: "evt1",
                kind: "CheckIn",
                happenedAt: "2025-05-14T08:30:00.000Z",
                method: "Manual",
              },
            },
            "17:00": {
              status: "check-out",
              time: "17:10",
              event: {
                id: "evt2",
                kind: "CheckOut",
                happenedAt: "2025-05-14T17:10:00.000Z",
              },
            },
          },
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, [selectedDate]);

  // Set current date string
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, [selectedDate]);

  // Track current time in EAT
  useEffect(() => {
    const updateHour = () => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        hour12: false,
        timeZone: "Africa/Nairobi",
      });
      const parts = formatter.formatToParts(new Date());
      const hourStr = parts.find((p) => p.type === "hour")?.value ?? "00";
      setCurrentEATHour(parseInt(hourStr, 10));
    };
    updateHour();
    const id = setInterval(updateHour, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Filters
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !departmentFilter ||
      departmentFilter === "All Departments" ||
      employee.department === departmentFilter;
    const matchesStatus = !statusFilter || statusFilter === "All Status";
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Begin edit
  const beginEdit = (
    employeeId: string,
    hour: string,
    hourData: Employee["schedule"][string]
  ) => {
    setEditingEmployeeId(employeeId);
    setEditingHour(hour);
    setEditStatus(hourData?.status || "present");
    setEditTime(hourData?.time || "");
    setEditDialogOpen(true);
  };

  // Save edit
  const saveEdit = () => {
    if (editingEmployeeId && editingHour) {
      setEmployeesData((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployeeId
            ? {
                ...emp,
                schedule: {
                  ...emp.schedule,
                  [editingHour]: {
                    ...emp.schedule[editingHour],
                    status: editStatus,
                    time: editTime,
                  },
                },
              }
            : emp
        )
      );
    }
    setEditDialogOpen(false);
  };

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  return (
    <Container maxWidth="lg" sx={{ position: "relative",mt: 4, mb: 4 }}>
      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as any)
                }
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="check-in">Check-In</MenuItem>
                <MenuItem value="check-out">Check-Out</MenuItem>
              </Select>
            </FormControl>
            {(editStatus === "check-in" || editStatus === "check-out") && (
              <TextField
                label="Time (HH:MM)"
                placeholder="09:15"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Timesheet Table */}
      <Paper sx={{ width: "100%", overflow: "hidden", mb: 3, boxShadow: 2 }}>
        <Box sx={{ width: "100%", overflow: "auto" }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow
                  sx={{
                    background: `linear-gradient(120deg, #4361ee, #3f37c9)`,
                  }}
                >
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    Employee
                  </TableCell>
                  {hours.map((hour) => {
                    const hourNum = parseInt(hour.split(":")[0], 10);
                    const isCurrent =
                      isToday && hourNum === currentEATHour;
                    const isActive = isToday
                      ? hourNum <= currentEATHour
                      : true;
                    return (
                      <TableCell
                        key={hour}
                        align="center"
                        sx={{
                          color: isActive
                            ? "white"
                            : "rgba(255,255,255,0.5)",
                          fontWeight: 600,
                          backgroundColor: isCurrent
                            ? "rgba(67, 97, 238, 0.2)"
                            : "transparent",
                        }}
                      >
                        {hour}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {employee.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >
                        {employee.department}
                      </Typography>
                    </TableCell>
                    {hours.map((hour) => {
                      const hourData = employee.schedule[hour];
                      const hourNum = parseInt(hour.split(":")[0], 10);
                      const isCurrent =
                        isToday && hourNum === currentEATHour;
                      const isActive = isToday
                        ? hourNum <= currentEATHour
                        : true;
                      return (
                        <HourCell
                          key={hour}
                          status={hourData?.status}
                          iscurrent={isCurrent}
                          inactive={!isActive}
                          onClick={() =>
                            !isToday &&
                            beginEdit(employee.id, hour, hourData)
                          }
                        >
                          {isActive && hourData?.event && (
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform:
                                  "translate(-50%, -50%)",
                              }}
                            >
                              {hourData.time}
                            </Typography>
                          )}
                        </HourCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LegendColor color="#90ee90" />
          <Typography variant="body2">Check-In Time</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LegendColor color="#ffb6c1" />
          <Typography variant="body2">Check-Out Time</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LegendColor color="#ffcccb" />
          <Typography variant="body2">Absent</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LegendColor
            color="#f0fff0"
            sx={{ border: "1px solid #ddd" }}
          />
          <Typography variant="body2">
            Present (Working Hours)
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
