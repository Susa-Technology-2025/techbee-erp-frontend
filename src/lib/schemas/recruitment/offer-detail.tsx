import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Print, Close } from "@mui/icons-material";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- Data Structures (Centralized for all components) ---

interface SimpleOffer {
  id: string;
  status: string;
  baseSalary: number;
  currency: string;
  startDate: string;
  notes: string;
  benefits?: string;
  terms: string;
}

interface FullRequisition {
  id: string;
  title: string;
  status: string;
  employmentTerm: string;
  vacancyType: string;
  qualifications: string[];
  workSchedule: {
    id: string;
    name: string;
    avgHoursPerDay: number;
  };
  position: {
    id: string;
    title: string;
    code: string;
    grade: string | null;
    qualifications: any[];
  };
}

interface FullCandidate {
  id: string;
  firstName: string;
  fatherName: string;
  email: string | null;
  phone: string | null;
}

interface FullApplicationData {
  appliedAt: string;
  candidate: FullCandidate;
  currentStage: any | null;
  id: string;
  offer: SimpleOffer;
  refuseReason: any | null;
  requisition: FullRequisition;
}

interface OfferRowData {
  application: { id: string; status: string; candidate: any; requisition: any };
  approvalStatus: string;
  baseSalary: number;
  benefits: string;
  createdAt: string;
  currency: string;
  fileUrl: string | null;
  id: string;
  notes: string;
  startDate: string;
  status: string;
  updatedAt: string;
  preparedBy: string;
  organizationNodeId: string;
  terms: string;
}

interface PreparerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title?: string;
}

interface OrganizationDetails {
  code: string;
  name: string;
  address?: string;
  contactEmail?: string;
}

interface DocumentViewDialogProps {
  row: OfferRowData;
  open: boolean;
  handleClose: () => void;
}

interface DocumentFullData {
  candidate: FullApplicationData["candidate"];
  requisition: FullApplicationData["requisition"];
  offer: SimpleOffer & Pick<OfferRowData, "terms">;
  preparerDetails: PreparerDetails | undefined;
  organizationDetails: OrganizationDetails | undefined;
  candidateName: string;
  preparerFullName: string;
  preparerTitle: string;
  companyName: string;
}

// --- Utility Functions (Centralized) ---
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number, currency: string) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formattedAmount} ${currency}`;
};

// --- Document Component Interfaces ---
interface DocumentProps {
  id: string;
  fullData: DocumentFullData;
}

const noBreakInsideSx = {
  pageBreakInside: "avoid !important",
};

// =================================================================
// --- OfferDocument Component (Refactored with Terms Link) ---
// =================================================================

const OfferDocument: React.FC<DocumentProps> = ({ id, fullData }) => {
  const {
    candidate,
    requisition,
    offer,
    candidateName,
    preparerFullName,
    preparerTitle,
    companyName,
  } = fullData;

  const jobTitle = requisition.title;
  const formattedStartDate = formatDate(offer.startDate);
  const formattedSalary = formatCurrency(offer.baseSalary, offer.currency);
  const employmentTerm = requisition?.employmentTerm || "N/A";
  const workSchedule = requisition?.workSchedule?.name || "N/A";
  const benefits = offer.benefits;
  const termsLink = offer.terms;

  return (
    <Box
      id={id}
      sx={{
        p: 4,
        minHeight: "80vh",
      }}
    >
      <Box sx={{ ...noBreakInsideSx, mb: 3 }}>
        <Typography variant="body1">
          {formatDate(new Date().toISOString())}
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, fontWeight: "bold" }}>
          {candidateName}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          mt: 4,
          mb: 3,
          borderBottom: "2px solid",
          display: "inline-block",
          "@media print": { fontSize: "12pt !important", mb: 2 },
          fontWeight: "bold",
        }}
      >
        Subject: Formal Offer of Employment
      </Typography>

      <Box sx={{ ...noBreakInsideSx, mb: 4, lineHeight: 1.6 }}>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          Dear{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {candidate.firstName} {candidate.fatherName}
          </Box>
          ,
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, mb: 1.5 }}>
          We are pleased to formally offer you the position of{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {jobTitle}
          </Box>{" "}
          with{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {companyName}
          </Box>
          . We were impressed with your qualifications and believe you will be a
          valuable addition to our team.
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          mt: 1.5,
          mb: 1.5,
          "@media print": { fontSize: "11pt !important" },
          fontWeight: "bold",
        }}
      >
        1. Position and Employment
      </Typography>
      <Paper variant="outlined" sx={{ ...noBreakInsideSx, p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Position
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {jobTitle}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Employment Term
            </Typography>
            <Typography variant="body1">{employmentTerm}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body1">{formattedStartDate}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Work Schedule
            </Typography>
            <Typography variant="body1">{workSchedule}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography
        variant="h6"
        sx={{
          mt: 1.5,
          mb: 1.5,
          "@media print": { fontSize: "11pt !important" },
          fontWeight: "bold",
        }}
      >
        2. Compensation and Benefits
      </Typography>
      <Paper variant="outlined" sx={{ ...noBreakInsideSx, p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Base Salary (Annual/Monthly)
            </Typography>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{
                "@media print": { color: "black", fontSize: "14pt !important" },
                fontWeight: "bold",
              }}
            >
              {formattedSalary}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Benefits Summary
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-line",
                borderLeft: "3px solid #ccc",
                pl: 1,
              }}
            >
              {benefits}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ ...noBreakInsideSx, mt: 4 }}>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          This offer is contingent upon successful background verification and
          satisfactory completion of all pre-employment requirements. The
          detailed{" "}
          <Link
            href={termsLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: "bold" }}
          >
            Terms and Conditions ({termsLink})
          </Link>{" "}
          for this employment are available at the provided link and form an
          integral part of this offer.
        </Typography>

        <Typography variant="body1" sx={{ mb: 1.5 }}>
          Please signify your acceptance of this offer by signing below and
          returning this document to us by{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {formatDate(
              new Date(
                new Date().setDate(new Date().getDate() + 7)
              ).toISOString()
            )}
          </Box>{" "}
          (7 days from now).
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          We look forward to welcoming you to the team.
        </Typography>

        <Box sx={{ mt: 6 }}>
          <Typography variant="body1" sx={{ mb: 5, fontWeight: "bold" }}>
            Sincerely,
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid size={{ xs: 5 }}>
              <Divider sx={{ borderBottom: "1px solid black" }} />
              <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {preparerFullName}
                </Box>
              </Typography>
              <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
                {preparerTitle}
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <Divider sx={{ borderBottom: "1px solid black" }} />
              <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {candidateName}
                </Box>
              </Typography>
              <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
                Candidate Acceptance Signature
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

// =================================================================
// --- ContractDocument Component (New Format) ---
// =================================================================

const ContractDocument: React.FC<DocumentProps> = ({ id, fullData }) => {
  const {
    candidate,
    requisition,
    offer,
    candidateName,
    preparerFullName,
    preparerTitle,
    companyName,
    organizationDetails,
  } = fullData;

  const contractDate = formatDate(new Date().toISOString());
  const jobTitle = requisition.title;
  const formattedStartDate = formatDate(offer.startDate);
  const formattedSalary = formatCurrency(offer.baseSalary, offer.currency);
  const employmentTerm = requisition?.employmentTerm || "Permanent";
  const companyAddress =
    organizationDetails?.address || "Head Office, [City, Country]";

  return (
    <Box
      id={id}
      sx={{
        p: 4,
        minHeight: "80vh",
        fontSize: "10pt",
        lineHeight: 1.5,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4, pt: 2, ...noBreakInsideSx }}>
        <Typography
          variant="h5"
          sx={{ textDecoration: "underline", fontWeight: "bold" }}
        >
          EMPLOYMENT CONTRACT AGREEMENT
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Made this{" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {contractDate}
          </Box>
        </Typography>
      </Box>

      <Box sx={{ mb: 3, ...noBreakInsideSx }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
          The Parties:
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Employer
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>{companyName}</Typography>
            <Typography>{companyAddress}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Employee
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>{candidateName}</Typography>
            <Typography>
              {candidate.email} | {candidate.phone || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4, ...noBreakInsideSx }}>
        <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: "bold" }}>
          1. Position and Duration
        </Typography>
        <List dense sx={{ ml: -2 }}>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  1.1{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Position:
                  </Box>{" "}
                  The Employee is hereby employed in the position of{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {jobTitle}
                  </Box>
                  .
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  1.2{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Start Date:
                  </Box>{" "}
                  Employment shall commence on{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {formattedStartDate}
                  </Box>
                  .
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  1.3{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Term:
                  </Box>{" "}
                  The term of this contract is{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {employmentTerm}
                  </Box>
                  , commencing on the Start Date.
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: "bold" }}>
          2. Compensation
        </Typography>
        <List dense sx={{ ml: -2 }}>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  2.1{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Base Salary:
                  </Box>{" "}
                  The Employee shall receive a base salary of{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {formattedSalary}
                  </Box>{" "}
                  annually/monthly.
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  2.2{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Benefits:
                  </Box>{" "}
                  The Employee will be entitled to the company benefits outlined
                  in Appendix A (attached), which includes the summary provided
                  in the offer letter.
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: "bold" }}>
          3. General Provisions
        </Typography>
        <List dense sx={{ ml: -2 }}>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  3.1{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Governing Law:
                  </Box>{" "}
                  This contract shall be governed by and construed in accordance
                  with the laws of the jurisdiction where the Employer's primary
                  office is located.
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemText
              primary={
                <Typography component="span">
                  3.2{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    Entire Agreement:
                  </Box>{" "}
                  This document constitutes the entire agreement between the
                  parties and supersedes any prior understanding or
                  representation of any kind.
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Typography variant="body1" sx={{ mt: 4, mb: 1 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            IN WITNESS WHEREOF
          </Box>
          , the parties have executed this Agreement as of the date first
          written above.
        </Typography>
      </Box>

      <Box sx={{ mt: 6, ...noBreakInsideSx }}>
        <Grid container justifyContent="space-between">
          <Grid size={{ xs: 5 }}>
            <Divider sx={{ borderBottom: "1px solid black" }} />
            <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {preparerFullName}
              </Box>
            </Typography>
            <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
              {preparerTitle} (For and on behalf of {companyName})
            </Typography>
          </Grid>
          <Grid size={{ xs: 5 }}>
            <Divider sx={{ borderBottom: "1px solid black" }} />
            <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {candidateName}
              </Box>
            </Typography>
            <Typography variant="body2" align="left" sx={{ mt: 0.5 }}>
              Employee Signature
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ pageBreakBefore: "always", mt: 6 }}>
        <Typography
          variant="h6"
          sx={{ textDecoration: "underline", mb: 2, fontWeight: "bold" }}
        >
          APPENDIX A: BENEFITS SUMMARY
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-line",
            borderLeft: "3px solid #ccc",
            pl: 1,
          }}
        >
          {offer.benefits}
        </Typography>
      </Box>
    </Box>
  );
};

// =================================================================
// --- DocumentViewDialog Component (The New Main Component) ---
// =================================================================

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  row,
  open,
  handleClose,
}) => {
  const [activeTab, setActiveTab] = useState<"offer" | "contract">("offer");

  const applicationId = row.application.id;

  const {
    data: applicationDetails,
    isLoading: isApplicationLoading,
    error: applicationError,
  } = useDataQuery<FullApplicationData>({
    apiEndPoint: `https://api.techbee.et/api/hr/applications/${applicationId}`,
    enabled: open,
  });

  const {
    data: preparerDetails,
    isLoading: isPreparerLoading,
    error: preparerError,
  } = useDataQuery<PreparerDetails>({
    apiEndPoint: `https://auth.api.techbee.et/api/users/${row.preparedBy}`,
    enabled: !!row.preparedBy && open,
  });

  const {
    data: organizationDetails,
    isLoading: isOrgLoading,
    error: orgError,
  } = useDataQuery<OrganizationDetails>({
    apiEndPoint: `https://core.api.techbee.et/api/organizationNodes/${row.organizationNodeId}`,
    enabled: !!row.organizationNodeId && open,
  });

  const isLoading = isApplicationLoading || isPreparerLoading || isOrgLoading;
  const error = applicationError || preparerError || orgError;

  const fullData = useMemo<DocumentFullData | null>(() => {
    if (!applicationDetails) return null;

    const candidate = applicationDetails.candidate || row.application.candidate;
    const requisition =
      applicationDetails.requisition || row.application.requisition;
    const offer = applicationDetails.offer || row;

    const candidateName = `${candidate.firstName} ${candidate.fatherName}`;
    const preparerFullName = preparerDetails
      ? `${preparerDetails.firstName} ${preparerDetails.lastName}`
      : "[Preparer Name Missing]";
    const preparerTitle =
      preparerDetails?.title ||
      organizationDetails?.code ||
      "HR Representative";
    const companyName =
      organizationDetails?.name ||
      row.organizationNodeId ||
      "[Organization Name Missing]";

    return {
      candidate,
      requisition,
      offer: { ...offer, terms: row.terms },
      preparerDetails,
      organizationDetails,
      candidateName,
      preparerFullName,
      preparerTitle,
      companyName,
    };
  }, [applicationDetails, preparerDetails, organizationDetails, row]);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "offer" | "contract"
  ) => {
    setActiveTab(newValue);
  };

  const handlePrintToPDF = () => {
    const contentId =
      activeTab === "offer"
        ? "offer-document-content"
        : "contract-document-content";
    const fileNameSuffix = activeTab === "offer" ? "Offer_Letter" : "Contract";
    const input = document.getElementById(contentId);

    if (input && fullData) {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        let position = 0;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        const candidateNameForFile = fullData.candidateName.replace(/\s/g, "_");
        pdf.save(`${fileNameSuffix}_${candidateNameForFile}.pdf`);
      });
    }
  };

  const renderContent = () => {
    if (!fullData) return null;

    if (activeTab === "offer") {
      return <OfferDocument fullData={fullData} id="offer-document-content" />;
    } else {
      return (
        <ContractDocument fullData={fullData} id="contract-document-content" />
      );
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 4,
              alignItems: "center",
            }}
          >
            <CircularProgress size={20} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading all document details...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !fullData) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Error Loading Documents</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            {error?.message ||
              "Failed to load complete document details or required external data (preparer/organization)."}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const printHideSx = {
    "@media print": {
      display: "none !important",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={printHideSx}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="offer and contract tabs"
          >
            <Tab label="Offer Letter" value="offer" />
            <Tab label="Employment Contract" value="contract" />
          </Tabs>
          <Button onClick={handleClose} color="inherit" startIcon={<Close />}>
            Close
          </Button>
        </Grid>
      </DialogTitle>

      <DialogContent disableGutters>{renderContent()}</DialogContent>

      <DialogActions sx={printHideSx}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handlePrintToPDF}
          color="primary"
          variant="contained"
          startIcon={<Print />}
        >
          Download {activeTab === "offer" ? "Offer" : "Contract"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewDialog;
