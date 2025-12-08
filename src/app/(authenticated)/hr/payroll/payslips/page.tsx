
// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import {
  useGetPayslipsQuery,
  useVerifyPayslipMutation,
  useApprovePayslipMutation,
  usePayPayslipMutation,
  usePostPayslipMutation,
  useVerifyAllPayslipsBatchMutation,
  useApproveAllPayslipsBatchMutation,
  useGetPayslipsByEmployeeIdQuery,
  usePayAllPayslipsBatchMutation,
  usePostAllPayslipsBatchMutation,
} from "@/app/hr/_queries/payslips";
import { ReusableTable } from "@/components/form-components";
import { MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert, // Import Alert for messages
  AlertTitle, // Import AlertTitle for messages
} from "@mui/material";
import {
  Share,
  PictureAsPdf,
  WorkOutline,
  CheckCircleOutline,
  PendingActions,
  AttachMoney,
  AccountBalanceWallet,
  TrendingUp,
  MonetizationOn,
  Receipt,
  AccountBalance,
  ReceiptLong,
  DescriptionOutlined,
  Payment,
  CalendarToday,
  Check,
  ThumbUp,
  CreditCard,
  Send,
  Rowing,
} from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Payslip, payslipSchema } from "@/app/hr/_schemas/payslips";
import { generatePayslipPdf, sharePayslip } from "./_utils/pdf-utils";
import { theme } from "@/theme";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { paySlipSchema } from "./_schema/payslip-schema";


export default ({ id }: string) => {

  return (


    <MaterialTableWrapper
      schema={paySlipSchema}
      enableGrouping={true}
      enableAggregation={true}
      forcedGroupingColumns={["payrollBatch.name"]}
      dataProcessingConfig={{
        missingValueHandling: {
          "payrollBatch.name": {
            defaultValue: "Generated without Batch",
            label: "Generated without Batch",
            style: {
              backgroundColor: 'rgba(255, 152, 0, 0.08)',
              hoverBackgroundColor: 'rgba(255, 152, 0, 0.12)'
            }
          }
        }
      }}
      aggregationConfig={{
        "grossPay": {
          fn: "sum",
          label: "Gross Salary",
          format: (value) => `Total Gross Salary: ETB ${value?.toLocaleString()}`
        },
        "netPay": {
          fn: "sum",
          label: "Net Salary",
          format: (value) => `Total Net Salary: ETB ${value?.toLocaleString()}`
        },
        "employee": {
          fn: "count",
          label: "Employee",
          format: (value) => `Total Employees: ${value}`
        },
      }}
      maxHeight="80vh"
    />


  );
};
