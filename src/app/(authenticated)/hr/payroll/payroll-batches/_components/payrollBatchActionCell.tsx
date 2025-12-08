
import {
  Chip,
  Tooltip,
  IconButton,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  FileDownload as FileDownloadIcon,
  VerifiedOutlined,
  Payment,
  PostAddOutlined,
  RepeatRounded,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { usePayrollBatchActionContext } from "./PayrollBatchActionContext";

// Create a wrapper component for the actions cell
export const PayrollBatchActionsCell = ({ row }: { row: any }) => {
  const { actionHandlers, isProcessing } = usePayrollBatchActionContext();
  const batch = row.original;


  const handleActionClick = (event: React.MouseEvent, action: () => void) => {
    event.stopPropagation();
    action();

  };

  const isBatchProcessing = isProcessing(batch.id);

  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'nowrap', overflow: 'visible' }}>
      {/* View Details */}
      <Tooltip title="View batch details">
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => handleActionClick(e, () => actionHandlers.onViewDetails(batch))}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* View Payslips */}
      <Tooltip title="View generated payslips">
        <IconButton
          size="small"
          color="primary"
          disabled={batch.status === "Draft"}
          onClick={(e) => handleActionClick(e, () => actionHandlers.onViewPayslips(batch))}
        >
          <DescriptionIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Generate Payslip */}
      <Tooltip title="Generate Payslip">
        <Button
          variant="contained"
          size="small"
          disabled={isBatchProcessing || batch.status !== "Draft"}
          startIcon={
            isBatchProcessing && batch.status === "Draft" ? (
              <CircularProgress size={16} />
            ) : (
              <FileDownloadIcon fontSize="small" />
            )
          }
          onClick={(e) => handleActionClick(e, () => actionHandlers.onGeneratePayslip(batch))}
          sx={{ minWidth: 'auto', px: 1, whiteSpace: 'nowrap' }}
        >
          Generate Payslip
        </Button>
      </Tooltip>

      {/* Verify */}
      <Tooltip title="Verify">
        <Button
          variant="contained"
          size="small"
          disabled={isBatchProcessing || batch.status !== "Generated"}
          startIcon={
            isBatchProcessing && batch.status === "Generated" ? (
              <CircularProgress size={16} />
            ) : (
              <VerifiedOutlined fontSize="small" />
            )
          }
          onClick={(e) => handleActionClick(e, () => actionHandlers.onVerify(batch))}
          sx={{ minWidth: 'auto', px: 1, whiteSpace: 'nowrap' }}
        >
          {isBatchProcessing && batch.status === "Generated"
            ? "Verifying..."
            : batch.status === "Verified"
              ? "Verified"
              : "Verify"}
        </Button>
      </Tooltip>


      {/* Status Chip */}
      <Chip
        label={
          batch?.status === "Done"
            ? "Done"
            : batch?.status === "Verified"
              ? "Pending Approval..."
              : "Not Approved"
        }
        variant="filled"
        size="small"
        sx={{ minWidth: 'auto', px: 0.5, fontSize: '0.7rem' }}
      />

      {/* Pay */}
      <Tooltip title="Pay">
        <Button
          variant="contained"
          size="small"
          disabled={batch.status !== "Done"}
          startIcon={<Payment fontSize="small" />}
          onClick={(e) => handleActionClick(e, () => actionHandlers.onPay(batch.id))}
          sx={{ minWidth: 'auto', px: 1, whiteSpace: 'nowrap' }}
        >
          Pay
        </Button>
      </Tooltip>

      {/* Post */}
      <Tooltip title="Post">
        <Button
          variant="contained"
          size="small"
          disabled={batch.status !== "Paid"}
          startIcon={<PostAddOutlined fontSize="small" />}
          onClick={(e) => handleActionClick(e, () => actionHandlers.onPost(batch))}
          sx={{ minWidth: 'auto', px: 1, whiteSpace: 'nowrap' }}
        >
          Post
        </Button>
      </Tooltip>

      {/* Rollback */}
      <Tooltip title="Rollback">
        <IconButton
          size="small"
          color="warning"
          disabled={batch.status === "Paid" || batch.status === "Draft"}
          onClick={(e) => handleActionClick(e, () => actionHandlers.onRollback(batch.id))}
        >
          <RepeatRounded fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
