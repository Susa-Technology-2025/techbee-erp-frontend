import {ApprovedAtField} from "./ApprovalSectionFields"
import {RejectionReasonField} from "./ApprovalSectionFields"
import { Box } from "@mui/material";


export const ApprovalSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ApprovedAtField/>
<RejectionReasonField/>
      </Box>)
    }