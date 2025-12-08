"use client";

import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";

interface PayslipComponent {
  id: string;
  amount: number;
  salaryRule?: {
    name?: string;
    category?: {
      name?: string;
    };
  };
}

interface Payslip {
  id: string;
  employee: {
    firstName?: string;
    fatherName?: string;
    employeeCode?: string;
  };
  grossPay: number;
  netPay: number;
  components: PayslipComponent[];
}

const PayslipTable: React.FC<{ payslip: Payslip }> = ({ payslip }) => {
  const tableData = useMemo(() => {
    const earnings = payslip.components
      .filter(
        (c) =>
          c.salaryRule?.category?.name !== "Tax" &&
          c.salaryRule?.category?.name !== "Pension"
      )
      .map((c) => ({
        type: "Earning",
        description: c.salaryRule?.name || "Unknown",
        amount: c.amount,
      }));

    const deductions = payslip.components
      .filter(
        (c) =>
          c.salaryRule?.category?.name === "Tax" ||
          c.salaryRule?.category?.name === "Pension"
      )
      .map((c) => ({
        type: "Deduction",
        description: c.salaryRule?.name || "Unknown",
        amount: c.amount,
      }));

    return [
      ...earnings,
      ...deductions,
      { type: "Summary", description: "Gross Pay", amount: payslip.grossPay },
      { type: "Summary", description: "Net Pay", amount: payslip.netPay },
    ];
  }, [payslip]);

  const columns = useMemo<MRT_ColumnDef<(typeof tableData)[0]>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        size: 120,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 250,
      },
      {
        accessorKey: "amount",
        header: "Amount (ETB)",
        size: 150,
        Cell: ({ cell, row }) => (
          <span
            style={{
              fontWeight: row.original.type === "Summary" ? 700 : 500,
              color:
                row.original.type === "Deduction"
                  ? "red"
                  : row.original.type === "Earning"
                  ? "green"
                  : "black",
            }}
          >
            {cell.getValue<number>().toLocaleString("en-ET", {
              style: "currency",
              currency: "ETB",
            })}
          </span>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
  });

  return <MaterialReactTable table={table} />;
};

export default PayslipTable;
