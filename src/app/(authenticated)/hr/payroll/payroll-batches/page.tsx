// Your main component
"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { payrollBatchSchema } from "./_schema/payroll-batch";
import {
  PayrollBatchActionProvider,
  usePayrollBatchActionContext,
} from "./_components/PayrollBatchActionContext";
import { PayrollBatchModals } from "./_components/PayrollBatchModals";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Inner component that uses the context
const PayrollBatchTableContent = () => {
  const { modalStates, modalHandlers } = usePayrollBatchActionContext();

  // Fetch additional data needed for modals
  const { data: organizationNodes = [] } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/core/organizationNodes",
    noFilter: true,
  });
  const orgNodes =
    organizationNodes.data || organizationNodes?.data?.data || [];
  const { data: positions = [] } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/positions",
    noFilter: true,
  });
  const positionsList = positions.data || positions?.data?.data || [];
  const { data: salaryStructures = [] } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/salaryStructures",
    noFilter: true,
  });
  const salaryStructuresList =
    salaryStructures?.data || salaryStructures?.data?.data || [];

  return (
    <>
      <MaterialTableWrapper
        schema={payrollBatchSchema}
        // other props...
      />

      <PayrollBatchModals
        modalStates={modalStates}
        modalHandlers={modalHandlers}
        organizationNodes={orgNodes}
        positions={positionsList}
        salaryStructures={salaryStructuresList}
      />
    </>
  );
};

// Main export component
export default function PayrollBatchTable() {
  return (
    <PayrollBatchActionProvider>
      <PayrollBatchTableContent />
    </PayrollBatchActionProvider>
  );
}
