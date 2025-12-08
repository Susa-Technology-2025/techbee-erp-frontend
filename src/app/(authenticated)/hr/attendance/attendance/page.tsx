"use client";
// pages/index.tsx
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  JSX,
  memo,
} from "react";
import type React from "react";
import Head from "next/head";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  useTheme,
  useMediaQuery,
  styled,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday,
  CheckCircle,
  Schedule,
  PersonOff,
  ExitToApp,
} from "@mui/icons-material";
import { useGetAttendancesQuery } from "../../_queries/attendances";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Define types
interface Employee {
  id: string;
  name: string;
  department: string;
  schedule: {
    [hour: string]: {
      status: "present" | "absent" | "check-in" | "check-out";
      time?: string;
      event?: any;
    };
  };
}

interface AttendanceData {
  employee: {
    id: string;
    name?: string;
    department?: string;
  };
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes?: number | null;
  earlyLeaveMinutes?: number | null;
  workedMinutes?: number | null;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardCard {
  title: string;
  value: number;
  description: string;
  icon: JSX.Element;
  color: string;
  borderColor: string;
}

// Styled components
const StyledCard = styled(Card)<{ bordercolor: string }>(({ bordercolor }) => ({
  borderLeft: `5px solid ${bordercolor}`,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const HourCell = styled(TableCell, {
  shouldForwardProp: (prop) =>
    !["status", "iscurrent", "inactive"].includes(prop as string),
})<{
  status?:
    | "present"
    | "absent"
    | "check-in"
    | "check-out"
    | "break"
    | "disabled";
  iscurrent?: boolean;
  inactive?: boolean;
}>(({ theme, status, iscurrent, inactive }) => {
  let backgroundColor = "transparent";
  let border = "none";

  if (inactive) {
    backgroundColor = theme.palette.action.disabledBackground;
  } else if (iscurrent) {
    backgroundColor = theme.palette.primary.light;
  }

  if (!inactive) {
    switch (status) {
      case "check-in":
        backgroundColor = "#90ee90"; // light green
        break;
      case "check-out":
        backgroundColor = "#ffb6c1"; // light pink
        break;
      case "break":
        backgroundColor = "#ffe066"; // yellow for break
        break;
      case "absent":
        backgroundColor = "#ffcccb"; // light red
        break;
      case "present":
        backgroundColor = "#f0fff0"; // very light green
        border = "1px solid #ddd";
        break;
      case "disabled":
        backgroundColor = theme.palette.action.disabledBackground;
        break;
    }
  }

  return {
    minWidth: 60,
    height: 40,
    backgroundColor,
    border,
    borderRadius: status ? "4px" : "none",
    position: "relative",
    textAlign: "center",
    padding: 0,
  };
});

const LegendColor = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  width: 20,
  height: 20,
  borderRadius: 4,
  backgroundColor: color,
}));

// Memoized Components
const MemoizedEmployeeRow = memo(
  ({
    employee,
    hours,
    isToday,
    currentEATHour,
    onHourClick,
  }: {
    employee: Employee;
    hours: string[];
    isToday: boolean;
    currentEATHour: number;
    onHourClick: (hourData: any) => void;
  }) => {
    return (
      <TableRow hover>
        <TableCell>
          <Typography fontWeight={600}>{employee.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {employee.department}
          </Typography>
        </TableCell>
        {hours.map((hour) => {
          const hourData = employee.schedule[hour];
          const hourNum = parseInt(hour.split(":")[0], 10);
          const isCurrent = isToday && hourNum === currentEATHour;
          const isActive = isToday ? hourNum <= currentEATHour : true;

          return (
            <HourCell
              key={hour}
              status={hourData?.status}
              iscurrent={isCurrent}
              inactive={!isActive}
              onClick={() => onHourClick(hourData)}
              sx={{ cursor: !isToday ? "pointer" : "default" }}
            >
              {isActive && hourData?.time && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {hourData.time}
                </Typography>
              )}
            </HourCell>
          );
        })}
      </TableRow>
    );
  }
);

MemoizedEmployeeRow.displayName = "MemoizedEmployeeRow";

// Virtualized Table Component for Large Datasets
const VirtualizedTable = memo(
  ({
    employees,
    hours,
    isToday,
    currentEATHour,
    onHourClick,
  }: {
    employees: Employee[];
    hours: string[];
    isToday: boolean;
    currentEATHour: number;
    onHourClick: (hourData: any) => void;
  }) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
    const tableRef = useRef<HTMLDivElement>(null);
    const rowHeight = 60; // Approximate row height

    const handleScroll = useCallback(() => {
      if (!tableRef.current) return;

      const scrollTop = tableRef.current.scrollTop;
      const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 10);
      const end = Math.min(
        employees.length,
        start + Math.ceil(tableRef.current.clientHeight / rowHeight) + 20
      );

      setVisibleRange({ start, end });
    }, [employees.length]);

    useEffect(() => {
      const tableElement = tableRef.current;
      if (tableElement) {
        tableElement.addEventListener("scroll", handleScroll, {
          passive: true,
        });
        handleScroll(); // Initial calculation
        return () => tableElement.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    const visibleEmployees = employees.slice(
      visibleRange.start,
      visibleRange.end
    );

    return (
      <Box
        ref={tableRef}
        sx={{
          width: "100%",
          height: "600px",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Spacer for rows above visible area */}
        <Box sx={{ height: visibleRange.start * rowHeight }} />

        <Table
          sx={{
            minWidth: 1200,
            position: "relative",
          }}
        >
          <TableBody>
            {visibleEmployees.map((employee) => (
              <MemoizedEmployeeRow
                key={employee.id}
                employee={employee}
                hours={hours}
                isToday={isToday}
                currentEATHour={currentEATHour}
                onHourClick={onHourClick}
              />
            ))}
          </TableBody>
        </Table>

        {/* Spacer for rows below visible area */}
        <Box
          sx={{
            height: Math.max(
              0,
              (employees.length - visibleRange.end) * rowHeight
            ),
          }}
        />
      </Box>
    );
  }
);

VirtualizedTable.displayName = "VirtualizedTable";

// Helper functions
const formatDateForAPI = (date: Date): string => {
  return date.toISOString(); // YYYY-MM-DD
};

const getHourFromTimeString = (timeString: string | null): string | null => {
  if (!timeString) return null;

  try {
    const date = new Date(timeString);
    return `${date.getHours()}:00`;
  } catch (e) {
    console.error("Error parsing time string:", e);
    return null;
  }
};

const getStatusFromAttendance = (
  attendance: AttendanceData
): "present" | "absent" | "check-in" | "check-out" => {
  if (attendance.status === "Absent") return "absent";
  if (attendance.checkIn && !attendance.checkOut) return "check-in";
  if (attendance.checkOut) return "check-out";
  return "present";
};

// Main component
export default function TimesheetTracker() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentDate, setCurrentDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentEATHour, setCurrentEATHour] = useState<number>(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Africa/Nairobi",
    });
    const parts = formatter.formatToParts(new Date());
    const hourStr = parts.find((p) => p.type === "hour")?.value ?? "00";
    return parseInt(hourStr, 10);
  });

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch attendance data
  const {
    data: attendanceData,
    isLoading,
    refetch,
  } = useDataQuery<any>({
    apiEndPoint: `https://api.techbee.et/api/hr/attendances?date=${formatDateForAPI(
      selectedDate
    )}`,
    enabled: !!selectedDate, // Only fetch when selectedDate is available
  });

  // Helper: extract "HH:00" from ISO string
  const getHourFromTimeString = (isoTime: string): string | null => {
    try {
      const d = new Date(isoTime);
      const h = d.getHours();
      return `${h.toString().padStart(2, "0")}:00`;
    } catch (error) {
      console.error("Error parsing time:", isoTime, error);
      return null;
    }
  };

  // Process attendance data into employee format
  const processAttendanceData = useCallback(
    (data: any, hours: string[]): Employee[] => {
      if (!data || !data.data || !Array.isArray(data.data)) {
        console.log("No valid attendance data found");
        return [];
      }

      return data.data.map((attendance: any) => {
        const schedule: {
          [hour: string]: {
            status:
              | "present"
              | "absent"
              | "check-in"
              | "check-out"
              | "break"
              | "disabled";
            time?: string;
            event?: any;
          };
        } = {};

        const nowHour = new Date().getHours();

        // Initialize all hours as absent or disabled
        hours.forEach((hour) => {
          const hourNum = parseInt(hour.split(":")[0], 10);
          schedule[hour] = {
            status: hourNum > nowHour ? "disabled" : "absent",
          };
        });

        // If no events, return basic employee info
        if (
          !attendance.events ||
          !Array.isArray(attendance.events) ||
          attendance.events.length === 0
        ) {
          return {
            id: attendance.employee?.id || attendance.id,
            name:
              `${attendance.employee?.firstName || ""} ${
                attendance.employee?.fatherName || ""
              }`.trim() ||
              `Employee ${
                attendance.employee?.id?.substring(0, 6) || "Unknown"
              }`,
            department:
              attendance.employee?.position?.title || "Unknown Department",
            schedule,
          };
        }

        // Process events
        const events = [...attendance.events].sort(
          (a, b) =>
            new Date(a.happenedAt).getTime() - new Date(b.happenedAt).getTime()
        );

        let currentStatus: "present" | "absent" | "break" = "absent";

        events.forEach((event) => {
          const eventHourStr = getHourFromTimeString(event.happenedAt);
          if (!eventHourStr) return;

          const eventHour = parseInt(eventHourStr.split(":")[0], 10);
          const hourKey = `${eventHour.toString().padStart(2, "0")}:00`;

          // Update status based on event type
          switch (event.kind) {
            case "CheckIn":
              currentStatus = "present";
              schedule[hourKey] = {
                status: "check-in",
                time: new Date(event.happenedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                event,
              };
              break;
            case "CheckOut":
              currentStatus = "absent";
              schedule[hourKey] = {
                status: "check-out",
                time: new Date(event.happenedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                event,
              };
              break;
            case "BreakStart":
              currentStatus = "break";
              schedule[hourKey] = {
                status: "break",
                time: new Date(event.happenedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                event,
              };
              break;
            case "BreakEnd":
              currentStatus = "present";
              schedule[hourKey] = {
                status: "present",
                time: new Date(event.happenedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                event,
              };
              break;
            default:
              // For unknown event types, keep current status
              schedule[hourKey] = {
                status: currentStatus,
                time: new Date(event.happenedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                event,
              };
          }
        });

        // Fill in the gaps between events
        let lastProcessedHour = -1;
        hours.forEach((hour) => {
          const hourNum = parseInt(hour.split(":")[0], 10);

          // If this hour already has an event, update last processed hour
          if (schedule[hour].event) {
            lastProcessedHour = hourNum;
            return;
          }

          // If we have processed events and this hour is after the last event, set to current status
          if (lastProcessedHour !== -1 && hourNum > lastProcessedHour) {
            schedule[hour].status = currentStatus;
          }
        });

        return {
          id: attendance.employee?.id || attendance.id,
          name:
            `${attendance.employee?.firstName || ""} ${
              attendance.employee?.fatherName || ""
            }`.trim() ||
            `Employee ${attendance.employee?.id?.substring(0, 6) || "Unknown"}`,
          department:
            attendance.employee?.position?.title || "Unknown Department",
          schedule,
        };
      });
    },
    []
  );

  const [employeesData, setEmployeesData] = useState<Employee[]>([]);

  // Memoize hours array
  const hours = useMemo(
    () => [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ],
    []
  );

  useEffect(() => {
    if (attendanceData) {
      const processedData = processAttendanceData(attendanceData, hours);
      setEmployeesData(processedData);
    } else {
      setEmployeesData([]);
    }
  }, [attendanceData, processAttendanceData, hours]);

  // Calculate dashboard stats from attendance data
  const dashboardCards: DashboardCard[] = useMemo(() => {
    if (
      !attendanceData ||
      !attendanceData.data ||
      !Array.isArray(attendanceData.data)
    )
      return [];

    const attendanceArray = attendanceData.data;

    const presentCount = attendanceArray.filter(
      (a: any) => a.presenceStatus === "Present" || a.checkIn !== null
    ).length;

    const lateCount = attendanceArray.filter(
      (a: any) => a.lateMinutes && a.lateMinutes > 0
    ).length;

    const absentCount = attendanceArray.filter(
      (a: any) => a.presenceStatus === "Absent"
    ).length;

    const earlyLeaveCount = attendanceArray.filter(
      (a: any) => a.earlyLeaveMinutes && a.earlyLeaveMinutes > 0
    ).length;

    return [
      {
        title: "Present Employees",
        value: presentCount,
        description: "Employees at work",
        icon: <CheckCircle />,
        color: "#4cc9f0",
        borderColor: "#4cc9f0",
      },
      {
        title: "Late Arrivals",
        value: lateCount,
        description: "Employees arrived late",
        icon: <Schedule />,
        color: "#f8961e",
        borderColor: "#f8961e",
      },
      {
        title: "Absent Today",
        value: absentCount,
        description: "Employees not checked in",
        icon: <PersonOff />,
        color: "#f72585",
        borderColor: "#f72585",
      },
      {
        title: "Left Early",
        value: earlyLeaveCount,
        description: "Employees left before time",
        icon: <ExitToApp />,
        color: "#4895ef",
        borderColor: "#4895ef",
      },
    ];
  }, [attendanceData]);

  const departments = useMemo(() => {
    const depts = new Set(employeesData.map((emp) => emp.department));
    return ["All Departments", ...Array.from(depts)];
  }, [employeesData]);

  const statusOptions = [
    "All Status",
    "Present",
    "Late",
    "Absent",
    "Left Early",
  ];

  // Memoize filtered employees with debounced search
  const filteredEmployees = useMemo(() => {
    return employeesData.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      const matchesDepartment =
        !departmentFilter ||
        departmentFilter === "All Departments" ||
        employee.department === departmentFilter;
      const matchesStatus = !statusFilter || statusFilter === "All Status";

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employeesData, debouncedSearchTerm, departmentFilter, statusFilter]);

  useEffect(() => {
    // Refetch data when selected date changes
    refetch();

    // Set current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, [selectedDate, refetch]);

  // Track current time in EAT and update every minute
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

  const getCurrentEATHourLabel = () =>
    `${currentEATHour.toString().padStart(2, "0")}:00`;

  const isDateTodayEAT = (date: Date) => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(date) === fmt.format(new Date());
  };

  const isToday = isDateTodayEAT(selectedDate);
  const displayDateString = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Africa/Nairobi",
      }).format(selectedDate),
    [selectedDate]
  );

  const handleOpenDate = (e: React.MouseEvent<HTMLElement>) =>
    setDateAnchorEl(e.currentTarget);
  const handleCloseDate = () => setDateAnchorEl(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // YYYY-MM-DD
    if (!value) return;
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
    setSelectedDate(dt);
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    employeeId: string;
    hour: string;
  } | null>(null);
  const [editStatus, setEditStatus] = useState<
    "present" | "absent" | "check-in" | "check-out"
  >("present");
  const [editTime, setEditTime] = useState<string>("");

  const beginEdit = (
    employeeId: string,
    hour: string,
    current?: {
      status?: "present" | "absent" | "check-in" | "check-out";
      time?: string;
    }
  ) => {
    if (isToday) return;
    setEditTarget({ employeeId, hour });
    setEditStatus((current?.status as any) || "present");
    setEditTime(current?.time || "");
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    // In a real application, you would make an API call here to update the attendance record
    // For now, we'll just update the local state
    setEmployeesData((prev: Employee[]) =>
      prev.map((emp: Employee) => {
        if (emp.id !== editTarget.employeeId) return emp;
        const next = { ...(emp.schedule || {}) };
        const payload: any = { status: editStatus };
        if (editStatus === "check-in" || editStatus === "check-out") {
          if (editTime) payload.time = editTime;
        }
        next[editTarget.hour] = payload;
        return { ...emp, schedule: next };
      })
    );
    setEditDialogOpen(false);
    setEditTarget(null);
  };

  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventDetail, setEventDetail] = useState<any | null>(null);

  const handleHourClick = useCallback((hourData: any) => {
    if (!hourData?.event) return; // No event for this hour
    setEventDetail(hourData.event);
    setEventDialogOpen(true);
  }, []);

  // Determine if we should use virtualization (for large datasets)
  const shouldUseVirtualization = filteredEmployees.length > 100;

  return (
    <Box sx={{ position: "relative" }}>
      <Head>
        <title>Employee Timesheet | HR Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Box
        sx={{
          backgroundColor: "primary.background",
          minHeight: "100vh",
          py: 3,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ maxWidth: 1800, margin: "0 auto" }}>
          {/* Header */}
          <Paper
            sx={{
              background: "#264b91",
              color: "white",
              p: 3,
              borderRadius: 2,
              mb: 3,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Typography variant="h4" component="h1" fontWeight={600}>
                <IconButton
                  onClick={handleOpenDate}
                  color="inherit"
                  size="small"
                  sx={{ p: 0, mr: 1, verticalAlign: "bottom" }}
                >
                  <CalendarToday fontSize="inherit" />
                </IconButton>
                Employee Timesheet Tracker
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  px: 2,
                  py: 1,
                  borderRadius: 4,
                }}
              >
                <IconButton
                  onClick={handleOpenDate}
                  color="inherit"
                  size="small"
                  sx={{ p: 0, mr: 1 }}
                >
                  <CalendarToday fontSize="small" />
                </IconButton>
                <Typography>{displayDateString}</Typography>
                {isLoading && (
                  <CircularProgress size={20} sx={{ color: "white", ml: 1 }} />
                )}
              </Box>
            </Box>
            <Popover
              open={Boolean(dateAnchorEl)}
              anchorEl={dateAnchorEl}
              onClose={handleCloseDate}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <Box sx={{ p: 2 }}>
                <TextField
                  type="date"
                  label="Select date"
                  InputLabelProps={{ shrink: true }}
                  value={new Intl.DateTimeFormat("en-CA", {
                    timeZone: "Africa/Nairobi",
                  }).format(selectedDate)}
                  onChange={handleDateChange}
                />
              </Box>
            </Popover>
          </Paper>

          {/* Dashboard Cards */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
              mb: 4,
              "& > *": {
                flexGrow: 1,
                minWidth: { xs: "100%", sm: 240, md: "auto" },
              },
            }}
          >
            {isLoading
              ? // Show loading state for dashboard cards
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <StyledCard key={index} bordercolor="#ddd">
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: 120,
                        }}
                      >
                        <CircularProgress />
                      </CardContent>
                    </StyledCard>
                  ))
              : // Show actual dashboard cards when data is loaded
                dashboardCards.map((card, index) => (
                  <StyledCard key={index} bordercolor={card.borderColor}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography color="textSecondary" fontWeight={500}>
                          {card.title}
                        </Typography>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: `${card.color}20`,
                            color: card.color,
                          }}
                        >
                          {card.icon}
                        </Box>
                      </Box>
                      <Typography
                        variant="h4"
                        component="div"
                        fontWeight={700}
                        gutterBottom
                      >
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                ))}
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                label="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 200, flexGrow: 1 }}
                size="small"
              />

              <TextField
                select
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                sx={{ minWidth: 200, flexGrow: 1 }}
                size="small"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 200, flexGrow: 1 }}
                size="small"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                sx={{
                  minHeight: "40px",
                  alignSelf: "flex-end",
                  flexGrow: 1,
                  maxWidth: { xs: "100%", sm: 200 },
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Paper>

          {/* Edit Dialog for past/non-today dates */}
          <Dialog
            open={eventDialogOpen}
            onClose={() => setEventDialogOpen(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle>Event Details</DialogTitle>
            <DialogContent>
              {eventDetail ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>
                    <strong>Type:</strong> {eventDetail.kind}
                  </Typography>
                  <Typography>
                    <strong>Time:</strong>{" "}
                    {new Date(eventDetail.happenedAt).toLocaleString("en-GB", {
                      hour12: false,
                    })}
                  </Typography>
                  {eventDetail.method && (
                    <Typography>
                      <strong>Method:</strong> {eventDetail.method}
                    </Typography>
                  )}
                  {eventDetail.note && (
                    <Typography>
                      <strong>Note:</strong> {eventDetail.note}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography>No details available</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEventDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Timesheet Table */}
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              mb: 3,
              boxShadow: 2,
            }}
          >
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
            ) : shouldUseVirtualization ? (
              // Virtualized table for large datasets
              <>
                <Table sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: `linear-gradient(120deg, #4361ee, #3f37c9)`,
                      }}
                    >
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Employee
                      </TableCell>
                      {hours.map((hour) => {
                        const hourNum = parseInt(hour.split(":")[0], 10);
                        const isCurrent = isToday && hourNum === currentEATHour;
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
                </Table>
                <VirtualizedTable
                  employees={filteredEmployees}
                  hours={hours}
                  isToday={isToday}
                  currentEATHour={currentEATHour}
                  onHourClick={handleHourClick}
                />
              </>
            ) : (
              // Regular table for smaller datasets
              <Box sx={{ width: "100%", overflow: "auto" }}>
                <Table sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: `linear-gradient(120deg, #4361ee, #3f37c9)`,
                      }}
                    >
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Employee
                      </TableCell>
                      {hours.map((hour) => {
                        const hourNum = parseInt(hour.split(":")[0], 10);
                        const isCurrent = isToday && hourNum === currentEATHour;
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
                      <MemoizedEmployeeRow
                        key={employee.id}
                        employee={employee}
                        hours={hours}
                        isToday={isToday}
                        currentEATHour={currentEATHour}
                        onHourClick={handleHourClick}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
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
              <LegendColor color="#ffe066" />
              <Typography variant="body2">Break</Typography>
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
              <LegendColor color="#f0fff0" sx={{ border: "1px solid #ddd" }} />
              <Typography variant="body2">Present (Working Hours)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
