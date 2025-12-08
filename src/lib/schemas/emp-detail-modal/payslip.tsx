"use client";
import Payslips from "@/app/(authenticated)/hr/payroll/payslips/page";

export const PayslipsTab = ({ row }: any) => {
  return <Payslips id={row.id} />;
};
