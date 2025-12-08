import { Box, Skeleton } from "@mui/material";
import React, { Suspense } from "react";

const SalaryRules = React.lazy(
  () => import("../_components/salary-structure-rule")
);

const SalaryRulesPage = () => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rectangular" height={60} animation="wave" />
          <Skeleton variant="rectangular" height={300} animation="wave" />
          <Skeleton variant="rectangular" height={100} animation="wave" />
        </Box>
      }
    >
      <SalaryRules />
    </Suspense>
  );
};

export default SalaryRulesPage;
