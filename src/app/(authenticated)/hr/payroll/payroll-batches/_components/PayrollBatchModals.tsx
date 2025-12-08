// PayrollBatchModals.tsx
import React from 'react';
import { Portal, Snackbar, Alert } from '@mui/material';
import PayrollBatchDetailModal from './batch-detail-card';
import PayrollPreviewModal from './preview-card';
import PayslipsByBatchIdModal from './payslipsbyBatchId';

interface PayrollBatchModalsProps {
    modalStates: {
        detailModalOpen: boolean;
        previewModalOpen: boolean;
        payslipsModalOpen: boolean;
        selectedBatchData: any;
        selectedBatchForPayslips: any;
        selectedBatchId: string | null;
        snackbarOpen: boolean;
        snackbarMessage: string;
        snackbarSeverity: "success" | "error" | "info" | "warning";
    };
    modalHandlers: {
        onPreviewConfirm: () => void;
        onCloseDetailModal: () => void;
        onClosePreviewModal: () => void;
        onClosePayslipsModal: () => void;
        onCloseSnackbar: () => void;
    };
    // Additional data needed for modals
    organizationNodes: any[];
    positions: any[];
    salaryStructures: any[];
}

export const PayrollBatchModals: React.FC<PayrollBatchModalsProps> = ({
    modalStates,
    modalHandlers,
    organizationNodes,
    positions,
    salaryStructures,
}) => {

    const {
        detailModalOpen,
        previewModalOpen,
        payslipsModalOpen,
        selectedBatchData,
        selectedBatchForPayslips,
        selectedBatchId,
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
    } = modalStates;

    const {
        onPreviewConfirm,
        onCloseDetailModal,
        onClosePreviewModal,
        onClosePayslipsModal,
        onCloseSnackbar,
    } = modalHandlers;

    return (
        <>
            {/* Snackbar */}
            <Portal>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={onCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        variant="filled"
                        onClose={onCloseSnackbar}
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Portal>

            {/* Detail Modal */}
            <PayrollBatchDetailModal
                open={detailModalOpen}
                onClose={onCloseDetailModal}
                batchData={selectedBatchData}
                organizationNodes={organizationNodes}
                positions={positions}
                salaryStructures={salaryStructures}
            />

            {/* Preview Modal */}
            <PayrollPreviewModal
                open={previewModalOpen}
                onClose={onClosePreviewModal}
                onConfirm={onPreviewConfirm}
                batchId={selectedBatchId}
                type="batch"
            />

            {/* Payslips Modal */}
            <PayslipsByBatchIdModal
                open={payslipsModalOpen}
                onClose={onClosePayslipsModal}
                batchId={selectedBatchForPayslips?.id || ""}
                batchName={selectedBatchForPayslips?.name || ""}
                batchStatus={selectedBatchForPayslips?.status || ""}
            />
        </>
    );
};