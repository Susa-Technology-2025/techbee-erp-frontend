"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PlayArrow as CheckInIcon,
  ExitToApp as CheckOutIcon,
  Coffee as BreakIcon,
  Stop as StopBreakIcon,
  AccessTime as TimeIcon,
  Today as DateIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";

// Define types
interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  breaks: BreakRecord[];
  totalWorkingHours: string;
}

interface BreakRecord {
  start: string;
  end: string | null;
  duration: string | null;
}

export default function AttendanceSystem() {
  const theme = useTheme();

  // Custom hooks for mutations
  const createAttendanceMutation = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/hr/attendances",
    method: "POST",
  });
  const createRequestMutation = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/hr/attendances/correction/request",
    method: "POST",
  });
  const createAttendanceEventMutation = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/hr/attendanceEvents",
    method: "POST",
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<
    "checked-out" | "checked-in" | "on-break"
  >("checked-out");
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const session = useSelector((state: RootState) => state.session);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [op, setOp] = useState<"add" | "replace" | "remove">("add");
  const [kind, setKind] = useState<
    "CheckIn" | "CheckOut" | "BreakStart" | "BreakEnd" | "ManualAdjust"
  >("CheckIn");
  const [at, setAt] = useState<string>("");
  const [oldAt, setOldAt] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  useEffect(() => {
    if (session?.user?.employeeId) {
      setEmployeeId(session.user.employeeId);
    }
  }, [session]);
  // Data query for attendance
  const {
    data: employeeAttendanceData,
    isLoading: isAttendanceLoading,
    refetch: refetchAttendance,
  } = useDataQuery<any>({
    apiEndPoint: employeeId
      ? `https://api.techbee.et/api/hr/attendances?where[employee][id]=${employeeId}`
      : "",
    enabled: !!employeeId,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Process attendance data when it changes
  useEffect(() => {
    if (employeeAttendanceData && employeeAttendanceData.data.length > 0) {
      console.log("employeeAttendanceData", employeeAttendanceData);
      processAttendanceData(employeeAttendanceData.data);
    } else if (
      employeeAttendanceData &&
      employeeAttendanceData.data.length === 0
    ) {
      // No attendance data found
      setAttendanceStatus("checked-out");
      setCurrentRecord(null);
      setAttendanceHistory([]);
      setIsHistoryLoading(false);
    }
  }, [employeeAttendanceData]);

  // ========== HELPER FUNCTIONS ==========

  const calculateBreakDuration = (start: string, end: string): string => {
    try {
      const [startHours, startMinutes, startSeconds] = start
        .split(":")
        .map(Number);
      const [endHours, endMinutes, endSeconds] = end.split(":").map(Number);
      const totalStartMinutes =
        startHours * 60 + startMinutes + startSeconds / 60;
      const totalEndMinutes = endHours * 60 + endMinutes + endSeconds / 60;
      const durationMinutes = Math.max(0, totalEndMinutes - totalStartMinutes);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = Math.floor(durationMinutes % 60);
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
          minutes !== 1 ? "s" : ""
        }`;
      }
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } catch (error) {
      return "Unknown duration";
    }
  };

  const calculateWorkingHours = (
    checkIn: string,
    checkOut: string,
    breaks: BreakRecord[]
  ): string => {
    try {
      const [checkInHours, checkInMinutes, checkInSeconds] = checkIn
        .split(":")
        .map(Number);
      const [checkOutHours, checkOutMinutes, checkOutSeconds] = checkOut
        .split(":")
        .map(Number);
      const totalCheckInMinutes =
        checkInHours * 60 + checkInMinutes + checkInSeconds / 60;
      const totalCheckOutMinutes =
        checkOutHours * 60 + checkOutMinutes + checkOutSeconds / 60;
      let totalBreakMinutes = 0;
      breaks.forEach((breakRecord) => {
        if (breakRecord.end && breakRecord.start) {
          const [breakStartHours, breakStartMinutes, breakStartSeconds] =
            breakRecord.start.split(":").map(Number);
          const [breakEndHours, breakEndMinutes, breakEndSeconds] =
            breakRecord.end.split(":").map(Number);
          const totalBreakStartMinutes =
            breakStartHours * 60 + breakStartMinutes + breakStartSeconds / 60;
          const totalBreakEndMinutes =
            breakEndHours * 60 + breakEndMinutes + breakEndSeconds / 60;
          totalBreakMinutes += Math.max(
            0,
            totalBreakEndMinutes - totalBreakStartMinutes
          );
        }
      });
      const totalWorkingMinutes = Math.max(
        0,
        totalCheckOutMinutes - totalCheckInMinutes - totalBreakMinutes
      );
      const hours = Math.floor(totalWorkingMinutes / 60);
      const minutes = Math.floor(totalWorkingMinutes % 60);
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
          minutes !== 1 ? "s" : ""
        }`;
      }
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } catch (error) {
      return "Unknown duration";
    }
  };

  // ========== DATA PROCESSING FUNCTIONS ==========

  const processAttendanceData = useCallback((attendanceData: any[]) => {
    const today = format(new Date(), "yyyy-MM-dd");
    console.log("attendanceData", attendanceData);
    // Process today's attendance
    const todayAttendance = attendanceData.find(
      (att: any) => att.date === today
    );
    processTodayAttendance(todayAttendance);

    // Process history
    const historyRecords = processAttendanceHistory(attendanceData, today);
    setAttendanceHistory(historyRecords);

    setIsHistoryLoading(false);
  }, []);

  const processTodayAttendance = useCallback((todayAttendance: any) => {
    if (!todayAttendance) {
      setAttendanceStatus("checked-out");
      setCurrentRecord(null);
      return;
    }

    const events = todayAttendance.events || [];
    let status: "checked-out" | "checked-in" | "on-break" = "checked-out";

    // Check if checked in
    const checkInEvent = events.find((e: any) => e.kind === "CheckIn");
    if (checkInEvent) {
      status = "checked-in";
    }

    // Check if on break
    const breakStartEvents = events
      .filter((e: any) => e.kind === "BreakStart")
      .sort(
        (a: any, b: any) =>
          new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime()
      );

    if (breakStartEvents.length > 0) {
      const lastBreakStart = breakStartEvents[0];
      const hasBreakEnd = events.some(
        (e: any) =>
          e.kind === "BreakEnd" &&
          new Date(e.happenedAt) > new Date(lastBreakStart.happenedAt)
      );
      if (!hasBreakEnd) {
        status = "on-break";
      }
    }

    // Set current record
    const currentRecordData: AttendanceRecord = {
      id: todayAttendance.id,
      date: todayAttendance.date,
      checkIn: checkInEvent
        ? format(new Date(checkInEvent.happenedAt), "HH:mm:ss")
        : null,
      checkOut: todayAttendance.checkOut
        ? format(new Date(todayAttendance.checkOut), "HH:mm:ss")
        : null,
      breaks: breakStartEvents.map((b: any) => {
        const breakEndEvent = events.find(
          (e: any) =>
            e.kind === "BreakEnd" &&
            new Date(e.happenedAt) > new Date(b.happenedAt)
        );
        return {
          start: format(new Date(b.happenedAt), "HH:mm:ss"),
          end: breakEndEvent
            ? format(new Date(breakEndEvent.happenedAt), "HH:mm:ss")
            : null,
          duration: breakEndEvent
            ? calculateBreakDuration(
                format(new Date(b.happenedAt), "HH:mm:ss"),
                format(new Date(breakEndEvent.happenedAt), "HH:mm:ss")
              )
            : null,
        };
      }),
      totalWorkingHours: todayAttendance.generatedWorkEntry?.hours
        ? `${todayAttendance.generatedWorkEntry.hours} hours`
        : "0 hours",
    };

    setCurrentRecord(currentRecordData);
    setAttendanceStatus(status);
  }, []);

  const processAttendanceHistory = useCallback(
    (attendanceData: any[], today: string) => {
      return attendanceData
        .filter((attendance: any) => attendance.date !== today)
        .map((attendance: any) => {
          const breaks: BreakRecord[] = [];
          const events = attendance.events || [];

          // Process breaks from events
          let currentBreak: Partial<BreakRecord> | null = null;
          const sortedEvents = [...events].sort(
            (a: any, b: any) =>
              new Date(a.happenedAt).getTime() -
              new Date(b.happenedAt).getTime()
          );

          sortedEvents.forEach((event: any) => {
            if (event.kind === "BreakStart") {
              currentBreak = {
                start: format(new Date(event.happenedAt), "HH:mm:ss"),
              };
            } else if (event.kind === "BreakEnd" && currentBreak) {
              const breakEnd = format(new Date(event.happenedAt), "HH:mm:ss");
              currentBreak.end = breakEnd;
              currentBreak.duration = calculateBreakDuration(
                currentBreak.start!,
                breakEnd
              );
              breaks.push(currentBreak as BreakRecord);
              currentBreak = null;
            }
          });

          // Add unfinished break
          if (currentBreak) {
            breaks.push({
              start: currentBreak.start!,
              end: null,
              duration: null,
            });
          }

          // Calculate total working hours
          let totalWorkingHours = "0 hours";
          if (attendance.workedMinutes && attendance.workedMinutes > 0) {
            const hours = Math.floor(attendance.workedMinutes / 60);
            const minutes = attendance.workedMinutes % 60;
            if (hours > 0) {
              totalWorkingHours = `${hours} hour${
                hours > 1 ? "s" : ""
              } ${minutes} minute${minutes !== 1 ? "s" : ""}`;
            } else {
              totalWorkingHours = `${minutes} minute${
                minutes !== 1 ? "s" : ""
              }`;
            }
          } else if (attendance.checkIn && attendance.checkOut) {
            const checkInTime = format(
              new Date(attendance.checkIn),
              "HH:mm:ss"
            );
            const checkOutTime = format(
              new Date(attendance.checkOut),
              "HH:mm:ss"
            );
            totalWorkingHours = calculateWorkingHours(
              checkInTime,
              checkOutTime,
              breaks
            );
          } else if (attendance.generatedWorkEntry?.hours) {
            const hours = attendance.generatedWorkEntry.hours;
            if (hours >= 1) {
              const wholeHours = Math.floor(hours);
              const minutes = Math.round((hours - wholeHours) * 60);
              totalWorkingHours = `${wholeHours} hour${
                wholeHours > 1 ? "s" : ""
              } ${minutes} minute${minutes !== 1 ? "s" : ""}`;
            } else {
              const minutes = Math.round(hours * 60);
              totalWorkingHours = `${minutes} minute${
                minutes !== 1 ? "s" : ""
              }`;
            }
          }

          return {
            id: attendance.id,
            date: attendance.date,
            checkIn: attendance.checkIn
              ? format(new Date(attendance.checkIn), "HH:mm:ss")
              : null,
            checkOut: attendance.checkOut
              ? format(new Date(attendance.checkOut), "HH:mm:ss")
              : null,
            breaks,
            totalWorkingHours,
          };
        })
        .sort(
          (a: AttendanceRecord, b: AttendanceRecord) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },
    []
  );

  // ========== EVENT HANDLERS ==========

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCheckIn = async () => {
    if (!employeeId) {
      showSnackbar("Employee ID not found. Please refresh the page.", "error");
      return;
    }

    const payload = {
      employee: { id: employeeId },
      date: format(currentTime, "yyyy-MM-dd"),
      checkIn: currentTime.toISOString(),
    };

    try {
      const checkinData = await createAttendanceMutation.mutateAsync(payload);
      setAttendanceStatus("checked-in");
      setCurrentRecord({
        id: checkinData.id,
        date: payload.date,
        checkIn: format(currentTime, "HH:mm:ss"),
        checkOut: null,
        breaks: [],
        totalWorkingHours: "0 hours",
      });
      showSnackbar("Checked in successfully!", "success");

      // Refresh attendance data
      refetchAttendance();
    } catch (error) {
      console.error("Failed to check in:", error);
      showSnackbar("Failed to check in. Please try again.", "error");
    }
  };

  const handleBreakStart = async () => {
    if (!currentRecord || !employeeId) {
      showSnackbar("No active attendance record found", "error");
      return;
    }

    try {
      await createAttendanceEventMutation.mutateAsync({
        attendance: { id: currentRecord.id },
        kind: "BreakStart",
        happenedAt: new Date().toISOString(),
        method: "Manual",
        note: "Break started",
      });

      // Update local state
      const updatedRecord = {
        ...currentRecord,
        breaks: [
          ...currentRecord.breaks,
          {
            start: format(currentTime, "HH:mm:ss"),
            end: null,
            duration: null,
          },
        ],
      };
      setCurrentRecord(updatedRecord);
      setAttendanceStatus("on-break");

      showSnackbar("Break started successfully!", "success");
      refetchAttendance();
    } catch (error) {
      console.error("Break Start error:", error);
      showSnackbar("Failed to start break. Please try again.", "error");
    }
  };

  const handleBreakEnd = async () => {
    if (!currentRecord || !employeeId) {
      showSnackbar("No active attendance record found", "error");
      return;
    }

    try {
      await createAttendanceEventMutation.mutateAsync({
        attendance: { id: currentRecord.id },
        kind: "BreakEnd",
        happenedAt: new Date().toISOString(),
        method: "Manual",
        note: "Break ended",
      });

      // Update local state
      if (currentRecord.breaks.length > 0) {
        const lastBreakIndex = currentRecord.breaks.length - 1;
        const lastBreak = currentRecord.breaks[lastBreakIndex];

        if (!lastBreak.end) {
          const breakEnd = format(currentTime, "HH:mm:ss");
          const breakDuration = calculateBreakDuration(
            lastBreak.start,
            breakEnd
          );

          const updatedBreaks = [...currentRecord.breaks];
          updatedBreaks[lastBreakIndex] = {
            ...lastBreak,
            end: breakEnd,
            duration: breakDuration,
          };

          const updatedRecord = {
            ...currentRecord,
            breaks: updatedBreaks,
          };

          setCurrentRecord(updatedRecord);
          setAttendanceStatus("checked-in");
          showSnackbar("Break ended successfully!", "success");
          refetchAttendance();
        }
      }
    } catch (error) {
      console.error("Break End error:", error);
      showSnackbar("Failed to end break. Please try again.", "error");
    }
  };

  const handleCheckOutEvent = async () => {
    if (!currentRecord || !employeeId) {
      showSnackbar("No active attendance record found", "error");
      return;
    }

    try {
      await createAttendanceEventMutation.mutateAsync({
        attendance: { id: currentRecord.id },
        kind: "CheckOut",
        happenedAt: new Date().toISOString(),
        method: "Manual",
        note: "Checked out",
      });

      // Update local state
      const updatedRecord = {
        ...currentRecord,
        checkOut: format(currentTime, "HH:mm:ss"),
        totalWorkingHours: calculateWorkingHours(
          currentRecord.checkIn!,
          format(currentTime, "HH:mm:ss"),
          currentRecord.breaks
        ),
      };

      setAttendanceHistory((prev) => [updatedRecord, ...prev]);
      setCurrentRecord(null);
      setAttendanceStatus("checked-out");

      showSnackbar("Checked out successfully!", "success");
      refetchAttendance();
    } catch (error) {
      console.error("CheckOut error:", error);
      showSnackbar("Failed to check out. Please try again.", "error");
    }
  };

  const handleRequest = async (
    record: AttendanceRecord,
    values: { reason: string; ops: any[] }
  ) => {
    if (!employeeId) return;

    const payload = {
      attendanceId: record.id,
      employeeId,
      reason: values.reason,
      ops: values.ops,
    };

    try {
      const requestData = await createRequestMutation.mutateAsync(payload);
      showSnackbar(
        requestData.message || "Correction submitted successfully!",
        "success"
      );
    } catch (error: any) {
      showSnackbar(error?.message || "Something went wrong!", "error");
      console.error("Failed to create request:", error);
    } finally {
      handleCloseDialog();
    }
  };

  // ========== DIALOG HANDLERS ==========

  const toLocalInputValue = (iso?: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");

    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const handleOpenDialog = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setReason("");
    setOp("add");
    setKind("CheckIn");
    setAt("");
    setOldAt("");
    setNote("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "success";
      case "checked-out":
        return "default";
      case "on-break":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#4b6cb7" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Employee Attendance System
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TimeIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              {format(currentTime, "HH:mm:ss")}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
            mb: 4,
          }}
        >
          {/* Status Card */}
          <Card sx={{ minWidth: isMobile ? "100%" : 300, flex: 1 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography color="textSecondary" gutterBottom>
                Today's Date
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <DateIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" component="div">
                  {format(currentTime, "EEEE, MMMM do, yyyy")}
                </Typography>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                Current Status
              </Typography>
              <Chip
                label={attendanceStatus.replace("-", " ").toUpperCase()}
                color={getStatusColor(attendanceStatus) as any}
                sx={{ fontSize: "1rem", p: 2, mb: 2 }}
              />
              {currentRecord && currentRecord.checkIn && (
                <>
                  <Typography color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                    Checked In At
                  </Typography>
                  <Typography variant="h6" component="div">
                    {currentRecord.checkIn}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card sx={{ minWidth: isMobile ? "100%" : 400, flex: 1 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Attendance Actions
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckInIcon />}
                  onClick={handleCheckIn}
                  disabled={
                    attendanceStatus !== "checked-out" ||
                    createAttendanceMutation.isPending
                  }
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {createAttendanceMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Check In"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<BreakIcon />}
                  onClick={handleBreakStart}
                  disabled={
                    attendanceStatus !== "checked-in" ||
                    createAttendanceEventMutation.isPending
                  }
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {createAttendanceEventMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Start Break"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<StopBreakIcon />}
                  onClick={handleBreakEnd}
                  disabled={
                    attendanceStatus !== "on-break" ||
                    createAttendanceEventMutation.isPending
                  }
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {createAttendanceEventMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Stop Break"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CheckOutIcon />}
                  onClick={handleCheckOutEvent}
                  disabled={
                    attendanceStatus === "checked-out" ||
                    attendanceStatus === "on-break" ||
                    createAttendanceEventMutation.isPending
                  }
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {createAttendanceEventMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Check Out"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Attendance History */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <Typography variant="h6">
              Attendance History
              {isAttendanceLoading && (
                <CircularProgress size={16} sx={{ ml: 2 }} />
              )}
            </Typography>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Breaks</TableCell>
                  <TableCell>Working Hours</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isAttendanceLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 3,
                        }}
                      >
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                        <Typography variant="body2" color="textSecondary">
                          Loading attendance history...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : attendanceHistory.length > 0 ? (
                  attendanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{record.checkIn || "-"}</TableCell>
                      <TableCell>{record.checkOut || "-"}</TableCell>
                      <TableCell>
                        {record.breaks.length > 0 ? (
                          <Box>
                            {record.breaks.map((breakRecord, index) => (
                              <Typography key={index} variant="body2">
                                {breakRecord.start} -{" "}
                                {breakRecord.end || "Ongoing"}
                                {breakRecord.duration &&
                                  ` (${breakRecord.duration})`}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          "No breaks"
                        )}
                      </TableCell>
                      <TableCell>{record.totalWorkingHours}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenDialog(record)}
                        >
                          Request Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No attendance history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Attendance Correction</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason"
            fullWidth
            margin="dense"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <TextField
            select
            label="Operation"
            fullWidth
            margin="dense"
            value={op}
            onChange={(e) =>
              setOp(e.target.value as "add" | "replace" | "remove")
            }
            SelectProps={{ native: true }}
          >
            <option value="add">Add</option>
            <option value="replace">Replace</option>
            <option value="remove">Remove</option>
          </TextField>

          <TextField
            select
            label="Kind"
            fullWidth
            margin="dense"
            value={kind}
            onChange={(e) =>
              setKind(
                e.target.value as
                  | "CheckIn"
                  | "CheckOut"
                  | "BreakStart"
                  | "BreakEnd"
                  | "ManualAdjust"
              )
            }
            SelectProps={{ native: true }}
          >
            <option value="CheckIn">Check-In</option>
            <option value="CheckOut">Check-Out</option>
            <option value="BreakStart">Break Start</option>
            <option value="BreakEnd">Break End</option>
            <option value="ManualAdjust">Manual Adjust</option>
          </TextField>

          {(op === "replace" || op === "remove") && (
            <TextField
              label="Old Time"
              type="datetime-local"
              fullWidth
              margin="dense"
              value={toLocalInputValue(oldAt)}
              onChange={(e) => setOldAt(new Date(e.target.value).toISOString())}
              InputLabelProps={{ shrink: true }}
            />
          )}

          {(op === "add" || op === "replace") && (
            <TextField
              label="New Time"
              type="datetime-local"
              fullWidth
              margin="dense"
              value={toLocalInputValue(at)}
              onChange={(e) => setAt(new Date(e.target.value).toISOString())}
              InputLabelProps={{ shrink: true }}
            />
          )}

          <TextField
            label="Note"
            fullWidth
            margin="dense"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedRecord) {
                const ops: any[] = [
                  {
                    op,
                    kind,
                    ...(at ? { at } : {}),
                    ...(oldAt ? { oldAt } : {}),
                    ...(note ? { note } : {}),
                  },
                ];
                handleRequest(selectedRecord, { reason, ops });
              }
            }}
            disabled={createRequestMutation.isPending}
          >
            {createRequestMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
