// @ts-nocheck
import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Stack,
  Paper,
  styled,
  useTheme,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WarningIcon from "@mui/icons-material/Warning";
import TabEmptyState from "./TabEmptyState";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import LanguageIcon from "@mui/icons-material/Language";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import DescriptionIcon from "@mui/icons-material/Description";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import GavelIcon from "@mui/icons-material/Gavel";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  useGetPerformancereviewsByEmployeeIdQuery,
  useDeletePerformancereviewsMutation,
  useUpdatePerformancereviewsMutation,
} from "@/app/(authenticated)/hr/_queries/performanceReviews";
import type { PerformanceReview } from "@/app/(authenticated)/hr/_schemas/performance-review";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import PerformanceReviewModal from "./PerformanceReviewModal";
import { RHFAlert } from "@/components/form-components/RHFAlert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import PositionHistoryModal from "./positionHistoryModal";
import { useGetPositionhistoriesQuery } from "@/app/(authenticated)/hr/_queries/positionHistories";
import {
  useGetContractsByEmployeeIdQuery,
  useCreateContractsMutation,
} from "@/app/(authenticated)/hr/_queries/contracts";
import { ContractForm } from "./ContractForm";
import { useForm, FormProvider } from "react-hook-form";
import {
  Contract,
  contractSchema,
} from "@/app/(authenticated)/hr/_schemas/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "calc(100vh - 64px)",
    maxHeight: "calc(100vh - 64px)",
    minHeight: 320,
    padding: 0,
    overflow: "hidden",
    background: `linear-gradient(135deg, ${
      theme.palette.background.paper
    } 0%, ${theme.palette.backgroundSection?.light || "#e1efff"} 100%)`,
    boxShadow: `0 -8px 32px rgba(${
      theme.palette.section?.main || "#11, 87, 159"
    }, 0.15)`,
    border: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: `linear-gradient(90deg, ${
        theme.palette.section?.main || "#0b579f"
      } 0%, ${theme.palette.section?.light || "#64b5f6"} 100%)`,
    },
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${
    theme.palette.backgroundSection?.light || "#e1efff"
  } 100%)`,
  border: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
  borderRadius: 12,
  transition: "all 0.2s ease",
  "&:hover": {
    background: `linear-gradient(135deg, ${
      theme.palette.section?.light || "#64b5f6"
    } 0%, ${theme.palette.section?.main || "#0b579f"} 100%)`,
    color: theme.palette.section?.contrastText || "#ffffff",
    transform: "scale(1.05)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: 0,
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 4),
  borderRadius: 20,
  boxShadow: `0 4px 20px rgba(${
    theme.palette.section?.main || "#11, 87, 159"
  }, 0.08)`,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${
    theme.palette.backgroundSection?.light || "#e1efff"
  } 100%)`,
  border: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
  fontFamily: "Inter, Roboto, Arial, sans-serif",
  display: "flex",
  flexDirection: "row", // Remove responsive object
  alignItems: "center", // Remove responsive object
  gap: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  fontSize: 44,
  background: `linear-gradient(135deg, ${
    theme.palette.section?.main || "#0b579f"
  } 0%, ${theme.palette.section?.light || "#64b5f6"} 100%)`,
  color: theme.palette.section?.contrastText || "#ffffff",
  boxShadow: `0 4px 16px rgba(${
    theme.palette.section?.main || "#11, 87, 159"
  }, 0.25)`,
  marginBottom: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  padding: theme.spacing(0, 2),
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  boxShadow: `0 2px 8px rgba(${
    theme.palette.section?.main || "#11, 87, 159"
  }, 0.15)`,
  "&.MuiChip-colorSuccess": {
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
    color: theme.palette.success.contrastText,
  },
  "&.MuiChip-colorDefault": {
    background: `linear-gradient(135deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[300]} 100%)`,
    color: theme.palette.grey[800],
  },
}));

const JobTitleChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 15,
  borderRadius: 12,
  background: `linear-gradient(135deg, ${
    theme.palette.section?.main || "#0b579f"
  } 0%, ${theme.palette.section?.light || "#64b5f6"} 100%)`,
  color: theme.palette.section?.contrastText || "#ffffff",
  boxShadow: `0 2px 8px rgba(${
    theme.palette.section?.main || "#11, 87, 159"
  }, 0.2)`,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    minWidth: 120,
    fontWeight: 600,
    fontSize: 14,
    textTransform: "none",
    color: theme.palette.text.secondary,
    transition: "all 0.2s ease",
    "&.Mui-selected": {
      color: theme.palette.section?.main || "#0b579f",
      fontWeight: 700,
    },
  },
  "& .MuiTabs-indicator": {
    background: `linear-gradient(90deg, ${
      theme.palette.section?.main || "#0b579f"
    } 0%, ${theme.palette.section?.light || "#64b5f6"} 100%)`,
    height: 3,
    borderRadius: "3px 3px 0 0",
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${
    theme.palette.backgroundSection?.light || "#e1efff"
  } 100%)`,
  border: `1px solid ${theme.palette.section?.light || "#64b5f6"}15`,
  transition: "all 0.2s ease",
  "&:hover": {
    border: `1px solid ${theme.palette.section?.light || "#64b5f6"}30`,
    boxShadow: `0 2px 8px rgba(${
      theme.palette.section?.main || "#11, 87, 159"
    }, 0.1)`,
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.section?.main || "#0b579f",
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: "0.875rem",
}));

interface EmployeeDetailBarProps {
  open: boolean;
  onClose: () => void;
  employee: any | null;
}

// Add gender, marital status, etc. to DEMO_EMPLOYEE
const DEMO_EMPLOYEE = {
  firstName: "Abebe",
  lastName: "Kebede",
  email: "abebe.kebede@example.com",
  photoUrl: "",
  jobTitle: "Senior Software Engineer",
  department: "Engineering",
  status: "active",
  dateJoined: "2021-03-15",
  phoneNumber: "+251 911 123 456",
  address: "123 Main St, Springfield, USA",
  manager: "John Smith",
  gender: "Female",
  maritalStatus: "Married",
  dob: "1990-04-12",
  nationality: "Ethiopian",
  languages: ["English", "Afan Oromo", "Tgregna"],
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "UI/UX"],
  bio: "Passionate engineer with 8+ years of experience building scalable web applications. Loves mentoring, open source, and hackathons.",
  projects: ["ERP Modernization", "Mobile App 2.0", "AI Chatbot"],
  emergencyContact: {
    name: "Emily Doe",
    relation: "Sister",
    phone: "+1 555-987-6543",
  },
  workHistory: [
    {
      company: "Acme Corp",
      title: "Frontend Developer",
      years: "2017-2021",
      document: { name: "Reference Letter.pdf", url: "#" },
      description:
        "Led the migration to a modern React stack, mentored junior devs, and improved UI performance by 30%.",
    },
    {
      company: "BetaSoft",
      title: "UI Engineer",
      years: "2014-2017",
      description:
        "Designed and implemented new UI components, collaborated with UX team, and reduced bug count by 20%.",
    },
  ],
  education: [
    { school: "MIT", degree: "BSc Computer Science", year: 2014 },
    { school: "Coursera", degree: "Full Stack Web Specialization", year: 2016 },
  ],
  certifications: [
    { name: "AWS Certified Developer", year: 2019 },
    { name: "Scrum Master", year: 2018 },
  ],
  warnings: [
    { date: "2023-01-15", reason: "Late project delivery", resolved: true },
    { date: "2022-08-10", reason: "Unapproved absence", resolved: false },
  ],
  assignments: [
    {
      title: "ERP Modernization Phase 2",
      dueDate: "2024-05-15",
      status: "In Progress",
    },
    {
      title: "Mobile App 2.0 UI/UX Review",
      dueDate: "2024-05-20",
      status: "Pending",
    },
  ],
};

const TABS = [
  { label: "Profile", icon: <AccountCircleIcon /> },
  { label: "Job Details", icon: <AssignmentIndIcon /> },
  { label: "Manager & Organization", icon: <GroupWorkIcon /> },
  { label: "Work History", icon: <WorkIcon /> },
  { label: "Disciplinary Notices", icon: <WarningIcon color="warning" /> },
  { label: "Performance", icon: <StarIcon color="primary" /> },
  { label: "Payroll", icon: <CalendarTodayIcon color="success" /> },
  { label: "Attendance", icon: <CalendarTodayIcon color="warning" /> },
  { label: "Contract", icon: <GavelIcon color="primary" /> }, // New Contract tab
];

// Add demo data for new tabs
const DEMO_ASSIGNMENTS = [
  {
    title: "ERP Modernization Sprint 5",
    dueDate: "2024-05-20",
    status: "In Progress",
    priority: "High",
    description:
      "Lead the frontend migration to Next.js 14 and optimize dashboard performance.",
  },
  {
    title: "AI Chatbot Integration",
    dueDate: "2024-06-01",
    status: "Pending",
    priority: "Medium",
    description:
      "Coordinate with backend team to integrate AI-powered support chatbot.",
  },
];
const DEMO_PERFORMANCE = {
  rating: "Exceeds Expectations",
  score: 4.7,
  lastReview: "2023-12-10",
  reviewer: "John Smith",
  comments:
    "Outstanding leadership and technical skills. Drives team success. Proactive in mentoring and process improvement.",
  goals: [
    { goal: "Mentor 3 junior devs", status: "Completed" },
    { goal: "Reduce bug count by 20%", status: "In Progress" },
    { goal: "Present at annual tech summit", status: "Completed" },
  ],
};
const DEMO_PAYROLL = {
  salary: 7500,
  lastPayment: "2024-04-30",
  bank: "Acme Bank",
  account: "****1234",
  taxStatus: "Compliant",
  bonuses: [
    { label: "Annual Bonus", amount: 2000, date: "2023-12-20" },
    { label: "Spot Award", amount: 500, date: "2024-03-15" },
  ],
  deductions: [
    { label: "Health Insurance", amount: 200 },
    { label: "Retirement", amount: 300 },
  ],
};
const DEMO_ATTENDANCE = {
  rate: 98,
  lastAbsent: "2024-03-12",
  lateArrivals: 2,
  absences: 1,
  presentDays: 85,
  totalDays: 87,
  streak: 22,
};
const DEMO_PEER_FEEDBACK = [
  {
    name: "Alice Brown",
    comment: "Always ready to help and share knowledge.",
    rating: 5,
  },
  {
    name: "Carlos Lee",
    comment: "Great collaborator and communicator.",
    rating: 4,
  },
];
const DEMO_YTD_PAYROLL = {
  gross: 32000,
  net: 28500,
  bonuses: 2500,
  deductions: 3500,
};
const DEMO_ATTENDANCE_WARNINGS = [
  { date: "2024-02-10", reason: "Late arrival", severity: "low" },
  { date: "2024-03-12", reason: "Unexcused absence", severity: "high" },
];

export const EmployeeDetailBar: React.FC<EmployeeDetailBarProps> = ({
  open,
  onClose,
  employee,
}) => {
  const theme = useTheme();
  const emp = employee || {};
  const [tab, setTab] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [positionHistoryModalOpen, setPositionHistoryModalOpen] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<PerformanceReview | null>(
    null
  );
  const [updateReview, { isLoading: isUpdating }] =
    useUpdatePerformancereviewsMutation();
  const [deleteReview, { isLoading: isDeleting }] =
    useDeletePerformancereviewsMutation();
  const {
    data: positionHistoriesData = [],
    isLoading: isPositionHistoriesLoading,
    isError: isPositionHistoriesError,
  } = useGetPositionhistoriesQuery();
  const positionHistories = Array.isArray(positionHistoriesData)
    ? positionHistoriesData.filter((ph) => ph.employee?.id === emp.id)
    : [];

  const {
    data: contracts,
    isLoading: isContractsLoading,
    isError: isContractsError,
  } = useGetContractsByEmployeeIdQuery(employee?.id, { skip: !employee?.id });

  const handleDeleteClick = (id: string) => {
    setReviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete).unwrap();
      setDeleteAlert({
        status: "success",
        message: "Performance review deleted successfully!",
      });
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    } catch (err: any) {
      setDeleteAlert({
        status: "error",
        message:
          err?.data?.message ||
          err?.message ||
          "Failed to delete performance review.",
      });
    }
  };

  const handleEditClick = (review: PerformanceReview) => {
    setReviewToEdit(review);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!reviewToEdit?.id) return;
    try {
      const payload = {
        id: reviewToEdit.id,
        data: {
          employee: { id: values.employeeId },
          reviewDate:
            values.reviewDate instanceof Date
              ? values.reviewDate.toISOString()
              : values.reviewDate,
          reviewer: values.reviewer,
          score: Number(values.score),
          comments: values.comments || undefined,
        },
      };
      await updateReview(payload).unwrap();
      setEditModalOpen(false);
      setReviewToEdit(null);
    } catch (err) {
      // handle error (could show alert)
    }
  };

  // Fetch performance reviews for the employee at the top level (best practice)
  const {
    data = [],
    isLoading: isPerfLoading,
    isError: isPerfError,
  } = useGetPerformancereviewsByEmployeeIdQuery(emp.id, { skip: !emp.id });
  const reviews = data as PerformanceReview[];
  let latestReview: PerformanceReview | null = null;
  if (Array.isArray(reviews) && reviews.length > 0) {
    latestReview = [...reviews].sort(
      (a, b) =>
        new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
    )[0];
  }

  // For name display, concatenate firstName, grandFatherName, and lastName
  const fullName = [emp.firstName, emp.lastName, emp.grandFatherName]
    .filter(Boolean)
    .join(" ");

  // Map real employee fields for profile and job details
  const PROFILE_FIELDS = [
    { label: "First Name", value: emp.firstName || "N/A" },
    { label: "Last Name", value: emp.lastName || "N/A" },
    { label: "Grandfather's Name", value: emp.grandFatherName || "N/A" },
    { label: "Gender", value: emp.gender || "N/A" },
    {
      label: "Date of Birth",
      value: emp.dateOfBirth
        ? new Date(emp.dateOfBirth).toLocaleDateString()
        : "N/A",
    },
    { label: "Marital Status", value: emp.maritalStatus || "N/A" },
    { label: "Language", value: emp.language || "N/A" },
    { label: "Phone Number", value: emp.phoneNumber || "N/A" },
    { label: "Email", value: emp.email || "N/A" },
    { label: "Address", value: emp.workPlace || "N/A" },
  ];
  const JOB_DETAILS_FIELDS = [
    { label: "Employee Code", value: emp.employeeCode || "N/A" },
    { label: "Job Title", value: emp.jobTitle || "N/A" },
    { label: "Position", value: emp.position?.title || "N/A" },
    {
      label: "Hire Date",
      value: emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : "N/A",
    },
    { label: "Employment Term", value: emp.employmentTerm || "N/A" },
    { label: "Active", value: emp.isActive ? "Yes" : "No" },
    { label: "Is HR", value: emp.isHr ? "Yes" : "No" },
    { label: "Is Approver", value: emp.isApprover ? "Yes" : "No" },
    {
      label: "Company Experience (Years)",
      value: emp.companyExperience ?? "N/A",
    },
    {
      label: "Previous Experience (Years)",
      value: emp.previousExperience ?? "N/A",
    },
    {
      label: "Probation End Date",
      value: emp.probationEndDate
        ? new Date(emp.probationEndDate).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Termination Date",
      value: emp.terminationDate
        ? new Date(emp.terminationDate).toLocaleDateString()
        : "N/A",
    },
    { label: "Retirement Status", value: emp.retirementStatus || "N/A" },
    { label: "File Number", value: emp.fileNumber || "N/A" },
    { label: "Grade", value: emp.grade || "N/A" },
    { label: "Qualification", value: emp.qualification || "N/A" },
    { label: "Remark", value: emp.remark || "N/A" },
    {
      label: "Manager",
      value: emp.manager
        ? emp.manager.firstName + " " + emp.manager.lastName
        : "N/A",
    },
    { label: "Organization Node", value: emp.organizationNodeId || "N/A" },
    { label: "National ID", value: emp.nationalId || "N/A" },
    { label: "TIN Number", value: emp.tinNumber || "N/A" },
    { label: "Pension ID", value: emp.pensionId || "N/A" },
    { label: "Plate Number", value: emp.plateNumber || "N/A" },
    { label: "POESSA Number", value: emp.poessaNumber || "N/A" },
    { label: "PSSSA Number", value: emp.psssaNumber || "N/A" },
  ];
  const MANAGER_ORG_FIELDS = [
    {
      label: "Manager",
      value: emp.manager
        ? emp.manager.firstName + " " + emp.manager.lastName
        : "N/A",
    },
    { label: "Organization Node", value: emp.organizationNodeId || "N/A" },
    { label: "Work Place", value: emp.workPlace || "N/A" },
    { label: "Shift", value: emp.shift || "N/A" },
  ];
  const IDS_LEGAL_FIELDS = [
    { label: "National ID", value: emp.nationalId || "N/A" },
    { label: "TIN Number", value: emp.tinNumber || "N/A" },
    { label: "Pension ID", value: emp.pensionId || "N/A" },
    { label: "File Number", value: emp.fileNumber || "N/A" },
    { label: "Plate Number", value: emp.plateNumber || "N/A" },
    { label: "POESSA Number", value: emp.poessaNumber || "N/A" },
    { label: "PSSSA Number", value: emp.psssaNumber || "N/A" },
  ];
  const SYSTEM_USER_FIELDS = [
    { label: "Associated User", value: emp.associatedUser || "N/A" },
    { label: "Grade", value: emp.grade || "N/A" },
    { label: "Qualification", value: emp.qualification || "N/A" },
    { label: "Remark", value: emp.remark || "N/A" },
  ];

  const [addContractModalOpen, setAddContractModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const methods = useForm<Contract>({
    resolver: zodResolver(contractSchema),
    defaultValues: {},
  });
  const [createContract, { isLoading: isCreating }] =
    useCreateContractsMutation();
  const handleAddContract = async (values: Contract) => {
    try {
      const {
        id,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        ...restOfValues
      } = values;
      const payload: Partial<
        Omit<
          Contract,
          "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
        >
      > = {
        ...restOfValues,
        employee: values.employee?.id ? { id: values.employee.id } : undefined,
        salaryStructure: values.salaryStructure?.id
          ? { id: values.salaryStructure.id }
          : undefined,
      };
      for (const key in payload) {
        if (
          payload[key as keyof typeof payload] === "" ||
          payload[key as keyof typeof payload] === null ||
          payload[key as keyof typeof payload] === undefined
        ) {
          delete payload[key as keyof typeof payload];
        }
      }
      await createContract(payload).unwrap();
      setAddContractModalOpen(false);
      methods.reset({});
      setSnackbar({
        open: true,
        message: "Contract created successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to create contract.",
        severity: "error",
      });
    }
  };

  return (
    <StyledDrawer anchor="bottom" open={open} onClose={onClose}>
      <Box
        sx={{
          p: { xs: 1, sm: 3 },
          pb: 1,
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Box sx={{ position: "absolute", right: 30, top: 30, zIndex: 2 }}>
          <CloseButton onClick={onClose} size="small">
            <CloseIcon />
          </CloseButton>
        </Box>
        {/* Card-like summary - redesigned */}
        <StyledPaper>
          {/* Left: Avatar and Main Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 120,
              pr: { md: 3 },
            }}
          >
            <StyledAvatar src={emp.photoUrl}>
              {!emp.photoUrl &&
                `${emp.firstName?.[0] || ""}${emp.lastName?.[0] || ""}`}
            </StyledAvatar>
            <StatusChip
              label={
                emp.status === "active" ? "Active" : emp.status || "Inactive"
              }
              color={emp.status === "active" ? "success" : "default"}
              icon={
                emp.status === "active" ? <CheckCircleIcon /> : <BlockIcon />
              }
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Joined{" "}
              {emp.hireDate
                ? new Date(emp.hireDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>
          {/* Right: Main Info and Personal Details */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                  fontFamily: "inherit",
                  color: theme.palette.section?.main || "#0b579f",
                }}
              >
                {fullName}
              </Typography>
              <JobTitleChip label={emp.jobTitle || "N/A"} />
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1, fontFamily: "inherit" }}
            >
              <BusinessIcon sx={{ mb: -0.5, mr: 0.5 }} fontSize="small" />
              {emp.department || "N/A"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 1, fontFamily: "inherit" }}
            >
              {emp.bio || "No bio available."}
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 1 }}
            >
              <EmailIcon color="primary" />
              <Typography variant="body1" sx={{ mr: 2, fontFamily: "inherit" }}>
                {emp.email || "N/A"}
              </Typography>
              <PhoneIcon color="action" />
              <Typography variant="body1" sx={{ fontFamily: "inherit" }}>
                {emp.phoneNumber || "N/A"}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            {/* Personal Details Row */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 1 }}
            >
              <Chip
                label={emp.gender || "N/A"}
                color="info"
                icon={<SupervisorAccountIcon />}
                sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
              />
              <Chip
                label={emp.maritalStatus || "N/A"}
                color="secondary"
                icon={<HomeIcon />}
                sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
              />
              <Chip
                label={`DOB: ${emp.dob || "N/A"}`}
                color="default"
                icon={<CalendarTodayIcon />}
                sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
              />
              <Chip
                label={emp.nationality || "N/A"}
                color="default"
                icon={<FlagIcon />}
                sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
              />
              <Chip
                label={emp.languages?.join(", ") || "N/A"}
                color="default"
                icon={<LanguageIcon />}
                sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
              />
            </Stack>
          </Box>
        </StyledPaper>
        {/* Vertical Tabs Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            background: "none",
            borderRadius: 3,
            boxShadow: 0,
            minHeight: 0,
            flex: 1,
            height: 0,
          }}
        >
          {/* Sidebar Tabs - remove sticky */}
          <Box
            sx={{
              minWidth: { xs: "100%", md: 220 },
              maxWidth: { xs: "100%", md: 240 },
              background:
                theme.palette.backgroundSection?.light ||
                theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 1,
              mr: { md: 3 },
              mb: { xs: 2, md: 0 },
              p: 1,
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              alignItems: { xs: "center", md: "stretch" },
              overflowX: { xs: "auto", md: "visible" },
              overflowY: "auto",
              height: "100%",
              gap: 1,
              minHeight: 0,
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {TABS.map((t, i) => (
              <Box
                key={t.label}
                onClick={() => setTab(i)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  background:
                    tab === i
                      ? `linear-gradient(90deg, ${
                          theme.palette.section?.main ||
                          theme.palette.primary.main
                        } 0%, ${
                          theme.palette.section?.light ||
                          theme.palette.primary.light
                        } 100%)`
                      : "none",
                  color:
                    tab === i
                      ? theme.palette.section?.contrastText ||
                        theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                  fontWeight: tab === i ? 700 : 500,
                  fontSize: 17,
                  boxShadow: tab === i ? 2 : 0,
                  transition: "background 0.2s, color 0.2s",
                  mb: { md: 1, xs: 0 },
                  minWidth: 0,
                  minHeight: 48,
                  "&:hover": {
                    background:
                      tab === i
                        ? `linear-gradient(90deg, ${
                            theme.palette.section?.main ||
                            theme.palette.primary.main
                          } 0%, ${
                            theme.palette.section?.light ||
                            theme.palette.primary.light
                          } 100%)`
                        : theme.palette.action.hover,
                  },
                }}
              >
                {React.cloneElement(t.icon, {
                  style: {
                    color:
                      tab === i
                        ? theme.palette.section?.contrastText || "#fff"
                        : theme.palette.section?.main ||
                          theme.palette.primary.main,
                  },
                })}
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.label}
                </span>
              </Box>
            ))}
          </Box>
          {/* Tab Content */}
          <Box
            sx={{
              flex: 1,
              background: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 1,
              p: { xs: 2, sm: 4 },
              minHeight: 220,
              overflowY: "auto",
              height: "100%",
            }}
          >
            {tab === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  width: "100%",
                }}
              >
                {/* Contact Info Card */}
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    flex: "1 1 320px",
                    minWidth: 280,
                    maxWidth: 420,
                    mb: 0,
                  }}
                >
                  <CardHeader
                    avatar={<PhoneIcon color="primary" />}
                    title={
                      <Typography fontWeight={700}>Contact Info</Typography>
                    }
                    sx={{ pb: 0 }}
                  />
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <EmailIcon color="action" />
                        <Typography variant="body1">
                          {emp.email || "N/A"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <PhoneIcon color="action" />
                        <Typography variant="body1">
                          {emp.phoneNumber || "N/A"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <HomeIcon color="action" />
                        <Typography variant="body1">
                          {emp.address || "N/A"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                {/* IDs & Contact Section */}
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    flex: "1 1 320px",
                    minWidth: 280,
                    maxWidth: 420,
                    background:
                      "linear-gradient(90deg, #e3f0ff 0%, #f7fafc 100%)",
                    p: 2,
                    mb: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    <GavelIcon sx={{ mr: 1, mb: -0.5 }} />
                    IDs & Contact
                  </Typography>
                  <Stack spacing={1}>
                    {IDS_LEGAL_FIELDS.map((f) => (
                      <Stack
                        key={f.label}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <GavelIcon color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {f.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {f.value}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Card>
                {/* Emergency Contact Section */}
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    flex: "1 1 320px",
                    minWidth: 280,
                    maxWidth: 420,
                    borderLeft: "6px solid",
                    borderColor: "info.main",
                    background:
                      "linear-gradient(90deg, #e3f0ff 0%, #f7fafc 100%)",
                    p: 2,
                    mb: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    <PhoneIcon sx={{ mr: 1, mb: -0.5 }} />
                    Emergency Contact
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <PhoneIcon color="info" sx={{ fontSize: 36 }} />
                    <Box flex={1}>
                      <Typography variant="body1" fontWeight={700}>
                        {emp.emergencyContact?.name || "N/A"}{" "}
                        <Typography
                          component="span"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          ({emp.emergencyContact?.relation || "N/A"})
                        </Typography>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {emp.emergencyContact?.phone || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label="Call"
                        color="info"
                        icon={<PhoneIcon />}
                        onClick={() =>
                          window.open(
                            `tel:${emp.emergencyContact?.phone || ""}`
                          )
                        }
                        sx={{ fontWeight: 700, fontSize: 15, borderRadius: 2 }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Box>
            )}
            {tab === 1 && (
              <Stack spacing={3}>
                {/* Job Title & Department */}
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AssignmentIndIcon color="primary" />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {emp.jobTitle || "N/A"}
                        </Typography>
                        <Typography color="text.secondary">
                          {emp.department || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                {/* Status Chips */}
                <Stack direction="row" spacing={1}>
                  <Chip label="Active" color="success" />
                  <Chip
                    label={`Is HR: ${emp.isHr ? "Yes" : "No"}`}
                    color="default"
                  />
                  <Chip
                    label={`Is Approver: ${emp.isApprover ? "Yes" : "No"}`}
                    color="info"
                  />
                  <Chip
                    label={`Employment Term: ${emp.employmentTerm || "N/A"}`}
                    color="default"
                  />
                </Stack>
                {/* Dates */}
                <Card elevation={1} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={4}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Hire Date
                        </Typography>
                        <Typography>{emp.hireDate || "N/A"}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Probation End
                        </Typography>
                        <Typography>{emp.probationEndDate || "N/A"}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Termination
                        </Typography>
                        <Typography>{emp.terminationDate || "-"}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                {/* Experience */}
                <Card elevation={1} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Chip
                        label={`${
                          emp.companyExperienceYears || "N/A"
                        } years company`}
                        color="primary"
                      />
                      <Chip
                        label={`${
                          emp.previousExperienceYears || "N/A"
                        } years previous`}
                        color="default"
                      />
                    </Stack>
                  </CardContent>
                </Card>
                {/* Grade, Retirement, etc. */}
                <Stack direction="row" spacing={1}>
                  <Chip label="Grade: A" color="default" />
                  <Chip
                    label={`Retirement: ${
                      emp.retirementStatus || "Not Retired"
                    }`}
                    color="success"
                  />
                </Stack>
              </Stack>
            )}
            {tab === 2 && (
              <Stack spacing={3}>
                {/* Manager Card */}
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardHeader
                    avatar={<SupervisorAccountIcon color="primary" />}
                    title={<Typography fontWeight={700}>Manager</Typography>}
                    sx={{ pb: 0 }}
                  />
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{ width: 48, height: 48, bgcolor: "primary.light" }}
                      >
                        J
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>
                          {emp.manager
                            ? emp.manager.firstName + " " + emp.manager.lastName
                            : "N/A"}
                        </Typography>
                        <Typography color="text.secondary">
                          Senior Manager
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                {/* Organization Node */}
                <Card elevation={1} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <GroupWorkIcon color="primary" />
                      <Box>
                        <Typography fontWeight={700}>
                          {emp.organizationNodeId || "N/A"}
                        </Typography>
                        <Typography color="text.secondary">
                          Organization Node
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                {/* Work Place & Shift */}
                <Stack direction="row" spacing={2}>
                  <Card elevation={1} sx={{ borderRadius: 3, flex: 1 }}>
                    <CardContent>
                      <Typography fontWeight={700}>
                        {emp.workPlace || "N/A"}
                      </Typography>
                      <Typography color="text.secondary">Work Place</Typography>
                    </CardContent>
                  </Card>
                  <Card elevation={1} sx={{ borderRadius: 3, flex: 1 }}>
                    <CardContent>
                      <Typography fontWeight={700}>
                        {emp.shift || "N/A"}
                      </Typography>
                      <Typography color="text.secondary">Shift</Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            )}
            {tab === 3 && (
              <Stack spacing={3} sx={{ position: "relative" }}>
                <Tooltip title="Add position History">
                  <Fab
                    color="primary"
                    size="medium"
                    sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
                    onClick={() => setPositionHistoryModalOpen(true)}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  <WorkIcon sx={{ mr: 1, mb: -0.5 }} />
                  Work History
                </Typography>
                {isPositionHistoriesLoading ? (
                  <LinearProgress />
                ) : isPositionHistoriesError ? (
                  <TabEmptyState
                    title="Error"
                    description="Could not load position histories."
                  />
                ) : !positionHistories || positionHistories.length === 0 ? (
                  <TabEmptyState
                    title="No Position History"
                    description="No position history records found for this employee."
                  />
                ) : (
                  <Stack spacing={2}>
                    {positionHistories.map((history, idx) => (
                      <Paper
                        key={history.id || idx}
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: "#f7fafd",
                          position: "relative",
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={3}
                          alignItems={{ sm: "center" }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              color="primary.main"
                            >
                              {history.position?.id || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Start:{" "}
                              {history.startDate
                                ? new Date(
                                    history.startDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              End:{" "}
                              {history.endDate
                                ? new Date(history.endDate).toLocaleDateString()
                                : "Present"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
                <PositionHistoryModal
                  open={positionHistoryModalOpen}
                  onClose={() => setPositionHistoryModalOpen(false)}
                  employeeId={emp.id}
                />
              </Stack>
            )}
            {tab === 4 && (
              <Stack spacing={2}>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  <WarningIcon sx={{ mr: 1, mb: -0.5 }} color="warning" />
                  Disciplinary Notices
                </Typography>
                {emp.warnings && emp.warnings.length > 0 ? (
                  emp.warnings.map((warn: any, idx: number) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color={warn.resolved ? "success.main" : "error.main"}
                      >
                        {warn.reason}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {warn.date} |{" "}
                        {warn.resolved ? "Resolved" : "Unresolved"}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <TabEmptyState
                    title="No Disciplinary Notices"
                    description="This employee does not have any disciplinary notices."
                  />
                )}
              </Stack>
            )}
            {tab === 5 && (
              <Stack spacing={3} sx={{ position: "relative" }}>
                <Tooltip title="Create Performance Review">
                  <Fab
                    color="primary"
                    size="medium"
                    sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
                    onClick={() => setReviewModalOpen(true)}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <StarIcon sx={{ mb: -0.5 }} color="primary" />
                  Performance
                </Typography>
                <PerformanceReviewModal
                  open={reviewModalOpen}
                  onClose={() => setReviewModalOpen(false)}
                  employeeId={emp.id}
                />
                {isPerfLoading ? (
                  <LinearProgress />
                ) : isPerfError ? (
                  <TabEmptyState
                    title="Error"
                    description="Could not load performance reviews."
                  />
                ) : !reviews || reviews.length === 0 ? (
                  <TabEmptyState
                    title="No Performance Reviews"
                    description="No performance reviews found for this employee."
                  />
                ) : (
                  <Stack spacing={2}>
                    {deleteAlert && (
                      <RHFAlert
                        status={deleteAlert.status}
                        message={deleteAlert.message}
                      />
                    )}
                    {[...reviews]
                      .sort(
                        (a, b) =>
                          new Date(b.reviewDate).getTime() -
                          new Date(a.reviewDate).getTime()
                      )
                      .map((review, idx) => (
                        <Paper
                          key={review.id || idx}
                          elevation={2}
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: "#f7fafd",
                            position: "relative",
                          }}
                        >
                          {/* Edit/Delete Icons */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Edit Review">
                              <IconButton
                                color="info"
                                size="small"
                                onClick={() => handleEditClick(review)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Review">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDeleteClick(review.id || "")
                                }
                                disabled={isDeleting}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={3}
                            alignItems={{ sm: "center" }}
                          >
                            <Box>
                              <Typography
                                variant="h4"
                                fontWeight={800}
                                color="success.main"
                              >
                                {review.score}/10
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Reviewer: {review.reviewer}
                              </Typography>
                            </Box>
                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{ display: { xs: "none", sm: "block" } }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Review Date:{" "}
                                {new Date(
                                  review.reviewDate
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                              >
                                Comments: {review.comments}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}
                    {/* Delete Confirmation Dialog */}
                    <Dialog
                      open={deleteDialogOpen}
                      onClose={() => setDeleteDialogOpen(false)}
                    >
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogContent>
                        Are you sure you want to delete this performance review?
                        This action cannot be undone.
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setDeleteDialogOpen(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConfirmDelete}
                          color="error"
                          variant="contained"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                )}
              </Stack>
            )}
            {tab === 6 && (
              <Stack spacing={3}>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarTodayIcon sx={{ mb: -0.5 }} color="success" />
                  Payroll
                </Typography>
                <Paper
                  elevation={2}
                  sx={{ p: 3, borderRadius: 3, background: "#f7fafd" }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    alignItems={{ sm: "center" }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        color="primary.main"
                      >
                        ${emp.salary || DEMO_PAYROLL.salary.toLocaleString()}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Monthly Salary
                      </Typography>
                    </Box>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Payment:{" "}
                        {emp.lastPayment || DEMO_PAYROLL.lastPayment}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bank: {emp.bank || DEMO_PAYROLL.bank}, Account:{" "}
                        {emp.account || DEMO_PAYROLL.account}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tax Status: {emp.taxStatus || DEMO_PAYROLL.taxStatus}
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <PieChartOutlineIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      YTD Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gross:{" "}
                      <b>
                        $
                        {emp.grossPayroll ||
                          DEMO_YTD_PAYROLL.gross.toLocaleString()}
                      </b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net:{" "}
                      <b>
                        $
                        {emp.netPayroll ||
                          DEMO_YTD_PAYROLL.net.toLocaleString()}
                      </b>
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Bonuses: +$
                      {emp.bonuses || DEMO_YTD_PAYROLL.bonuses.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Deductions: -$
                      {emp.deductions ||
                        DEMO_YTD_PAYROLL.deductions.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Bonuses
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    {emp.bonuses && emp.bonuses.length > 0 ? (
                      emp.bonuses.map((b: any, i: number) => (
                        <Chip
                          key={i}
                          label={`${b.label}: $${b.amount}`}
                          color="success"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <TabEmptyState
                        title="No Bonuses"
                        description="This employee does not have any bonuses."
                      />
                    )}
                  </Stack>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Deductions
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {emp.deductions && emp.deductions.length > 0 ? (
                      emp.deductions.map((d: any, i: number) => (
                        <Chip
                          key={i}
                          label={`${d.label}: -$${d.amount}`}
                          color="error"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <TabEmptyState
                        title="No Deductions"
                        description="This employee does not have any deductions."
                      />
                    )}
                  </Stack>
                </Paper>
              </Stack>
            )}
            {tab === 7 && (
              <Stack spacing={3}>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarTodayIcon sx={{ mb: -0.5 }} color="warning" />
                  Attendance
                </Typography>
                <Paper
                  elevation={2}
                  sx={{ p: 3, borderRadius: 3, background: "#f7fafd" }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    alignItems={{ sm: "center" }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        color="primary.main"
                      >
                        {emp.attendanceRate || DEMO_ATTENDANCE.rate}%
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Attendance Rate
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Best Streak:{" "}
                        {emp.attendanceStreak || DEMO_ATTENDANCE.streak} days
                      </Typography>
                    </Box>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Present Days:{" "}
                        {emp.presentDays || DEMO_ATTENDANCE.presentDays} /{" "}
                        {emp.totalDays || DEMO_ATTENDANCE.totalDays}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Absent:{" "}
                        {emp.lastAbsent || DEMO_ATTENDANCE.lastAbsent}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Late Arrivals (2024):{" "}
                        {emp.lateArrivals || DEMO_ATTENDANCE.lateArrivals}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Absences (2024):{" "}
                        {emp.absences || DEMO_ATTENDANCE.absences}
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <CalendarMonthIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Attendance Calendar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (Heatmap coming soon)
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Attendance Warnings
                  </Typography>
                  <Stack spacing={2}>
                    {emp.attendanceWarnings &&
                    emp.attendanceWarnings.length === 0 ? (
                      <TabEmptyState
                        title="No Attendance Warnings"
                        description="This employee has no attendance-related warnings."
                      />
                    ) : (
                      emp.attendanceWarnings?.map((w: any, i: number) => (
                        <Paper
                          key={i}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background:
                              w.severity === "high" ? "#fff3f0" : "#fffbe7",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <WarningIcon
                            color={w.severity === "high" ? "error" : "warning"}
                            sx={{ fontSize: 32 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              color={
                                w.severity === "high"
                                  ? "error.main"
                                  : "warning.main"
                              }
                            >
                              {w.reason}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {w.date}
                            </Typography>
                          </Box>
                          <Chip
                            label={
                              w.severity === "high"
                                ? "High Severity"
                                : "Low Severity"
                            }
                            color={w.severity === "high" ? "error" : "warning"}
                            size="small"
                            sx={{ ml: "auto", fontWeight: 600 }}
                          />
                        </Paper>
                      ))
                    )}
                  </Stack>
                </Paper>
              </Stack>
            )}
            {tab === 8 && (
              <Stack spacing={3} sx={{ position: "relative" }}>
                <Tooltip title="Add Contract">
                  <Fab
                    color="primary"
                    size="medium"
                    sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
                    onClick={() => setAddContractModalOpen(true)}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <GavelIcon sx={{ mb: -0.5 }} color="primary" />
                  Contract
                </Typography>
                {!employee?.id ? (
                  <Typography variant="body1">No employee selected.</Typography>
                ) : isContractsLoading ? (
                  <Typography>Loading contract...</Typography>
                ) : isContractsError ? (
                  <Typography color="error">
                    Failed to load contract.
                  </Typography>
                ) : !contracts || contracts.length === 0 ? (
                  <Typography>No contract found for this employee.</Typography>
                ) : (
                  contracts.map((contract, idx) => (
                    <Paper
                      key={contract.id || idx}
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: "#f7fafd",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1">
                        <b>Contract Type:</b> {contract.type || "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        <b>Start Date:</b>{" "}
                        {contract.startDate
                          ? new Date(contract.startDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        <b>End Date:</b>{" "}
                        {contract.endDate
                          ? new Date(contract.endDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        <b>Status:</b> {contract.status || "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        <b>Terms:</b> {contract.terms || "N/A"}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
      {/* Edit Modal */}
      <PerformanceReviewModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setReviewToEdit(null);
        }}
        employeeId={employee?.id || ""}
        review={reviewToEdit}
        onSubmit={handleEditSubmit}
        isEdit
        isLoading={isUpdating}
      />
      {/* Add Contract Modal */}
      <Dialog
        open={addContractModalOpen}
        onClose={() => setAddContractModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Contract</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <form
              id="add-contract-form"
              onSubmit={methods.handleSubmit(handleAddContract)}
            >
              <ContractForm methods={methods} />
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddContractModalOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-contract-form"
            variant="contained"
            color="primary"
            disabled={isCreating}
          >
            {isCreating ? "Adding..." : "Add Contract"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </StyledDrawer>
  );
};
