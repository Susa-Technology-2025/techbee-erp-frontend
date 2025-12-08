"use client";

import { StyledCard } from "./_components/styles";
import {
  AccessTime,
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  Download,
  FilterList,
  PersonAdd,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  JSX,
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
} from "react";
import { useGetOvertimeGridQuery } from "../../_queries/attendances";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Define types based on your backend response
interface Employee {
  id: string;
  name: string;
  code: string;
  department: string | null;
  shiftCode: string | null;
}

interface Cell {
  date: string;
  otHours: number;
  displayTime: string | null;
}

interface Row {
  employee: Employee;
  totalOtHours: number;
  cells: Cell[];
}

interface Column {
  date: string;
  label: string;
}

interface ApiResponse {
  columns: Column[];
  rows: Row[];
  window: {
    from: string;
    to: string;
  };
}

interface DashboardCard {
  title: string;
  value: number;
  description: string;
  icon: JSX.Element;
  color: string;
  borderColor: string;
}

// Memoized Components
const MemoizedEmployeeRow = memo(
  ({ row, columns }: { row: Row; columns: Column[] }) => {
    const getAvatarInitials = useCallback((name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }, []);

    return (
      <TableRow hover>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>
              {getAvatarInitials(row.employee.name)}
            </Avatar>
            <Box>
              <Typography fontWeight={600} noWrap sx={{ maxWidth: 150 }}>
                {row.employee.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" noWrap>
                {row.employee.code}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>{row.employee.department || "N/A"}</TableCell>
        <TableCell align="right">
          <Chip
            label={`${row.totalOtHours}h`}
            color={row.totalOtHours > 0 ? "primary" : "default"}
            size="small"
          />
        </TableCell>
        {columns.map((column, columnIndex) => {
          const cell = row.cells[columnIndex];
          return (
            <TableCell key={`${row.employee.id}-${column.date}`} align="center">
              {cell && cell.otHours > 0 ? (
                <Chip
                  label={`${cell.otHours}h`}
                  color="secondary"
                  size="small"
                  variant="outlined"
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  -
                </Typography>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }
);

MemoizedEmployeeRow.displayName = "MemoizedEmployeeRow";

// Virtualized Table Component with proper horizontal scrolling
const VirtualizedTable = memo(
  ({ employees, columns }: { employees: Row[]; columns: Column[] }) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const tableBodyRef = useRef<HTMLDivElement>(null);
    const rowHeight = 70;

    const handleScroll = useCallback(() => {
      if (!tableContainerRef.current) return;

      const scrollTop = tableContainerRef.current.scrollTop;
      const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 10);
      const end = Math.min(
        employees.length,
        start +
          Math.ceil(tableContainerRef.current.clientHeight / rowHeight) +
          20
      );

      setVisibleRange({ start, end });
    }, [employees.length]);

    // Sync horizontal scrolling between header and body
    const handleHorizontalScroll = useCallback(() => {
      if (tableContainerRef.current && tableBodyRef.current) {
        const scrollLeft = tableContainerRef.current.scrollLeft;
        // Find all table elements and sync their horizontal scroll
        const tables = tableContainerRef.current.querySelectorAll("table");
        tables.forEach((table) => {
          table.parentElement!.scrollLeft = scrollLeft;
        });
      }
    }, []);

    useEffect(() => {
      const tableElement = tableContainerRef.current;
      if (tableElement) {
        tableElement.addEventListener("scroll", handleScroll, {
          passive: true,
        });
        tableElement.addEventListener("scroll", handleHorizontalScroll, {
          passive: true,
        });
        handleScroll();
        return () => {
          tableElement.removeEventListener("scroll", handleScroll);
          tableElement.removeEventListener("scroll", handleHorizontalScroll);
        };
      }
    }, [handleScroll, handleHorizontalScroll]);

    const visibleEmployees = employees.slice(
      visibleRange.start,
      visibleRange.end
    );

    return (
      <Box
        ref={tableContainerRef}
        sx={{
          width: "100%",
          height: "600px",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#4361ee",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Employee
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Department
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600 }}
                  align="right"
                >
                  Total OT Hours
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.date}
                    align="center"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </Box>

        {/* Virtualized Body */}
        <Box ref={tableBodyRef}>
          {/* Spacer for rows above visible area */}
          <Box sx={{ height: visibleRange.start * rowHeight }} />

          <Table sx={{ minWidth: 800, position: "relative" }}>
            <TableBody>
              {visibleEmployees.map((row) => (
                <MemoizedEmployeeRow
                  key={row.employee.id}
                  row={row}
                  columns={columns}
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
      </Box>
    );
  }
);

VirtualizedTable.displayName = "VirtualizedTable";

// Simple Pagination Component
const PaginationControls = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    totalItems,
    onPageSizeChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalItems: number;
    onPageSizeChange: (size: number) => void;
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Rows per page:
          </Typography>
          <TextField
            select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 80 }}
          >
            {[50, 100, 200, 500].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography variant="body2" color="textSecondary">
          {(currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    );
  }
);

PaginationControls.displayName = "PaginationControls";

function formatDateForApi(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function OvertimeCalculator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for date range
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Set default dates on component mount
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFromDate(firstDay);
    setToDate(lastDay);

    // Set current date display
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);

  // Fetch data with date range
  const { data, isLoading, error, refetch } = useDataQuery<ApiResponse>({
    apiEndPoint:
      fromDate && toDate
        ? `https://hr.api.techbee.et/api/attendances/overtime/grid?startDate=${encodeURIComponent(
            formatDateForApi(fromDate)
          )}&endDate=${encodeURIComponent(formatDateForApi(toDate))}`
        : "",
    enabled: !!fromDate && !!toDate,
  });

  const handleApply = () => {
    if (fromDate && toDate) {
      refetch();
      setShowPicker(false);
      setCurrentPage(1); // Reset to first page when date range changes
    }
  };

  const handleCancel = () => {
    // Reset to original dates when canceling
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFromDate(firstDay);
    setToDate(lastDay);
    setShowPicker(false);
  };

  // Calculate real statistics from the API data
  const dashboardCards: DashboardCard[] = useMemo(() => {
    const totalOvertimeHours =
      data?.rows?.reduce((sum, row) => sum + row.totalOtHours, 0) || 0;
    const employeesWithOT =
      data?.rows?.filter((row) => row.totalOtHours > 0).length || 0;
    const averageOtHours = data?.rows?.length
      ? totalOvertimeHours / data.rows.length
      : 0;
    const highestOT =
      data?.rows?.reduce(
        (max, row) => (row.totalOtHours > max ? row.totalOtHours : max),
        0
      ) || 0;
    const highestOTEmployee =
      data?.rows?.find((row) => row.totalOtHours === highestOT)?.employee
        .name || "N/A";

    return [
      {
        title: "Total Overtime Hours",
        value: totalOvertimeHours,
        description: "This period",
        icon: <AccessTime />,
        color: "#4cc9f0",
        borderColor: "#4cc9f0",
      },
      {
        title: "Employees with OT",
        value: employeesWithOT,
        description: "Working extra hours",
        icon: <PersonAdd />,
        color: "#f8961e",
        borderColor: "#f8961e",
      },
      {
        title: "Average OT Hours",
        value: Number(averageOtHours.toFixed(1)),
        description: "Per employee this period",
        icon: <AccessTime />,
        color: "#f72585",
        borderColor: "#f72585",
      },
      {
        title: "Highest OT",
        value: highestOT,
        description: `By ${highestOTEmployee}`,
        icon: <AccessTime />,
        color: "#4895ef",
        borderColor: "#4895ef",
      },
    ];
  }, [data]);

  const departments = useMemo(
    () => [
      "All Departments",
      ...Array.from(
        new Set(
          (data?.rows
            ?.map((row) => row.employee.department)
            .filter((dept) => dept !== null) as string[]) || []
        )
      ),
    ],
    [data]
  );

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return (
      data?.rows?.filter((row) => {
        const matchesSearch = row.employee.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
        const matchesDepartment =
          !departmentFilter ||
          departmentFilter === "All Departments" ||
          (row.employee.department || "").includes(departmentFilter);

        return matchesSearch && matchesDepartment;
      }) || []
    );
  }, [data, debouncedSearchTerm, departmentFilter]);

  // Paginated employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  // Handle page size change
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  // Determine if we should use virtualization (for very large datasets)
  const shouldUseVirtualization = filteredEmployees.length > 500;
  const shouldUsePagination =
    filteredEmployees.length > 200 && !shouldUseVirtualization;

  // Get columns from data
  const columns = data?.columns || [];

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">
          Error loading overtime data: {(error as Error).message} check Your
          Internet Connection
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            minHeight: "100vh",
            py: 3,
            px: { xs: 2, sm: 4 },
          }}
        >
          <Box sx={{ maxWidth: 1800, margin: "0 auto" }}>
            {/* Header */}
            <Paper
              sx={{
                background: `linear-gradient(120deg, #4361ee, #3f37c9)`,
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
                  <AccessTime sx={{ mr: 1, verticalAlign: "bottom" }} />
                  Overtime Calculator
                </Typography>
                {!showPicker ? (
                  <Chip
                    clickable
                    onClick={() => setShowPicker(true)}
                    label={
                      fromDate && toDate
                        ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
                        : "Select date range"
                    }
                    variant="outlined"
                    sx={{
                      mt: isMobile ? 1 : 0,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                    icon={<CalendarToday sx={{ color: "white" }} />}
                  />
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                  >
                    <DatePicker
                      label="From"
                      value={fromDate}
                      onChange={(newValue) => setFromDate(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            backgroundColor: "white",
                            minWidth: 140,
                          },
                        },
                      }}
                    />
                    <DatePicker
                      label="To"
                      value={toDate}
                      onChange={(newValue) => setToDate(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            backgroundColor: "white",
                            minWidth: 140,
                          },
                        },
                      }}
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCancel}
                      sx={{ color: "white", borderColor: "white" }}
                    >
                      Done
                    </Button>
                  </Box>
                )}
              </Box>
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
                          <Typography>Loading...</Typography>
                        </CardContent>
                      </StyledCard>
                    ))
                : // Show actual dashboard cards when data is loaded
                  dashboardCards.map((card, index) => (
                    <StyledCard key={index}>
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
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ color: "text.secondary", mr: 1 }} />
                    ),
                  }}
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

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ ml: "auto" }}
                >
                  {filteredEmployees.length} employees found
                </Typography>
              </Box>
            </Paper>

            {/* Overtime Table */}
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
                  <Typography>Loading overtime data...</Typography>
                </Box>
              ) : (
                <>
                  {/* Use virtualization for very large datasets */}
                  {shouldUseVirtualization ? (
                    <VirtualizedTable
                      employees={filteredEmployees}
                      columns={columns}
                    />
                  ) : shouldUsePagination ? (
                    // Use pagination for medium datasets
                    <>
                      <Box sx={{ width: "100%", overflow: "auto" }}>
                        <Table sx={{ minWidth: 800 }}>
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
                              <TableCell
                                sx={{ color: "white", fontWeight: 600 }}
                              >
                                Department
                              </TableCell>
                              <TableCell
                                sx={{ color: "white", fontWeight: 600 }}
                                align="right"
                              >
                                Total OT Hours
                              </TableCell>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.date}
                                  align="center"
                                  sx={{ color: "white", fontWeight: 600 }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedEmployees.map((row) => (
                              <MemoizedEmployeeRow
                                key={row.employee.id}
                                row={row}
                                columns={columns}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        totalItems={filteredEmployees.length}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </>
                  ) : (
                    // Regular table for small datasets
                    <Box sx={{ width: "100%", overflow: "auto" }}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                          <TableRow
                            sx={{
                              background: `linear-gradient(120deg, #4361ee, #3f37c9)`,
                            }}
                          >
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>
                              Employee
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>
                              Department
                            </TableCell>
                            <TableCell
                              sx={{ color: "white", fontWeight: 600 }}
                              align="right"
                            >
                              Total OT Hours
                            </TableCell>
                            {columns.map((column) => (
                              <TableCell
                                key={column.date}
                                align="center"
                                sx={{ color: "white", fontWeight: 600 }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredEmployees.map((row) => (
                            <MemoizedEmployeeRow
                              key={row.employee.id}
                              row={row}
                              columns={columns}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
                </>
              )}
            </Paper>

            {/* Legend */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                flexWrap: "wrap",
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 1,
                    backgroundColor: "#4361ee",
                  }}
                />
                <Typography variant="body2">Overtime Hours</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 1,
                    backgroundColor: "#f5f7fb",
                    border: "1px solid #ddd",
                  }}
                />
                <Typography variant="body2">No Overtime</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
