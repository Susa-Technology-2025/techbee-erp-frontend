import {StatusField} from "./GeneralSectionFields"
import {UserIdField} from "./GeneralSectionFields"
import {EntryCodeField} from "./GeneralSectionFields"
import {PeriodStartField} from "./GeneralSectionFields"
import {PeriodEndField} from "./GeneralSectionFields"
import {TotalHoursField} from "./GeneralSectionFields"
import {TotalAmountField} from "./GeneralSectionFields"
import {RejectionReasonField} from "./GeneralSectionFields"
import {ApprovedAtField} from "./GeneralSectionFields"
import {SubmittedAtField} from "./GeneralSectionFields"
import {EntriesField} from "./GeneralSectionFields"
import {ApprovalRequiredField} from "./GeneralSectionFields"
import { Box } from "@mui/material";


export const GeneralSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <StatusField/>
<UserIdField/>
<EntryCodeField/>
<PeriodStartField/>
<PeriodEndField/>
<TotalHoursField/>
<TotalAmountField/>
<RejectionReasonField/>
<ApprovedAtField/>
<SubmittedAtField/>
<EntriesField/>
<ApprovalRequiredField/>
      </Box>)
    }