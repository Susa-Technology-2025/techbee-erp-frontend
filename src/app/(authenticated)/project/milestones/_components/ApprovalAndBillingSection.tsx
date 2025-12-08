import {ApprovalRequiredField} from "./ApprovalAndBillingSectionFields"
import {BillableField} from "./ApprovalAndBillingSectionFields"
import {BillingAmountField} from "./ApprovalAndBillingSectionFields"
import {BillingScheduleField} from "./ApprovalAndBillingSectionFields"
import { Box } from "@mui/material";


export const ApprovalAndBillingSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ApprovalRequiredField/>
<BillableField/>
<BillingAmountField/>
<BillingScheduleField/>
      </Box>)
    }