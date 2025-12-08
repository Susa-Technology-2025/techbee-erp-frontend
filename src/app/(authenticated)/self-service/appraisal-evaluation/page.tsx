"use client";

// app/appraisal-plans/page.tsx
import React from "react";
import AppraisalPlansPage from "./_components/AppraisalPlansPage";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { AppraisalPlansResponse } from "./types/types";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

// This would typically come from an API call

export default function AppraisalPlans() {
  // In a real application, you would fetch this from your API
  // For now, we'll use the provided data

  const [employeeId, setEmployeeId] = React.useState<string | null>(null);
  const session = useSelector((state: RootState) => state.session);

  React.useEffect(() => {
    if (session?.user?.employeeId) {
      setEmployeeId(session.user.employeeId);
    }
  }, [session]);

  const {
    data: appraisalPlansData,
    isLoading,
    error,
  } = useDataQuery<AppraisalPlansResponse>({
    apiEndPoint: employeeId
      ? `https://api.techbee.et/api/hr/appraisalPlans/my-plans/${employeeId}`
      : "",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }

  const data = appraisalPlansData;

  return (
    <main>
      <AppraisalPlansPage data={data} employee={employeeId} />
    </main>
  );
}
