"use client"

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper"
import { approvalFlowSchema } from "@/lib/schemas/core/approval-policy"
import { AccountTree } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"

export default () => {
  return (
    <Box>
          <Box 
      sx={{
        display: "flex",
        alignItems: "center",
        p: "6px 42px",
        borderRadius: 1.5,
        gap: 1,
        // width: "100%",
        mb: 3,
        }}
      >
       <AccountTree sx={{ color: "#4a6cf7", fontSize: 30 }} />
   <Typography variant="h5" fontWeight="bold" color="secondary.main">Approval Policy </Typography>
      </Box>

  <Box sx={{maxWidth: 1500}}>
  <MaterialTableWrapper  schema = {approvalFlowSchema}/>
  </Box>
  </Box>
  );
}