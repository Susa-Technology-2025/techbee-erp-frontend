// usePayrollBatchActions.ts - SIMPLIFIED
import { useCallback, useEffect, useState } from "react";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useQueryClient } from "@tanstack/react-query";

export const usePayrollBatchActions = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Only track currently processing batches for UI loading states
  const [processingBatches, setProcessingBatches] = useState<Set<string>>(
    new Set()
  );

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBatchData, setSelectedBatchData] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [payslipsModalOpen, setPayslipsModalOpen] = useState(false);
  const [selectedBatchForPayslips, setSelectedBatchForPayslips] =
    useState<any>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const session = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (session?.user?.employeeId) {
      setUserId(session.user.id);
    } else {
      setUserId(null);
    }
  }, [session]);

  // Helper functions for processing states (only for UI loading)
  const startProcessing = useCallback((batchId: string) => {
    setProcessingBatches((prev) => new Set(prev).add(batchId));
  }, []);

  const stopProcessing = useCallback((batchId: string) => {
    setProcessingBatches((prev) => {
      const newSet = new Set(prev);
      newSet.delete(batchId);
      return newSet;
    });
  }, []);

  const isProcessing = useCallback(
    (batchId: string) => {
      return processingBatches.has(batchId);
    },
    [processingBatches]
  );

  // Your existing mutations with automatic cache invalidation
  const generatePaySlipMutation = useDataMutation({
    apiEndPoint:
      "https://api.techbee.et/api/hr/payrollBatches/generate-batch-pay-slip",
    method: "POST",
    invalidateQueryKey: ["https://api.techbee.et/api/hr/payrollBatches"],
  });

  const rollbackGeneratedPayslipMutation = useDataMutation({
    apiEndPoint:
      "https://api.techbee.et/api/hr/payrollBatches/:batchId/rollback",
    method: "POST",
    invalidateQueryKey: ["https://api.techbee.et/api/hr/payrollBatches"],
  });

  const verifyPayrollBatchMutation = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/:id/verify",
    method: "POST",
    invalidateQueryKey: ["https://api.techbee.et/api/hr/payrollBatches"],
  });

  const postPayrollBatchMutation = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches/:id/post",
    method: "POST",
    invalidateQueryKey: ["https://api.techbee.et/api/hr/payrollBatches"],
  });

  const payBatchMutation = useDataMutation({
    apiEndPoint:
      "https://api.techbee.et/api/hr/payrollBatches/:batchId/mark-paid",
    method: "POST",
    invalidateQueryKey: ["https://api.techbee.et/api/hr/payrollBatches"],
  });

  // Modal handlers (unchanged)
  const handleOpenDetailModal = useCallback((batch: any) => {
    setSelectedBatchData(batch);
    setDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedBatchData(null);
  }, []);

  const handleOpenPreviewModal = useCallback((batch: any) => {
    setSelectedBatchId(batch.id);
    setPreviewModalOpen(true);
  }, []);

  const handleClosePreviewModal = useCallback(() => {
    setPreviewModalOpen(false);
    setSelectedBatchId(null);
  }, []);

  const handleOpenPayslipsModal = useCallback((batch: any) => {
    setSelectedBatchForPayslips(batch);
    setPayslipsModalOpen(true);
  }, []);

  const handleClosePayslipsModal = useCallback(() => {
    setPayslipsModalOpen(false);
    setSelectedBatchForPayslips(null);
  }, []);

  // Snackbar handlers
  const showSnackbar = useCallback(
    (
      message: string,
      severity: "success" | "error" | "info" | "warning" = "success"
    ) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // SIMPLIFIED Action handlers - no optimistic updates needed!
  const handleViewDetails = useCallback(
    (batch: any) => {
      handleOpenDetailModal(batch);
    },
    [handleOpenDetailModal]
  );

  const handleViewPayslips = useCallback(
    (batch: any) => {
      handleOpenPayslipsModal(batch);
    },
    [handleOpenPayslipsModal]
  );

  const handleGeneratePayslip = useCallback(
    (batch: any) => {
      handleOpenPreviewModal(batch);
    },
    [handleOpenPreviewModal]
  );

  const handlePreviewConfirm = useCallback(async () => {
    if (!selectedBatchId) return;

    setPreviewModalOpen(false);
    startProcessing(selectedBatchId);

    try {
      const response = await generatePaySlipMutation.mutateAsync({
        batchId: selectedBatchId,
      });

      showSnackbar(
        `Payslip generation initiated successfully for batch: ${
          response?.payrollBatch?.name || ""
        }. ` +
          `${response.message || ""} (Generated: ${
            response?.totalEmployeesProcessed || 0
          } payslips).`,
        "success"
      );

      queryClient.invalidateQueries([
        "https://api.techbee.et/api/hr/payrollBatches",
      ]);
    } catch (error: any) {
      showSnackbar(
        error?.data?.message || error?.message || "Failed to generate payslip.",
        "error"
      );
    } finally {
      stopProcessing(selectedBatchId);
    }
  }, [
    selectedBatchId,
    generatePaySlipMutation,
    queryClient,
    showSnackbar,
    startProcessing,
    stopProcessing,
  ]);

  const handleVerify = useCallback(
    async (batch: any) => {
      startProcessing(batch.id);

      try {
        await verifyPayrollBatchMutation.mutateAsync({
          __pathParams: { id: batch.id },
        });
        showSnackbar("Batch verified successfully", "success");
        queryClient.invalidateQueries([
          "https://api.techbee.et/api/hr/payrollBatches",
        ]);
      } catch (error: any) {
        showSnackbar(
          error?.data?.message || error?.message || "Failed to verify batch",
          "error"
        );
      } finally {
        stopProcessing(batch.id);
      }
    },
    [
      verifyPayrollBatchMutation,
      queryClient,
      showSnackbar,
      startProcessing,
      stopProcessing,
    ]
  );

  const handlePay = useCallback(
    async (batchId: string) => {
      startProcessing(batchId);

      try {
        await payBatchMutation.mutateAsync({
          userId,
          __pathParams: { batchId },
        });
        showSnackbar("Batch paid successfully", "success");
        queryClient.invalidateQueries([
          "https://api.techbee.et/api/hr/payrollBatches",
        ]);
      } catch (error: any) {
        showSnackbar(
          error?.data?.message || error?.message || "Failed to pay batch",
          "error"
        );
      } finally {
        stopProcessing(batchId);
      }
    },
    [
      payBatchMutation,
      userId,
      queryClient,
      showSnackbar,
      startProcessing,
      stopProcessing,
    ]
  );

  const handlePost = useCallback(
    async (batch: any) => {
      startProcessing(batch.id);

      try {
        await postPayrollBatchMutation.mutateAsync({
          postedByUserId: userId,
          journalEntryId: batch.journalEntryId,
          journalEntryCode: batch.journalEntryCode,

          __pathParams: { id: batch.id },
        });
        showSnackbar("Batch posted successfully", "success");
        queryClient.invalidateQueries([
          "https://api.techbee.et/api/hr/payrollBatches",
        ]);
      } catch (error: any) {
        showSnackbar(
          error?.data?.message || error?.message || "Failed to post batch",
          "error"
        );
      } finally {
        stopProcessing(batch.id);
      }
    },
    [
      postPayrollBatchMutation,
      queryClient,
      userId,
      showSnackbar,
      startProcessing,
      stopProcessing,
    ]
  );

  const handleRollback = useCallback(
    async (batchId: string) => {
      startProcessing(batchId);

      try {
        await rollbackGeneratedPayslipMutation.mutateAsync({
          __pathParams: { batchId },
        });
        showSnackbar("Rollback successful", "success");
        queryClient.invalidateQueries([
          "https://api.techbee.et/api/hr/payrollBatches",
        ]);
      } catch (error: any) {
        showSnackbar(
          error?.data?.message || error?.message || "Failed to rollback",
          "error"
        );
      } finally {
        stopProcessing(batchId);
      }
    },
    [
      rollbackGeneratedPayslipMutation,
      queryClient,
      showSnackbar,
      startProcessing,
      stopProcessing,
    ]
  );

  return {
    // Action handlers
    actionHandlers: {
      onViewDetails: handleViewDetails,
      onViewPayslips: handleViewPayslips,
      onGeneratePayslip: handleGeneratePayslip,
      onVerify: handleVerify,
      onPay: handlePay,
      onPost: handlePost,
      onRollback: handleRollback,
    },

    // Modal handlers
    modalHandlers: {
      onPreviewConfirm: handlePreviewConfirm,
      onCloseDetailModal: handleCloseDetailModal,
      onClosePreviewModal: handleClosePreviewModal,
      onClosePayslipsModal: handleClosePayslipsModal,
      onCloseSnackbar: handleCloseSnackbar,
    },

    // Modal states
    modalStates: {
      detailModalOpen,
      previewModalOpen,
      payslipsModalOpen,
      selectedBatchData,
      selectedBatchForPayslips,
      selectedBatchId,
      snackbarOpen,
      snackbarMessage,
      snackbarSeverity,
    },

    // Loading states only
    isProcessing,
  };
};
