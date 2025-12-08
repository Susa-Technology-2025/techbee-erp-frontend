// // PayrollBatchTableWrapper.tsx
// "use client";

// import { useCallback, useMemo, useState } from "react";
// import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
// import { payrollBatchSchema } from "./_schema/payroll-batch";
// import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/store/store";
// import {
//   Box,
//   Typography,
//   Stack,
//   Card,
//   CardContent,
//   Snackbar,
//   Alert,
//   Portal,
// } from "@mui/material";
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Similar to FileInvoiceDollar
// import LayersIcon from '@mui/icons-material/Layers'; // Similar to LayerGroup
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import WarningIcon from '@mui/icons-material/Warning';

// // Import your existing modals
// import PayrollBatchDetailModal from "./batch-detail-card";
// import PayrollPreviewModal from "./preview-card";
// import PayslipsByBatchIdModal from "./payslipsbyBatchId";
// interface PayrollBatchTableWrapperProps {
//   // You can add any additional props here
// }

// export default function PayrollBatchTableWrapper(props: PayrollBatchTableWrapperProps) {
//   const [employeeId, setEmployeeId] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const session = useSelector((state: RootState) => state.session);

//   // Modal states
//   const [detailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedBatchData, setSelectedBatchData] = useState<any>(null);
//   const [previewModalOpen, setPreviewModalOpen] = useState(false);
//   const [payslipsModalOpen, setPayslipsModalOpen] = useState(false);
//   const [selectedBatchForPayslips, setSelectedBatchForPayslips] = useState<any>(null);
//   const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

//   // Snackbar states
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

//   // Loading states
//   const [generatingPayslipBatchId, setGeneratingPayslipBatchId] = useState<string | null>(null);

//   // Use your existing mutations
//   const generatePaySlipMutation = useDataMutation({
//     apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/generate-batch-pay-slip",
//     method: "POST",
//   });

//   const rollbackGeneratedPayslipMutation = useDataMutation({
//     apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/:batchId/rollback",
//     method: "POST",
//   });

//   const verifyPayrollBatchMutation = useDataMutation({
//     apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/:id/verify",
//     method: "POST",
//   });

//   const postPayrollBatchMutation = useDataMutation({
//     apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/:id/post",
//     method: "POST",
//   });

//   const payBatchMutation = useDataMutation({
//     apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/:batchId/mark-paid",
//     method: "POST",
//   });

//   // Action handlers
//   const handleViewDetails = useCallback((batch: any) => {
//     setSelectedBatchData(batch);
//     setDetailModalOpen(true);
//   }, []);

//   const handleViewPayslips = useCallback((batch: any) => {
//     setSelectedBatchForPayslips(batch);
//     setPayslipsModalOpen(true);
//   }, []);

//   const handleGeneratePayslip = useCallback(async (batch: any) => {
//     setSelectedBatchId(batch.id);
//     setPreviewModalOpen(true);
//   }, []);

//   const handlePreviewConfirm = useCallback(async () => {
//     if (!selectedBatchId) return;

//     setPreviewModalOpen(false);
//     setGeneratingPayslipBatchId(selectedBatchId);

//     try {
//       const response = await generatePaySlipMutation.mutateAsync({
//         body: { batchId: selectedBatchId },
//       });

//       setSnackbarMessage(
//         `Payslip generation initiated successfully for batch: ${response?.payrollBatch?.name || ""}. ` +
//         `${response.message || ""} (Generated: ${response?.totalEmployeesProcessed || 0} payslips).`
//       );
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (error: any) {
//       setSnackbarMessage(
//         error?.data?.message || error?.message || "Failed to generate payslip."
//       );
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     } finally {
//       setGeneratingPayslipBatchId(null);
//     }
//   }, [selectedBatchId, generatePaySlipMutation]);

//   const handleVerify = useCallback(async (batch: any) => {
//     try {
//       await verifyPayrollBatchMutation.mutateAsync({
//         __pathParams: { id: batch.id },
//       });
//       setSnackbarMessage("Batch verified successfully");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (error: any) {
//       setSnackbarMessage(error?.data?.message || error?.message || "Failed to verify batch");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   }, [verifyPayrollBatchMutation]);

//   const handlePay = useCallback(async (batchId: string) => {
//     try {
//       await payBatchMutation.mutateAsync({
//         body: { userId },
//         __pathParams: { batchId },
//       });
//       setSnackbarMessage("Batch paid successfully");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (error: any) {
//       setSnackbarMessage(error?.data?.message || error?.message || "Failed to pay batch");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   }, [payBatchMutation, userId]);

//   const handlePost = useCallback(async (batch: any) => {
//     try {
//       await postPayrollBatchMutation.mutateAsync({
//         body: {
//           postedByUserId: userId,
//           journalEntryId: batch.journalEntryId,
//           journalEntryCode: batch.journalEntryCode,
//         },
//         __pathParams: { id: batch.id },
//       });
//       setSnackbarMessage("Batch posted successfully");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (error: any) {
//       setSnackbarMessage(error?.data?.message || error?.message || "Failed to post batch");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   }, [postPayrollBatchMutation, userId]);

//   const handleRollback = useCallback(async (batchId: string) => {
//     try {
//       await rollbackGeneratedPayslipMutation.mutateAsync({
//         __pathParams: { batchId },
//       });
//       setSnackbarMessage("Rollback successful");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (error: any) {
//       setSnackbarMessage(error?.data?.message || error?.message || "Failed to rollback");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   }, [rollbackGeneratedPayslipMutation]);

//   // Prepare action handlers for the table
//   const actionHandlers = useMemo(() => ({
//     onViewDetails: handleViewDetails,
//     onViewPayslips: handleViewPayslips,
//     onGeneratePayslip: handleGeneratePayslip,
//     onVerify: handleVerify,
//     onPay: handlePay,
//     onPost: handlePost,
//     onRollback: handleRollback,
//     generatingPayslipBatchId,
//   }), [
//     handleViewDetails,
//     handleViewPayslips,
//     handleGeneratePayslip,
//     handleVerify,
//     handlePay,
//     handlePost,
//     handleRollback,
//     generatingPayslipBatchId,
//   ]);

//   // Dashboard stats calculation (you can fetch this from your API or calculate from data)
//   const dashboardStats = useMemo(() => {
//     // This would be calculated from your actual data
//     return { total: 0, completed: 0, draft: 0 };
//   }, []);

//   return (
//     <Box sx={{ p: 3, maxWidth: 1600, mx: "auto", position: "relative" }}>
//       {/* Header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//           pb: 2,
//           borderBottom: 1,
//           borderColor: "divider",
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             color: "primary.main",
//             gap: 2,
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: "primary.main",
//               color: "white",
//               width: 32,
//               height: 32,
//               borderRadius: 2,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ReceiptLongIcon />
//           </Box>
//           Payroll Batch Management
//         </Typography>
//       </Box>

//       {/* Dashboard Cards */}
//       <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: "wrap" }}>
//         <Card sx={{ minWidth: 240, flex: 1, transition: "all 0.3s ease" }}>
//           <CardContent>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography color="text.secondary" variant="body2" fontWeight={600} fontSize={18}>
//                 Total Batches
//               </Typography>
//               <Box sx={{ bgcolor: "primary.main", color: "white", width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <LayersIcon />
//               </Box>
//             </Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{dashboardStats.total}</Typography>
//             <Typography variant="body2" color="text.secondary">+8 this month</Typography>
//           </CardContent>
//         </Card>

//         <Card sx={{ minWidth: 240, flex: 1, transition: "all 0.3s ease" }}>
//           <CardContent>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography color="text.secondary" variant="body2" fontWeight={600} fontSize={18}>
//                 Completed
//               </Typography>
//               <Box sx={{ bgcolor: "primary.main", color: "white", width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <CheckCircleIcon />
//               </Box>
//             </Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{dashboardStats.completed}</Typography>
//             <Typography variant="body2" color="text.secondary">+6 this week</Typography>
//           </CardContent>
//         </Card>

//         <Card sx={{ minWidth: 240, flex: 1, transition: "all 0.3s ease" }}>
//           <CardContent>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography color="text.secondary" variant="body2" fontWeight={600} fontSize={18}>
//                 Requires Review
//               </Typography>
//               <Box sx={{ bgcolor: "primary.main", color: "white", width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <WarningIcon />
//               </Box>
//             </Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{dashboardStats.draft}</Typography>
//             {dashboardStats.draft > 0 && (
//               <Typography variant="body2" color="text.secondary">{`${dashboardStats.draft} high priority`}</Typography>
//             )}
//           </CardContent>
//         </Card>
//       </Stack>

//       {/* Table with all your functionality */}
//       <MaterialTableWrapper
//         schema={payrollBatchSchema}
//         meta={{ actionHandlers }}
//         // You can pass additional props to customize the table behavior
//       />

//       {/* Your existing modals */}
//       <PayrollBatchDetailModal
//         open={detailModalOpen}
//         onClose={() => setDetailModalOpen(false)}
//         batchData={selectedBatchData}
//         organizationNodes={[]} // Pass your actual data
//         positions={[]}
//         salaryStructures={[]}
//       />

//       <PayrollPreviewModal
//         open={previewModalOpen}
//         onClose={() => setPreviewModalOpen(false)}
//         onConfirm={handlePreviewConfirm}
//         batchId={selectedBatchId}
//         type="batch"
//       />

//       <PayslipsByBatchIdModal
//         open={payslipsModalOpen}
//         onClose={() => setPayslipsModalOpen(false)}
//         batchId={selectedBatchForPayslips?.id || ""}
//         batchName={selectedBatchForPayslips?.name || ""}
//       />

//       {/* Snackbar */}
//       <Portal>
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={6000}
//           onClose={() => setSnackbarOpen(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             variant="filled"
//             onClose={() => setSnackbarOpen(false)}
//             severity={snackbarSeverity}
//             sx={{ width: "100%" }}
//           >
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>
//       </Portal>
//     </Box>
//   );
// }
